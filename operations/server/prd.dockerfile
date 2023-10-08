FROM --platform=linux/x86_64 node:18-slim AS plaax-nodejs18-aws2-linux-server
# The base image for distbuilder, to avoid reinstalling all node modules.
# See .dockerignore for all globally ignored files

LABEL version="1.0"
LABEL description="The base nodejs 18 image for fixed platform as linux x86-64 \
with extra packages (aws-cli2, zip, tini, etc.) for a serverful backend."

RUN apt-get update
RUN apt-get install -y procps
RUN apt-get install -y tini

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

# installation files
COPY ./.npmrc ./
COPY ./package.json ./
COPY ./package-lock.json ./
COPY --chmod=755 ./package.scripts.sh ./

# install the main packages
RUN npm ci 2>&1 | tee -a install-core.log

# installation files server-specific
# stated explicitly so basebuilder is re-built when they changes
COPY ./src/app/server/.npmrc ./src/app/server/.npmrc
COPY ./src/app/server/package.json ./src/app/server/package.json
COPY ./src/app/server/package-lock.json ./src/app/server/package-lock.json

# install server-specific app packages
RUN cd ./src/app/server && npm ci 2>&1 | tee -a install-server.log



FROM plaax-nodejs18-aws2-linux-server AS distbuilder
# The distribution builder: run tests and compile typescript.

# test & build files
COPY ./.jest ./.jest
COPY ./__mocks__ ./__mocks__
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./jest.config.js ./
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

# source files
COPY ./src/__tests__ ./src/__tests__
COPY ./src/core ./src/core
COPY ./src/app/server ./src/app/server

# install server-specific app packages
RUN cd ./src/app/server && npm run build 2>&1 | tee -a build.log



FROM plaax-nodejs18-aws2-linux-server AS runner
# The final container for running the service.

ENV NODE_ENV production

ARG EXEC_USER_GROUP=node:node
ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/package.json .
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/package-lock.json .
RUN npm ci --omit=dev 2>&1 | tee -a install-core-prd.log # no dev dependencies - install the shared packages

COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/dist ./src/app/server/dist
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/package.json ./src/app/server/package.json
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/package-lock.json ./src/app/server/package-lock.json
RUN cd ./src/app/server && npm ci --omit=dev 2>&1 | tee -a install-server-prd.log # no dev dependencies - install the shared packages

# init system for a proper signal handling
ENTRYPOINT ["tini", "--"]

# Run processes in the container with low privileged user and proper filesystem permissions.
RUN chown -R ${EXEC_USER_GROUP} ${CONTAINER_WORKING_DIR}
USER ${EXEC_USER_GROUP}

# The container listens on the stated network ports during runtime
# docker run -p 80:80/tcp -p 80:80/udp ...
EXPOSE 3010

# Note: CMD is overridden when container is run with -it...sh
CMD cd ./src/app/server && npm run start-prd 2>&1 | tee -a run.log

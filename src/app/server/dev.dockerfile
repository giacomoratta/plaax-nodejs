FROM --platform=linux/x86_64 node:18-slim AS basebuilder
# The base image for distbuilder, to avoid reinstalling all node modules.

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



FROM basebuilder AS distbuilder
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



FROM distbuilder AS runner
# The final container for running the service.

RUN apt-get update
RUN apt-get install -y procps
RUN apt-get install -y tini

ENV NODE_ENV development

ARG EXEC_USER_GROUP=node:node
ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

# init system for a proper signal handling
ENTRYPOINT ["tini", "--"]

# Run processes in the container with low privileged user and proper filesystem permissions.
RUN chown -R ${EXEC_USER_GROUP} ${CONTAINER_WORKING_DIR}
USER ${EXEC_USER_GROUP}

# The container listens on the stated network ports during runtime
# docker run -p 80:80/tcp -p 80:80/udp ...
EXPOSE 3000

# Note: CMD is overridden when container is run with -it...sh
CMD cd ./src/app/server && npm run start-dev 2>&1 | tee -a run.log

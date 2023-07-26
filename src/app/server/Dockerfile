FROM node:18-slim AS basebuilder
# The base image for distbuilder, to avoid reinstalling all node modules.

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ../../../package.json ./

# npm clean-install
RUN npm ci


FROM basebuilder AS distbuilder
# The distribution builder: run tests and compile typescript.

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ../.. ./src
COPY ../../../.eslintignore ./
COPY ../../../.eslintrc.js ./
COPY ../../../jest.config.js ./
COPY ../../../tsconfig.eslint.json ./
COPY tsconfig.build.json ./
COPY ../../../tsconfig.eslint.json ./
COPY ../../../tsconfig.json ./

RUN npm run test
RUN npm run build


FROM node:18-slim AS runner
# The final container for running the service.

ENV NODE_ENV production

ARG EXEC_USER_GROUP=node:node
ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/dist ./dist
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/package.json .

# npm clean-install
RUN npm ci --omit=dev # no dev dependencies

RUN apt-get update
RUN apt-get install -y procps
RUN apt-get install -y tini

# init system for a proper signal handling
ENTRYPOINT ["tini", "--"]

# Run processes in the container with low privileged user and proper filesystem permissions.
RUN chown -R ${EXEC_USER_GROUP} ${CONTAINER_WORKING_DIR}
USER ${EXEC_USER_GROUP}

# docker run -p 80:80/tcp -p 80:80/udp ...
EXPOSE 3000

CMD npm run start

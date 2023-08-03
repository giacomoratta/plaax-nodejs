FROM --platform=linux/x86_64 node:18-slim AS basebuilder
# The base image for distbuilder, to avoid reinstalling all node modules.

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci


FROM basebuilder AS distbuilder
# The distribution builder: run tests and compile typescript.

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./src/__tests__ ./src/__tests__
COPY ./src/core ./src/core
COPY ./src/app/server/src ./src/app/server/src
COPY ./src/app/server/package.json ./src/app/server/
COPY ./src/app/server/package-lock.json ./src/app/server/
COPY ./src/app/server/tsconfig.server.build.json ./src/app/server/
COPY ./.jest ./.jest
COPY ./__mocks__ ./__mocks__
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./.npmrc ./
COPY ./jest.config.js ./
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

RUN cd ./src/app/server && npm ci

RUN npm run test-server

RUN cd ./src/app/server && npm run build

FROM --platform=linux/x86_64 node:18-slim AS runner
# The final container for running the service.

RUN apt-get update
RUN apt-get install -y procps
RUN apt-get install -y tini

# ENV NODE_ENV production
ENV NODE_ENV development

ARG EXEC_USER_GROUP=node:node
ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/package.json .
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/package-lock.json .
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/dist ./dist
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/package.json ./dist/app/server
COPY --from=distbuilder ${CONTAINER_WORKING_DIR}/src/app/server/package-lock.json ./dist/app/server

RUN npm ci --omit=dev # no dev dependencies - install the shared packages
RUN cd ./dist/app/server && npm ci --omit=dev # no dev dependencies - install the packages for server app


# init system for a proper signal handling
ENTRYPOINT ["tini", "--"]

# Run processes in the container with low privileged user and proper filesystem permissions.
RUN chown -R ${EXEC_USER_GROUP} ${CONTAINER_WORKING_DIR}
USER ${EXEC_USER_GROUP}

# docker run -p 80:80/tcp -p 80:80/udp ...
EXPOSE 3000

CMD cd ./dist/app/server && npm run start

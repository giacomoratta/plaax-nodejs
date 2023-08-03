# TODO: separate nodejs-platform in another image [Dockerfile.node-platform]
# TODO: publish nodejs-platform1 on personal docker hub under personal namespace (it does not work locally)

FROM --platform=linux/x86_64 node:18-slim AS plaax-nodejs18-aws2-linux

LABEL version="1.0"
LABEL description="The base nodejs 18 image for fixed platform as linux x86-64 \
with extra packages (aws-cli2, zip, etc.)."

RUN apt-get -y update

# basic packages
RUN apt-get -y install curl
RUN apt-get -y install unzip
RUN apt-get -y install zip

# aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip
RUN ./aws/install && aws --version



FROM plaax-nodejs18-aws2-linux AS plaax-release

LABEL version="1.0"
LABEL description="Files and scripts needed to build and release: it must be run as container.\
All sensitive data (e.g. AWS credentials) must be passed to the container as env variables."

# Expected build args
ARG release_hash

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs
WORKDIR ${CONTAINER_WORKING_DIR}

# installation
COPY ./.npmrc ./
COPY ./package.json ./
COPY ./package-lock.json ./
COPY --chmod=755 ./package.scripts.sh ./

# testing
COPY ./.jest ./.jest
COPY ./__mocks__ ./__mocks__
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./jest.config.js ./

# building
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

# source files
COPY ./src/__tests__ ./src/__tests__
COPY ./src/core ./src/core
COPY ./src/app/aws-lambdas ./src/app/aws-lambdas

# operations
COPY --chmod=755 ./operations/aws-lambdas/utils ./operations/aws-lambdas/utils
COPY --chmod=755 ./operations/aws-lambdas/build-release ./operations/aws-lambdas/build-release

# environment variables for operations
ENV RELEASE_HASH $release_hash
RUN echo "(env) RELEASE_HASH=$RELEASE_HASH"

# run build operations
RUN ./operations/aws-lambdas/build-release/build.sh 2>&1 | tee -a build.log
RUN ./operations/aws-lambdas/build-release/bundle-zip.sh 2>&1 | tee -a bundle-zip.log


# Note: CMD is overridden when container is run with -it...sh
CMD ./operations/aws-lambdas/build-release/release.sh

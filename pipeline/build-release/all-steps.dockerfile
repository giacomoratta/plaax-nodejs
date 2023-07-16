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



FROM plaax-nodejs18-aws2-linux AS plaax-base-install

LABEL version="1.0"
LABEL description="The base image with full installation."

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./package.json ./

# needed by 'npm ci'
COPY ./package-lock.json ./

# npm clean-install
RUN npm ci



FROM plaax-base-install AS plaax-release

LABEL version="1.0"
LABEL description="Files and scripts needed to build and release: it must be run as container.\
All sensitive data (e.g. AWS credentials) must be passed to the container as env variables."

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./.jest ./.jest
COPY ./__mocks__ ./__mocks__
COPY --chmod=755 ./pipeline/build-release ./pipeline/build-release
COPY ./src ./src
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./.npmrc ./
COPY ./jest.config.js ./
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

# RUN npm test

# Note: CMD is overridden when container is run with -it...sh
CMD ./pipeline/build-release/all-steps.sh

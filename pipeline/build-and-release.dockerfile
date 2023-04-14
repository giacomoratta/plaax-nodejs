# TODO: separate nodejs-platform in another image [Dockerfile.node-platform]
# TODO: publish nodejs-platform1 on personal docker hub under personal namespace (it does not work locally)

FROM --platform=linux/x86_64 node:18-slim AS plaax-nodejs18-aws2-linux
# The base nodejs 18 image for fixed platform as linux x86-64
# with extra packages (aws-cli2, zip, etc.)

#LABEL version="1.0"
#LABEL description="This text illustrates \
#that label-values can span multiple lines."

RUN apt-get -y update

# basic packages
RUN apt-get -y install curl
RUN apt-get -y install unzip
RUN apt-get -y install zip

# aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip
RUN ./aws/install && aws --version


FROM plaax-nodejs18-aws2-linux AS plaax-base-install
# The base image with full installation

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./package.json ./

# npm clean-install
RUN npm ci


FROM plaax-base-install AS plaax-release
# The container will run the script to test, build and publish the release.
# All sensitive data (e.g. AWS credentials) must be passed to the container.

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY ./src ./src
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./jest.config.js ./
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

COPY --chmod=755 ./pipeline/build-and-release.sh ./

RUN npm test

CMD ./build-and-release.sh $ENV_NAME

# Note: CMD is overridden when container is run with -it...sh

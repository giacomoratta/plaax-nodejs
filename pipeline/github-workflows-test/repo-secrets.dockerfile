FROM --platform=linux/x86_64 node:18-slim AS plaax-nodejs18-aws2-linux

LABEL version="1.0"
LABEL description="The base nodejs 18 image for fixed platform as linux x86-64 \
with extra packages (aws-cli2, zip, etc.)."

RUN apt-get -y update

RUN printenv

## basic packages
#RUN apt-get -y install curl
#RUN apt-get -y install unzip
#RUN apt-get -y install zip
#
## aws cli
#RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip
#RUN ./aws/install && aws --version



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

COPY ./src ./src
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./jest.config.js ./
COPY ./tsconfig.eslint.json ./
COPY ./tsconfig.json ./

COPY --chmod=755 ./pipeline/build-release.sh ./

#COPY ./.jest ./.jest
#COPY ./__mocks__ ./__mocks__
#RUN npm test

CMD printenv

# Note: CMD is overridden when container is run with -it...sh
# CMD ./build-release.sh $RELEASE_HASH

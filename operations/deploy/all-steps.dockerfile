# TODO: change base image to ubuntu or light linux

FROM --platform=linux/x86_64 node:18-slim AS plaax-nodejs18-aws2-linux

LABEL version="1.0"
LABEL description="Files and scripts needed to deploy the stack: : it must be run as container.\
All sensitive data (e.g. AWS credentials) must be passed to the container as env variables."

RUN apt-get -y update

# basic packages
RUN apt-get -y install curl
RUN apt-get -y install unzip
RUN apt-get -y install zip

# aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip
RUN ./aws/install && aws --version


FROM plaax-nodejs18-aws2-linux AS plaax-deploy

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')
# $ENV_NAME (e.g. 'dev')

ARG CONTAINER_WORKING_DIR=/home/plaax-nodejs

WORKDIR ${CONTAINER_WORKING_DIR}

COPY --chmod=755 ./operations/utils ./operations/utils
COPY --chmod=755 ./operations/deploy ./operations/deploy

# Note: CMD is overridden when container is run with -it...sh
CMD ./operations/deploy/deploy.sh

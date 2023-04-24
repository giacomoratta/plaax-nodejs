#!/bin/bash

# This script executes (and kills) a docker container from deploy.dockerfile
# by passing arguments with some local sensitive data.

DOCKER_IMAGE_NAME="gr/plaax-nodejs/deploy"

# Build docker image for deploy
if [[ "$1" = "--build" ]]
then
  docker build -t $DOCKER_IMAGE_NAME -f ../deploy.dockerfile ../../
fi


# Prepare local env for aws
source utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi


# Set other env. variables for the container
export ENV_NAME="dev"
export GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)


# Run container for publishing release
# --rm: remove after the execution
docker run --rm \
  --platform linux/x86_64 \
  --env ENV_NAME \
  --env GIT_COMMIT_SHORT \
  --env AWS_ACCESS_KEY_ID \
  --env AWS_SECRET_ACCESS_KEY \
  --env AWS_DEFAULT_REGION \
  --env AWS_REGION \
  --env AWS_DEFAULT_OUTPUT \
  $DOCKER_IMAGE_NAME

# Notes:
# 1) do not use "--env AWS_PROFILE" to prevent the error: "The config profile (...) could not be found"

# Useful commands to build and run
# 1 dir-levels behind:  docker build -t gr/plaax-nodejs/deploy -f ./pipeline/deploy.dockerfile .
# 2 dir-levels behind:  docker build -t gr/plaax-nodejs/deploy -f deploy.dockerfile ../
# This dir-level:       docker build -t gr/plaax-nodejs/deploy -f deploy.dockerfile ../../
# Run as SH and remove: docker run --rm -it gr/plaax-nodejs/deploy sh
#!/bin/bash
set -e

# This script executes (and kills) a docker container from build-release.dockerfile
# by passing arguments with some local sensitive data.

DOCKER_IMAGE_NAME="gr/plaax-nodejs/build-release"
RELEASE_HASH=$(git rev-parse HEAD)

# Build docker image for build-release
if [[ "$1" = "--build" ]]
then
  docker build \
    -t $DOCKER_IMAGE_NAME \
    --build-arg release_hash=$RELEASE_HASH \
    -f ./operations/build-release/all-steps.dockerfile .

elif [[ "$1" = "--sh" ]]
then
  docker run --rm -it $DOCKER_IMAGE_NAME sh

elif [[ "$1" = "--run" ]]
then
  # Prepare local env for aws
  source ./operations/local/utility.set-aws-env.local.sh
  RETURNED_VALUE=$?
  if [ $RETURNED_VALUE -ne 0 ]
  then
    # not the correct aws local setup!
    exit
  fi

  # Run container for publishing release
  #  > "--rm" removes after the execution
  docker run --rm \
    --platform linux/x86_64 \
    --env AWS_ACCESS_KEY_ID \
    --env AWS_SECRET_ACCESS_KEY \
    $DOCKER_IMAGE_NAME

else
  printf "Parameter #1 not valid (current '$1'). Accepted options: --build, -sh, --run.\n\n"
fi


# Notes:
# 1) do not use "--env AWS_PROFILE" to prevent the error: "The config profile (...) could not be found"

# Useful commands to build and run
# 1 dir-levels behind:  docker build -t gr/plaax-nodejs/build-release -f ./operations/build-release.dockerfile .
# 2 dir-levels behind:  docker build -t gr/plaax-nodejs/build-release -f build-release.dockerfile ../
# This dir-level:       docker build -t gr/plaax-nodejs/build-release -f build-release.dockerfile ../../
# Run as SH and remove: docker run --rm -it gr/plaax-nodejs/build-release sh

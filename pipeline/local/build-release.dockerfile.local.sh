#!/bin/bash
set -e

# This script executes (and kills) a docker container from build-release.dockerfile
# by passing arguments with some local sensitive data.

DOCKER_IMAGE_NAME="gr/plaax-nodejs/build-release"

# Build docker image for build-release
if [[ "$1" = "--build" ]]
then
  docker build -t $DOCKER_IMAGE_NAME -f ../build-release.dockerfile ../../
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


# release-hash-to-delete=432g86g23
# release-hash=g23984g3f
# aws s3 rm s3://mybucket/test2.txt

# read release-hash-latest
# aws s3 delete previous release hash (no errors if not exists)
# generate new hash and save to release-hash-latest
# set GIT_COMMIT_SHORT with timestamp ...  date +"%s"


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
# 1 dir-levels behind:  docker build -t gr/plaax-nodejs/build-release -f ./pipeline/build-release.dockerfile .
# 2 dir-levels behind:  docker build -t gr/plaax-nodejs/build-release -f build-release.dockerfile ../
# This dir-level:       docker build -t gr/plaax-nodejs/build-release -f build-release.dockerfile ../../
# Run as SH and remove: docker run --rm -it gr/plaax-nodejs/build-release sh
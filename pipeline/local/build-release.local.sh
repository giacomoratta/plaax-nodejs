#!/bin/bash
set -e

# This script is a wrapper for build-release.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).

# How-to RUN. This script must be executed from its directory: "source ./build-release.local.sh".


# Set other env. variables for the container
export ENV_NAME="dev"
export GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)

# Prepare local env for aws
source utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi

CURRENT_DIRECTORY=$(pwd)
cd ../../

# Prepare local env for node/npm
nvm use

source ./pipeline/build-release.sh $ENV_NAME
RETURNED_VALUE=$?

if [ $RETURNED_VALUE -eq 1 ]
then
  printf "Something went wrong...\n"
  exit
fi

printf "Cleaning...\n"
RELEASE_ZIP_FILENAME="release-"$GIT_COMMIT_SHORT".zip"
printf "- $RELEASE_ZIP_FILENAME\n" && rm -f $RELEASE_ZIP_FILENAME
printf "\n\n"

cd $CURRENT_DIRECTORY

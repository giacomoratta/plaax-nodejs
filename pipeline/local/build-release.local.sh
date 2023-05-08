#!/bin/bash
set -e

# This script is a wrapper for build-release.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).

# How-to RUN. This script must be executed from its directory: "source ./build-release.local.sh".

# Prepare release hashes
source utility.release-hash.local.sh --generate

# Set variables for the container
ENV_NAME="dev"
RELEASE_HASH=$RELEASE_HASH_GENERATED
RELEASE_HASH_TO_DELETE=$RELEASE_HASH_PREVIOUS


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

source ./pipeline/build-release.sh $ENV_NAME $RELEASE_HASH $RELEASE_HASH_TO_DELETE
RETURNED_VALUE=$?

printf "\n\n"

if [ $RETURNED_VALUE -eq 1 ]
then
  printf "Something went wrong...\n"
  exit
fi

cd $CURRENT_DIRECTORY

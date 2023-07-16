#!/bin/bash
set -e

# This script is a wrapper for build-release.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).

# How-to RUN. This script must be executed from its directory: "source ./build-release.local.sh".

# Prepare release hashes
source utility.release-hash.local.sh --generate

# Set environment variables
export RELEASE_HASH=$RELEASE_HASH_GENERATED
RELEASE_HASH_TO_DELETE=$RELEASE_HASH_PREVIOUS


# Prepare local env for aws
source utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi

# (temp solution) Delete an old releases
if [ ${#RELEASE_HASH_TO_DELETE} -gt 2 ]
then
    S3_RELEASES_DIRECTORY="s3://plaax-dev-releases/"
    RELEASE_LBAPI1_LABEL="release-lbapi1"
    RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_HASH_TO_DELETE".zip"
    printf "\nDeleting old release lbapi1: $RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME from $S3_RELEASES_DIRECTORY...\n"
    aws s3 rm $S3_RELEASES_DIRECTORY""$RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME
    rm -f $RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME 2>/dev/null
fi

CURRENT_DIRECTORY=$(pwd)
cd ../../

# Prepare local env for node/npm
nvm use

source ./pipeline/build-release/all-steps.sh
RETURNED_VALUE=$?

printf "\n\n"

if [ $RETURNED_VALUE -eq 1 ]
then
  printf "Something went wrong...\n"
  exit
fi

cd $CURRENT_DIRECTORY

#!/bin/bash

# This script is a wrapper for aws-cfn.operations.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).

# How-to RUN. This script must be executed from its directory: "source ./aws-cfn-stack.local.sh".


# Prepare release hashes
source utility.release-hash.local.sh --load
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # no release hash found!
  exit
fi


# Set variables for the container
ENV_NAME="dev"
RELEASE_HASH=$RELEASE_HASH_LOADED


# Check arguments
if [ $# -ne 1 ]
  then
    printf "Missing argument #1 operation (e.g. '--delete', '--deploy', etc.).\n"
    exit
fi


# Prepare local env for aws
source ./utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi

CURRENT_DIRECTORY=$(pwd)
cd ../

# Run the main script
source ./aws-cfn.operations.sh $ENV_NAME $RELEASE_HASH $1

cd $CURRENT_DIRECTORY

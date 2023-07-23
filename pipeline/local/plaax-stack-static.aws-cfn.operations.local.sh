#!/bin/bash

# This script is a wrapper for plaax-stack-static.aws-cfn.operations.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).


# Set variables for the container
ENV_NAME="dev"


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
source ./plaax-stack-static.aws-cfn.operations.sh $ENV_NAME $1

cd $CURRENT_DIRECTORY

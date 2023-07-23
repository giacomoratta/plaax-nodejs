#!/bin/bash

# This script is a wrapper for plaax-stack.aws-cfn.operations.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).


# Set environment variables
export RELEASE_HASH=$(git rev-parse HEAD)
export ENV_NAME="dev"


# Check arguments
if [ $# -ne 1 ]
  then
    printf "Missing argument #1 operation (e.g. '--delete', '--deploy', etc.).\n"
    exit
fi


# Prepare local env for aws
source ./pipeline/local/utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi


# Check $ENV_NAME allowed values
source ./pipeline/utils/aws-release.utils.sh --exit-on-invalid-env-name $ENV_NAME


# Get the latest published release label ($LATEST_RELEASE_LABEL)
source ./pipeline/utils/aws-release.utils.sh --check-latest-published-releases


# Run the main script
source ./pipeline/deploy/plaax-stack.aws-cfn.operations.sh $ENV_NAME $LATEST_RELEASE_LABEL $1

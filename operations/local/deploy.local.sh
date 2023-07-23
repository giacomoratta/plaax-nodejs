#!/bin/bash
set -e

# This script is a wrapper for deploy/all-steps.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).


# Set environment variables
export RELEASE_HASH=$(git rev-parse HEAD)
export ENV_NAME="dev"

# Prepare local env for aws
source ./operations/local/utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  exit
fi

# Prepare local env for node/npm
nvm use

source ./operations/deploy/all-steps.sh
RETURNED_VALUE=$?

printf "\n\n"

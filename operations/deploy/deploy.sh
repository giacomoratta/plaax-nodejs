#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')
# $ENV_NAME (e.g. 'dev')

# Re-exported because it is needed by included scripts
export RELEASE_HASH=$RELEASE_HASH


# Check $ENV_NAME allowed values
source ./operations/utils/aws-release.utils.sh --exit-on-invalid-env-name $ENV_NAME


# Get the latest published release label ($LATEST_RELEASE_LABEL)
source ./operations/utils/aws-release.utils.sh --check-latest-published-releases


# Deploy the stack
./operations/deploy/plaax-stack.aws-cfn.operations.sh \
  $ENV_NAME \
  $LATEST_RELEASE_LABEL \
  --deploy

#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# - no variables expected

ENV_NAME=dev # todo: set outside, check here

# Check $ENV_NAME allowed values
source ./operations/utils/aws-release.utils.sh --exit-on-invalid-env-name $ENV_NAME

./operations/deploy/plaax-stack-static.aws-cfn.operations.sh \
  $ENV_NAME \
  --deploy

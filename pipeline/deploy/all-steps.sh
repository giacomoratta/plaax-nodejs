#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')

export RELEASE_HASH=$RELEASE_HASH
ENV_NAME=dev # todo: set outside, check here

# Check $RELEASE_HASH
if [ ${#RELEASE_HASH} -lt 2 ]
  then
    printf "Missing RELEASE_HASH environment variable! \n"
    exit 1
fi

chmod +x ./pipeline/utils/*.sh
chmod +x ./pipeline/deploy/*.sh


# Get the latest published release label ($LATEST_RELEASE_LABEL)
source ./pipeline/utils/aws-release.utils.sh --check-latest-published-releases

./pipeline/deploy/plaax-stack.aws-cfn.operations.sh \
  $ENV_NAME \
  $LATEST_RELEASE_LABEL \
  --deploy

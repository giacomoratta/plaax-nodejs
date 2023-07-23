#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# - no variables expected

ENV_NAME=dev # todo: set outside, check here

chmod +x ./pipeline/deploy/*.sh

./pipeline/deploy/plaax-stack-static.aws-cfn.operations.sh $ENV_NAME --deploy

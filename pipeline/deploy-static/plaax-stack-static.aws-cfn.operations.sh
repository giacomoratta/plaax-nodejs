#!/bin/bash

# ABOUT THE SCRIPT
# - it is a multi-purpose script for some cloudformation most used commands;
# - for "--deploy" operation, it deploys the CloudFormation stack from the template "plaax-stack-static.aws-cfn.yml",
#   with some additional template parameters.

# ARGUMENTS
#  $1 = env-name (e.g. "dev", "prd", etc.)
#  $2 = operation (e.g. '--delete', '--deploy', etc.)


#Exit immediately if a command exits with a non-zero status.
set -e


# Variables and parameters
ENV_NAME=$1
OPERATION=$2
STACK_NAME="PlaaxStack-Static-$ENV_NAME"
RESOURCE_PREFIX="plaax-$ENV_NAME"

printf "\nScript parameters:\n"
printf " param \$1 (env-name) = $1\n"
printf " param \$2 (operation) = $2\n"

printf "\nVariables:\n"
printf " OPERATION = $OPERATION\n"
printf " STACK_NAME = $STACK_NAME\n"
printf " ENV_NAME = $ENV_NAME\n"
printf " RESOURCE_PREFIX = $RESOURCE_PREFIX\n"
printf "\n"


# Check arguments
if [ $# -lt 1 ]
  then
    printf "Missing some mandatory arguments:\n"
    printf "  Argument #1 env-name (e.g. 'dev', 'prd', etc.).\n"
    printf "  Argument #2 operation (e.g. '--delete', '--deploy', etc.).\n"
    printf "\n"
    exit 1
fi


# Deploy stack
if [[ "$OPERATION" = "--deploy" ]]
then
  # Deploys the specified AWS CloudFormation template by creating and then executing a change set.
  # The command terminates after AWS CloudFormation executes the change set.
  # If you want to view the change set before AWS CloudFormation executes it, use the --no-execute-changeset flag.
  # To update a stack, specify the name of an existing stack. To create a new stack, specify a new stack name.
  # https://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html

  # Deploy Stack
  printf "Deploying the stack '$STACK_NAME'...\n\n"
  aws cloudformation deploy \
  --template-file ./pipeline/deploy-static/plaax-stack-static.aws-cfn.yml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EnvName=$ENV_NAME \
    ResourcePrefix=$RESOURCE_PREFIX
  exit
fi


# Delete stack
if [[ "$OPERATION" = "--delete" ]]
then
  printf "Deleting stack '$STACK_NAME'...\n\n"
  aws cloudformation delete-stack --stack-name $STACK_NAME
  exit
fi


# Get stack events
if [[ "$OPERATION" = "--events" ]]
then
  printf "Events of the stack '$STACK_NAME':\n\n"
  aws cloudformation describe-stack-events --stack-name $STACK_NAME
  exit
fi


# Describe stack
if [[ "$OPERATION" = "--describe" ]]
then
  printf "Stack info for '$STACK_NAME':\n\n"
  aws cloudformation describe-stacks --stack-name $STACK_NAME
  exit
fi


# Get active stacks
if [[ "$OPERATION" = "--active-stacks" ]]
then
  printf "Listing all stacks with status 'CREATE_COMPLETE'...\n\n"
  aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
  exit
fi


# Create initial data
if [[ "$OPERATION" = "--init-data" ]]
then
  printf "Creating initial data for some resources...\n\n"
  plaaxUniqueIdsFiles=( ../pipeline/deploy-static/initial-static-data/plaax-unique-ids/*.json )
  for entry in $plaaxUniqueIdsFiles
    do
      echo $entry
      aws dynamodb put-item \
      --table-name "$RESOURCE_PREFIX-unique-ids" \
      --item file://$entry
    done
  exit
fi

printf "\nUnknown operation.\n\n"
#!/bin/bash

# ABOUT THE SCRIPT
# - it is a multi-purpose script for some cloudformation most used commands;
# - for "--deploy" operation, it deploys the CloudFormation stack from the template "aws-cfn-stack.yml",
#   with some additional template parameters.

# ARGUMENTS
#  $1 = env-name (e.g. "dev", "prd", etc.)
#  $2 = operation (e.g. '--delete', '--deploy', etc.)

# HOW-TO
# Run. This script must be executed from its location.


#Exit immediately if a command exits with a non-zero status.
set -e


# Variables and parameters
ENV_NAME=$1
COMMAND=$2
STACK_NAME="PlaaxStackT1-$ENV_NAME"

printf "\nScript parameters:\n"
printf " param \$1 (env-name) = $1\n"
printf " param \$2 (operation) = $2\n"

printf "\nVariables:\n"
printf " ENV_NAME = $ENV_NAME\n"
printf " COMMAND = $COMMAND\n"
printf " STACK_NAME = $STACK_NAME\n"
printf " GIT_COMMIT_SHORT = $GIT_COMMIT_SHORT\n"
printf "\n"


# Check arguments
if [ $# -lt 2 ]
  then
    printf "Missing some mandatory arguments:\n"
    printf "  Argument #1 env-name (e.g. 'dev', 'prd', etc.).\n"
    printf "  Argument #2 operation (e.g. '--delete', '--deploy', etc.).\n"
    printf "\n"
    exit 1
fi


# Check mandatory env. var. GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)
if [ -z $GIT_COMMIT_SHORT ]
then
    printf "\$GIT_COMMIT_SHORT is empty\n"
    exit 1
fi


# Deploy stack
if [[ "$COMMAND" = "--deploy" ]]
then
  # Deploys the specified AWS CloudFormation template by creating and then executing a change set.
  # The command terminates after AWS CloudFormation executes the change set.
  # If you want to view the change set before AWS CloudFormation executes it, use the --no-execute-changeset flag.
  # To update a stack, specify the name of an existing stack. To create a new stack, specify a new stack name.
  # https://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html

  # Deploy Stack
  printf "Deploying the stack '$STACK_NAME'...\n\n"
  aws cloudformation deploy \
  --template-file ./aws-cfn-stack.yml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EnvName=$ENV_NAME \
    GitCommitShort=$GIT_COMMIT_SHORT
  exit
fi


# Delete stack
if [[ "$COMMAND" = "--delete" ]]
then
  printf "Deleting stack '$STACK_NAME'...\n\n"
  aws cloudformation delete-stack --stack-name $STACK_NAME
  exit
fi


# Get stack events
if [[ "$COMMAND" = "--events" ]]
then
  printf "Events of the stack '$STACK_NAME':\n\n"
  aws cloudformation describe-stack-events --stack-name $STACK_NAME
  exit
fi


# Describe stack
if [[ "$COMMAND" = "--describe" ]]
then
  printf "Stack info for '$STACK_NAME':\n\n"
  aws cloudformation describe-stacks --stack-name $STACK_NAME
  exit
fi


# Get active stacks
if [[ "$COMMAND" = "--active-stacks" ]]
then
  printf "Listing all stacks with status 'CREATE_COMPLETE'...\n\n"
  aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
  exit
fi


# Create/Update Stack
## aws cloudformation update-stack \
#  aws cloudformation create-stack \
#  --stack-name StackTest008 \
#  --template-body file://../aws-cfn-stack.yml \
#  --capabilities CAPABILITY_NAMED_IAM \
#  --parameters ParameterKey=EnvName,ParameterValue=env008
#  --parameters EnvName=env006
#  --parameters Env=ImageId,ParameterValue=myLatestAMI
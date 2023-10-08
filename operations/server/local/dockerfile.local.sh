#!/bin/bash

# This script executes (and kills) a docker container from dev.dockerfile
# by passing arguments with some local sensitive data.


printf "\nPLAAX Server - DockerFile Manager: \n"

# Check arguments
if [ $# -lt 2 ]
  then
    printf "\nScript parameters:\n"
    printf " param \$1 (env-name) = $1\n"
    printf " param \$2 (operation) = $2\n"

    printf "\nMissing some mandatory arguments:\n"
    printf "  Argument #1 env-name (e.g. 'dev', 'prd', etc.).\n"
    printf "  Argument #2 operation (e.g. 'dev', 'prd', etc.).\n"
    printf "\n"
    exit 1
fi

# Set env. variables for the container
OPERATION=$2
export ENV_NAME=$1
export RELEASE_HASH=$(git rev-parse HEAD)
DOCKER_IMAGE_PREFIX="gr/plaax-nodejs/server"
DOCKER_IMAGE_NAME="$DOCKER_IMAGE_PREFIX-$ENV_NAME"

#printf "\nVariables:\n"
printf " OPERATION = $OPERATION\n"
printf " DOCKER_IMAGE_NAME = $DOCKER_IMAGE_NAME\n"
#printf " ENV_NAME = $ENV_NAME\n"
#printf " RELEASE_HASH = $RELEASE_HASH\n"
printf "\n"

# List all images with the specified prefix
if [[ "$OPERATION" = "--list-images" ]]
then
  docker image ls | awk -v img_name="$DOCKER_IMAGE_PREFIX" '$0 ~ img_name {print $0}'

# List all containers from the images with the specified prefix
elif [[ "$OPERATION" = "--list-containers" ]]
then
  docker container ls -a | awk -v img_name="$DOCKER_IMAGE_PREFIX" '$0 ~ img_name {print $0}'

# Remove all images with the specified prefix
elif [[ "$OPERATION" = "--rm-images" ]]
then
  IMAGES_TO_BE_REMOVED=$(docker image ls -a | awk -v img_name="$DOCKER_IMAGE_PREFIX" '$0 ~ img_name {print $1}')
  if [ ${#IMAGES_TO_BE_REMOVED} -lt 2 ]
  then
    printf "\nNo images found with image prefix $DOCKER_IMAGE_PREFIX .\n"
  else
    printf "\n\nRemoving the images $IMAGES_TO_BE_REMOVED... \n"
    docker rmi $IMAGES_TO_BE_REMOVED
  fi

# Remove all containers from the images with the specified prefix
elif [[ "$OPERATION" = "--rm-containers" ]]
then
  CONTAINERS_TO_BE_REMOVED=$(docker container ls -a | awk -v img_name="$DOCKER_IMAGE_PREFIX" '$0 ~ img_name {print $1}')
  if [ ${#CONTAINERS_TO_BE_REMOVED} -lt 2 ]
  then
    printf "\nNo containers found from image prefix $DOCKER_IMAGE_PREFIX .\n"
  else
    printf "\nStopping the containers $CONTAINERS_TO_BE_REMOVED... \n"
    docker stop $CONTAINERS_TO_BE_REMOVED

    printf "\n\nRemoving the containers $CONTAINER_TO_BE_REMOVED... \n"
    docker rm $CONTAINER_TO_BE_REMOVED
  fi

# Build docker image
elif [[ "$OPERATION" = "--build" ]]
then
  docker build -t $DOCKER_IMAGE_NAME -f ./operations/server/dev.dockerfile .

# Enter the image with a terminal
elif [[ "$OPERATION" = "--sh" ]]
then
  docker run --rm \
    --platform linux/x86_64 \
    -it $DOCKER_IMAGE_NAME sh

# Stop the running container
elif [[ "$OPERATION" = "--stop" ]]
then
  docker container ls
  CONTAINER_TO_BE_STOPPED=$(docker container ls | awk -v img_name="$DOCKER_IMAGE_NAME" '$0 ~ img_name {print $1}')
  if [ ${#CONTAINER_TO_BE_STOPPED} -lt 2 ]
  then
    printf "\nNo running containers found from image $DOCKER_IMAGE_NAME .\n"
  else
    printf "\nStopping the container $CONTAINER_TO_BE_STOPPED... \n"
    docker stop $CONTAINER_TO_BE_STOPPED
  fi

# Run a container
elif [[ "$OPERATION" = "--run" ]]
then
  # Prepare local env for aws
  source ./operations/server/local/utility.set-aws-env.local.sh
  RETURNED_VALUE=$?
  if [ $RETURNED_VALUE -ne 0 ]
  then
    # not the correct aws local setup!
    exit
  fi

  # Run container for deployment
  # --rm: remove after the execution
  docker run --rm \
    --platform linux/x86_64 \
    -p 5001:3010 \
    --env ENV_NAME \
    --env RELEASE_HASH \
    --env AWS_ACCESS_KEY_ID \
    --env AWS_SECRET_ACCESS_KEY \
    $DOCKER_IMAGE_NAME

else
  printf "Parameter #2 not valid (current '$OPERATION'). \n"
  printf "Accepted values: --build, --sh, --run, --stop, --list-containers, --list-images, --rm-containers, --rm-images.\n\n"
fi

# Notes:
# 1) do not use "--env AWS_PROFILE" to prevent the error: "The config profile (...) could not be found"

# Useful commands to build and run
# 1 dir-levels behind:  docker build -t gr/plaax-nodejs/deploy -f ./operations/aws-lambdas/deploy.dockerfile .
# 2 dir-levels behind:  docker build -t gr/plaax-nodejs/deploy -f deploy.dockerfile ../
# This dir-level:       docker build -t gr/plaax-nodejs/deploy -f deploy.dockerfile ../../
# Run as SH and remove: docker run --rm -it gr/plaax-nodejs/deploy sh

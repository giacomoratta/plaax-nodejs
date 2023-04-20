#!/bin/bash

# ABOUT THE SCRIPT
# - it builds and push the release (as zip file) to S3 releases bucket;
# - it is supposed to be copied inside the main level of the repository and executed from there.

# ARGUMENTS
#  $1 = env-name (e.g. "dev", "prd", etc.)

# HOW-TO
# Run. This script must be executed from the main level of repo (same level of "src" directory).


# Exit immediately if a command exits with a non-zero status.
set -e

# Variables and parameters
ENV_NAME="dev"
RELEASE_ZIP_FILENAME="release-"$GIT_COMMIT_SHORT".zip"
S3_RELEASES_DIRECTORY="s3://plaax-releases/"$ENV_NAME"/"


# Check arguments
if [ $# -ne 1 ]
  then
    printf "Missing argument #1 env-name (e.g. 'dev').\n"
    exit 1
else
  ENV_NAME=$1
fi

# Check mandatory env. var. GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)
if [ -z $GIT_COMMIT_SHORT ]
then
    printf "\$GIT_COMMIT_SHORT is empty\n"
    exit 1
fi

printf "\nBuilding the release...\n"
npm run clean
npm run build

printf "\nCreating release zip file...\n"
# TODO: add node_modules, package.json, etc. (?)
rm -f $RELEASE_ZIP_FILENAME 2>/dev/null
cd ./dist/
zip -r ../$RELEASE_ZIP_FILENAME .
cd ..

printf "\nUploading file "$RELEASE_ZIP_FILENAME" to "$S3_RELEASES_DIRECTORY" ...\n"
aws s3 cp $RELEASE_ZIP_FILENAME $S3_RELEASES_DIRECTORY

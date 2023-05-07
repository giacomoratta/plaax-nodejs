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

# Variables from script parameters
ENV_NAME="dev"
RELEASE_HASH=""
RELEASE_HASH_TO_DELETE=$3

# Check arguments
if [ $# -lt 2 ]
  then
    printf "Missing mandatory arguments:\n"
    printf " 1) env-name (e.g. 'dev').\n"
    printf " 2) release-hash (e.g. '31805e9').\n"
    exit 1
else
  ENV_NAME=$1
  RELEASE_HASH=$2
fi

# Script variables
RELEASE_ZIP_FILENAME="release-"$RELEASE_HASH".zip"
S3_RELEASES_DIRECTORY="s3://plaax-releases/"$ENV_NAME"/"


# Delete an old release
if [ ${#RELEASE_HASH_TO_DELETE} -gt 2 ]
then
    RELEASE_TO_DELETE_ZIP_FILENAME="release-"$RELEASE_HASH_TO_DELETE".zip"
    printf "\nDeleting old release: $RELEASE_TO_DELETE_ZIP_FILENAME from $S3_RELEASES_DIRECTORY...\n"
    aws s3 rm $S3_RELEASES_DIRECTORY""$RELEASE_TO_DELETE_ZIP_FILENAME
    printf "\n\n"
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

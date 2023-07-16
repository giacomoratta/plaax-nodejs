#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')

# Check $RELEASE_HASH
if [ ${#RELEASE_HASH} -lt 2 ]
  then
    printf "Missing RELEASE_HASH environment variable! \n"
    exit 1
fi

RELEASE_LBAPI1_LABEL="release-lbapi1"
RELEASE_LBAPI1_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_HASH".zip"
S3_RELEASES_DIRECTORY="s3://plaax-dev-releases/"

# AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} - set as ENV externally
# AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} - set as ENV externally
export AWS_DEFAULT_REGION=eu-west-1
export AWS_REGION=eu-west-1
export AWS_DEFAULT_OUTPUT=json

printf "\n\nAWS version:\n"
aws --version

printf "\n\nUploading releases to "$S3_RELEASES_DIRECTORY"\n"
printf "> uploading file "$RELEASE_LBAPI1_ZIP_FILENAME" ...\n"
aws s3 cp $RELEASE_LBAPI1_ZIP_FILENAME $S3_RELEASES_DIRECTORY

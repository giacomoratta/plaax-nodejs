#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Load current release filenames
source ./pipeline/utils/aws-release.utils.sh --load-current-local

# Check $RELEASE_LBAPI1_ZIP_FILENAME
if [ ${#RELEASE_LBAPI1_ZIP_FILENAME} -lt 2 ]
  then
    printf "Missing RELEASE_LBAPI1_ZIP_FILENAME! \n\n"
    exit 1
fi

# Check $S3_RELEASES_DIRECTORY
if [ ${#S3_RELEASES_DIRECTORY} -lt 2 ]
  then
    printf "Missing S3_RELEASES_DIRECTORY! \n\n"
    exit 1
fi


# Keep S3 bucket clean (versioning is disabled, so no lifecycle rules)
# todo: source ./pipeline/utils/aws-release.utils.sh --delete-current-remote


# AWS
printf "\n\nAWS version:\n"
aws --version

# AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} - set as ENV externally
# AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} - set as ENV externally
export AWS_DEFAULT_REGION=eu-west-1
export AWS_REGION=eu-west-1
export AWS_DEFAULT_OUTPUT=json

printf "\n\nUploading releases to "$S3_RELEASES_DIRECTORY"\n"
printf "> uploading file "$RELEASE_LBAPI1_ZIP_FILENAME" ...\n"
aws s3 cp $RELEASE_LBAPI1_ZIP_FILENAME $S3_RELEASES_DIRECTORY

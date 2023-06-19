#!/bin/bash

# ABOUT THE SCRIPT
# - it builds and push the release (as zip file) to S3 releases bucket;
# - it is supposed to be copied inside the main level of the repository and executed from there.

# ARGUMENTS
#  $1 = env-name (e.g. "dev", "prd", etc. - Pattern: /[a-z]{3,3}/ )
#  $2 = release-hash (e.g. '31805e9' - Pattern: /[a-z0-9]{8,}/ )

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
S3_RELEASES_DIRECTORY="s3://plaax-"$ENV_NAME"-releases/"
RELEASE_BASE_ZIP_FILENAME="release-base.zip"
RELEASE_LBAPI1_LABEL="release-lbapi1"
RELEASE_LBAPI1_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_HASH".zip"


# Delete an old releases
if [ ${#RELEASE_HASH_TO_DELETE} -gt 2 ]
then
    RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_HASH_TO_DELETE".zip"
    printf "\nDeleting old release lbapi1: $RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME from $S3_RELEASES_DIRECTORY...\n"
    aws s3 rm $S3_RELEASES_DIRECTORY""$RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME
    rm -f $RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME 2>/dev/null
fi


printf "\n\nBuilding the release...\n"
npm run clean
npm run build


printf "\n\nCreating base release zip file...\n"
rm -f $RELEASE_BASE_ZIP_FILENAME 2>/dev/null
zip $RELEASE_BASE_ZIP_FILENAME ./package.json
zip $RELEASE_BASE_ZIP_FILENAME ./package-lock.json
# not needed for now
# zip -r $RELEASE_BASE_ZIP_FILENAME ./node_modules >/dev/null # install with npm ci


printf "\n\nCreating lbapi1 release zip file...\n"
rm -f $RELEASE_LBAPI1_ZIP_FILENAME 2>/dev/null
cp $RELEASE_BASE_ZIP_FILENAME $RELEASE_LBAPI1_ZIP_FILENAME
cd ./dist/
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./awsLambdas/api # main lambda code
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./apiControllers
    zip --delete ../$RELEASE_LBAPI1_ZIP_FILENAME "./apiControllers/helloWorld/*"
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./logger
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./models
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./repositories
    zip --delete ../$RELEASE_LBAPI1_ZIP_FILENAME "./repositories/sampleErrorThrown.*"
zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./shared
#zip -r ../$RELEASE_LBAPI1_ZIP_FILENAME ./gateways # not needed at the moment
cd ..


printf "\n\nUploading releases to "$S3_RELEASES_DIRECTORY"\n"
printf "> uploading file "$RELEASE_LBAPI1_ZIP_FILENAME" ...\n"
aws s3 cp $RELEASE_LBAPI1_ZIP_FILENAME $S3_RELEASES_DIRECTORY


# remove temp files
rm -f $RELEASE_BASE_ZIP_FILENAME 2>/dev/null
rm -f $RELEASE_LBAPI1_ZIP_FILENAME 2>/dev/null
# rm -f $RELEASE_LBAPI1_TO_DELETE_ZIP_FILENAME 2>/dev/null (see above)


printf "\n\n"

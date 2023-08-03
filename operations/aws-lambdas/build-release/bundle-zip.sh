#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Generate new release filenames
source ./operations/aws-lambdas/utils/aws-release.utils.sh --generate-new-release-names

# Check $RELEASE_LBAPI1_ZIP_FILENAME
if [ ${#RELEASE_LBAPI1_ZIP_FILENAME} -lt 2 ]
  then
    printf "Missing RELEASE_LBAPI1_ZIP_FILENAME! \n\n"
    exit 1
fi


RELEASE_BASE_ZIP_FILENAME="release-base.zip"


printf "\n\nCreating base release zip file '"$RELEASE_BASE_ZIP_FILENAME"'...\n"
zip $RELEASE_BASE_ZIP_FILENAME ./package.json
zip $RELEASE_BASE_ZIP_FILENAME ./package-lock.json
zip -r $RELEASE_BASE_ZIP_FILENAME ./node_modules


# Delete all local zip files
source ./operations/aws-lambdas/utils/aws-release.utils.sh --delete-current-local-release

CURRENT_DIRECTORY=$(pwd)
AWS_LAMBDA_APP_DIRECTORY="$CURRENT_DIRECTORY/src/app/aws-lambdas"
AWS_LAMBDA_DIST_DIRECTORY="$AWS_LAMBDA_APP_DIRECTORY/dist"
AWS_LAMBDA_DIST_APP_DIRECTORY="$AWS_LAMBDA_APP_DIRECTORY/dist/app/aws-lambdas"

# Add files to 'dist' directory
cp "$AWS_LAMBDA_APP_DIRECTORY/package.json" $AWS_LAMBDA_DIST_APP_DIRECTORY
cp "$AWS_LAMBDA_APP_DIRECTORY/package-lock.json" $AWS_LAMBDA_DIST_APP_DIRECTORY

printf "\n\nCreating lbapi1 release zip file '"$RELEASE_LBAPI1_ZIP_FILENAME"'...\n"
rm -f $RELEASE_LBAPI1_ZIP_FILENAME 2>/dev/null
cp "$CURRENT_DIRECTORY/$RELEASE_BASE_ZIP_FILENAME" $RELEASE_LBAPI1_ZIP_FILENAME

cd $AWS_LAMBDA_DIST_DIRECTORY
zip -r "$CURRENT_DIRECTORY/$RELEASE_LBAPI1_ZIP_FILENAME" ./app
zip -r "$CURRENT_DIRECTORY/$RELEASE_LBAPI1_ZIP_FILENAME" ./core

cd $CURRENT_DIRECTORY

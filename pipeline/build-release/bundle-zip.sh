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

RELEASE_BASE_ZIP_FILENAME="release-base.zip"
RELEASE_LBAPI1_LABEL="release-lbapi1"
RELEASE_LBAPI1_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_HASH".zip"


printf "\n\nCreating base release zip file '"$RELEASE_BASE_ZIP_FILENAME"'...\n"
# rm -f $RELEASE_BASE_ZIP_FILENAME 2>/dev/null
zip $RELEASE_BASE_ZIP_FILENAME ./package.json
zip $RELEASE_BASE_ZIP_FILENAME ./package-lock.json
# not needed for now
# zip -r $RELEASE_BASE_ZIP_FILENAME ./node_modules >/dev/null # install with npm ci


printf "\n\nCreating lbapi1 release zip file '"$RELEASE_LBAPI1_ZIP_FILENAME"'...\n"
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

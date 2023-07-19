#!/bin/bash

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')

printf "\nAWS Release Utility: \n"

# Check $RELEASE_HASH
if [ ${#RELEASE_HASH} -lt 2 ]
  then
    printf "Missing RELEASE_HASH environment variable! \n\n"
    exit 1
fi


# Prefixes for lambda releases
RELEASE_LBAPI1_LABEL="release-lbapi1"


delete_local_releases () {
  RELEASES_TO_DELETE=$(find . -maxdepth 1 -type f -name "$RELEASE_LBAPI1_LABEL*")
  rm -rf $RELEASES_TO_DELETE
  echo $RELEASES_TO_DELETE
}

get_local_release_by_prefix () {
  echo $(find . -maxdepth 1 -type f -name "$1*" | head -n 1 | awk -F/ '{print $NF}')
}

delete_remote_releases_by_prefix () {
  # delete old files
  # create function to get the latest release-hash file
  echo ""
}


if [[ "$1" = "--generate-new" ]]
then
  printf "Generating a new label for releases...\n"
  RELEASE_LABEL_GENERATED="$RELEASE_HASH-$(date +"%s")"
  export RELEASE_LBAPI1_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_LABEL_GENERATED".zip"
  printf "New label generated: $RELEASE_LABEL_GENERATED\n"
fi


if [[ "$1" = "--delete-current-local" ]]
then
  printf "Deleting local releases file names...\n"
  RELEASES_TO_DELETE=$(delete_local_releases)
  if [ ${#RELEASES_TO_DELETE} -gt 2 ]
    then
      printf "The following files have been deleted:\n$RELEASES_TO_DELETE\n"
    else
      printf "No local releases found to be deleted.\n"
  fi
fi


if [[ "$1" = "--load-current-local" ]]
then
  printf "Loading local releases file names...\n"
  export RELEASE_LBAPI1_ZIP_FILENAME=$(get_local_release_by_prefix $RELEASE_LBAPI1_LABEL)
  printf "LBAPI1_ZIP: $RELEASE_LBAPI1_ZIP_FILENAME\n"
fi


if [[ "$1" = "--delete-current-remote" ]]
then
  delete_remote_releases_by_prefix $RELEASE_LBAPI1_LABEL #"-"$RELEASE_HASH
fi


# Final exported variables
export S3_RELEASES_DIRECTORY="s3://plaax-dev-releases/"

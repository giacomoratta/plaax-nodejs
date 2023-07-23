#!/bin/bash

# Expected env. variables
# $RELEASE_HASH (e.g. '13e44bd2e93d4bf93ae57ab973ff81af952684b7')

printf "\nAWS Release Utility: $1 \n"
printf "AWS version: $(aws --version)\n"
printf "\n"

# Check $RELEASE_HASH
if [ ${#RELEASE_HASH} -lt 6 ]
  then
    printf "Missing or invalid RELEASE_HASH environment variable! (value: $RELEASE_HASH) \n\n"
    exit 1
fi


# AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} - set as ENV externally
# AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} - set as ENV externally
export AWS_DEFAULT_REGION=eu-west-1
export AWS_REGION=eu-west-1
export AWS_DEFAULT_OUTPUT=json


# Variables for the script and exported
SHORT_RELEASE_HASH=$(echo $RELEASE_HASH | cut -c1-8)
S3_RELEASES_BUCKET="plaax-dev-releases"
export S3_RELEASES_DIRECTORY="s3://$S3_RELEASES_BUCKET/"


# Prefixes for lambda releases
RELEASE_LBAPI1_LABEL="release-lbapi1"



# Functions ----------------------------------------------------------------------------------------------------

# Check if the string $3 is shorter than $2, then prints the error $1.
# - param $1: "Invalid string.."
# - param $2: 5 (as number)
# - param $3: "text-to-check"
EXIT_on_short_string () {
  ErrorMessage=$1
  MinLength=$2
  MinLength="${MinLength:-1}" # $2 or 1 as default
  StringVar=$3
  if [[ ${#StringVar} -lt $MinLength ]]
    then
      printf "$ErrorMessage \n\n"
      exit 1
  fi
}

# Get the current timestamp
get_current_timestamp () {
  date +"%s"
}

# Calculate the expiration date for published releases.
# For linux/mac compatibility, 2 different date functions are supported. 
get_published_releases_expiration_date () {
  s3Date=$(date -d "30 days ago" "+%Y-%m-%d" 2> /dev/null)
  if [ $? -ne 0 ]
  then
    # date function on mac osx
    s3Date=$(date -v-30d "+%Y-%m-%d" 2> /dev/null)
  fi
  echo $s3Date
}

# Generate an unique label for the current release hash (= commit hash) by attaching a timestamp.
# An unique name is needed - for example - to force cloudformation to redeploy the same commit.
generate_release_label () {
  echo "$SHORT_RELEASE_HASH-$(get_current_timestamp)"
}

# Delete the local release bundles by prefix
# - param $1: "my-release"
delete_local_releases_by_prefix () {
  RELEASES_TO_BE_DELETED=$(find . -maxdepth 1 -type f -name "$1*")
  rm -rf $RELEASES_TO_BE_DELETED
  echo "$RELEASES_TO_BE_DELETED"
}

# Find the filename of the local release bundle.
# Note.1: it expects to find only 1 release file with the given prefix;
#         the function delete_local_releases_by_prefix() needs to be called first
#         for a cleanup before generating new release files.
# Note.2: on linux, it is possible to sort results by date with `find . -printf "%T@ %Tc %p\n" | sort -n`
# - param $1: "my-release-78gf2384f.zip"
get_local_release_by_prefix () {
  echo $(find . -maxdepth 1 -type f -name "$1*" | head -n 1 | awk -F/ '{print $NF}')
}

# Get the newest release with the specified prefix
# - param $1: "prefix-abc"
get_last_published_release_by_prefix () {
  CURRENT_RELEASE=$(aws s3api list-objects-v2 \
       --bucket "$S3_RELEASES_BUCKET" \
       --prefix "$1" \
       --query 'sort_by(Contents, &LastModified)[-1].Key' \
       --output text 2> /dev/null)
  echo "$CURRENT_RELEASE"
}

# Get the last part of the release filename
# - param $1: "release-lbapi1-7f4e778-1689520514.zip"
# Expected result: "7f4e778-1689520514"
get_release_label_from_release_filename () {
  FILENAME=$1
  echo "${FILENAME%.*}" | awk -F- '{printf "%s-%s\n", $3, $4}'
}

# Remove all the releases with a specified prefix
# - param $1: "prefix-abc"
delete_published_releases_by_prefix () {
  RELEASES_TO_BE_DELETED=$(aws s3api list-objects-v2 \
     --bucket "$S3_RELEASES_BUCKET" \
     --prefix "$1" \
     --output text | awk '{print $3}')

  while read -r ReleaseKey
  do
    if [ ${#ReleaseKey} -gt 8 ]
      then
        printf "\n$ReleaseKey"
        aws s3api delete-object --bucket "$S3_RELEASES_BUCKET" --key "$ReleaseKey"
    fi
  done <<< "$RELEASES_TO_BE_DELETED"
}

# Remove all the releases older than a specified date from S3 bucket
# - param $1: "YYYY-MM-DD"
cleanup_published_releases () {
  RELEASES_TO_BE_DELETED=$(aws s3api list-objects-v2 \
     --bucket "$S3_RELEASES_BUCKET" \
     --query "Contents[?LastModified<'$1']" \
     --output text | awk '{print $2}')

  while read -r ReleaseKey
  do
    if [ ${#ReleaseKey} -gt 8 ]
      then
        printf "\n$ReleaseKey"
        aws s3api delete-object --bucket "$S3_RELEASES_BUCKET" --key "$ReleaseKey"
    fi
  done <<< "$RELEASES_TO_BE_DELETED"
}



# Commands ----------------------------------------------------------------------------------------------------

if [[ "$1" = "--generate-new-release-names" ]]
then
  printf "Generating a new label for releases...\n"
  RELEASE_LABEL_GENERATED=$(generate_release_label)
  printf "New label generated: $RELEASE_LABEL_GENERATED\n"
  export RELEASE_LBAPI1_ZIP_FILENAME=$RELEASE_LBAPI1_LABEL"-"$RELEASE_LABEL_GENERATED".zip"
fi


if [[ "$1" = "--delete-current-local-release" ]]
then
  printf "Deleting local releases file names...\n"
  RELEASES_TO_BE_DELETED=$(delete_local_releases_by_prefix $RELEASE_LBAPI1_LABEL)
  printf "The following local releases with prefix '$RELEASE_LBAPI1_LABEL' have been deleted:$RELEASES_TO_BE_DELETED\n"
fi


if [[ "$1" = "--publish-current-local-release" ]]
then
  RELEASE_LBAPI1_ZIP_FILENAME=$(get_local_release_by_prefix $RELEASE_LBAPI1_LABEL)
  if [ ${#RELEASE_LBAPI1_ZIP_FILENAME} -gt 3 ]
    then
      printf "Publishing the release for LBAPI1 from local file: $RELEASE_LBAPI1_ZIP_FILENAME\n"
      aws s3 cp $RELEASE_LBAPI1_ZIP_FILENAME $S3_RELEASES_DIRECTORY
  fi
fi


if [[ "$1" = "--delete-current-published-release" ]]
then
  RELEASE_LBAPI1_S3_PREFIX=$RELEASE_LBAPI1_LABEL"-"$SHORT_RELEASE_HASH
  RELEASES_TO_BE_DELETED=$(delete_published_releases_by_prefix $RELEASE_LBAPI1_S3_PREFIX)
  printf "The following published releases with prefix '$RELEASE_LBAPI1_S3_PREFIX' have been deleted:$RELEASES_TO_BE_DELETED\n"
fi


if [[ "$1" = "--check-latest-published-releases" ]]
then
  RELEASE_LBAPI1_S3_PREFIX=$RELEASE_LBAPI1_LABEL"-"$SHORT_RELEASE_HASH
  LATEST_RELEASE_LBAPI1_FILE=$(get_last_published_release_by_prefix $RELEASE_LBAPI1_S3_PREFIX)
  EXIT_on_short_string "No releases found for LBAPI1 as $RELEASE_LBAPI1_S3_PREFIX" 12 $LATEST_RELEASE_LBAPI1_FILE
  printf "Latest release for LBAPI1: $LATEST_RELEASE_LBAPI1_FILE\n"

  # in time, the lines above should be repeated for another lambda package

  export LATEST_RELEASE_LABEL=$(get_release_label_from_release_filename $LATEST_RELEASE_LBAPI1_FILE)
  printf "\nLatest release label found: $LATEST_RELEASE_LABEL\n"
fi


if [[ "$1" = "--cleanup-published-releases" ]]
then
  QUERY_DATE=$(get_published_releases_expiration_date)
  RELEASES_TO_BE_DELETED=$(cleanup_published_releases $QUERY_DATE)
  if [ ${#RELEASES_TO_BE_DELETED} -gt 2 ]
    then
      printf "The following published releases have been deleted (older than $QUERY_DATE):\n$RELEASES_TO_BE_DELETED\n"
    else
      printf "No published releases older than $QUERY_DATE have been found to be deleted.\n"
  fi
fi


if [[ "$1" = "--exit-on-invalid-env-name" ]]
then
  env_name=$2
  EXIT_on_short_string "Missing environment name!" 1 $env_name
  if [ "$env_name" = "dev" ] || [ "$env_name" = "acc" ] || [ "$env_name" = "prd" ]
    then
      printf "Environment name: '$env_name' .\n"
    else
      printf "Invalid environment name '$env_name' (expected values: dev, acc, prd).\n\n"
      exit 1
  fi
fi


printf "\n\n"

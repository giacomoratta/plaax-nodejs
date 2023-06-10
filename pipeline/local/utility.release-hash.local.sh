#!/bin/bash

printf "\nRelease hash ($1): \n"

RELEASE_HASH_FILE="./release-hash-latest"
printf " file: $RELEASE_HASH_FILE \n"

# Prevent error if not found
touch ./release-hash-latest

if [[ "$1" = "--generate" ]]
then
  export RELEASE_HASH_GENERATED="$(git rev-parse --short HEAD)-$(date +"%s")"
  export RELEASE_HASH_PREVIOUS=$(cat $RELEASE_HASH_FILE)
  echo $RELEASE_HASH_GENERATED > $RELEASE_HASH_FILE
  printf " RELEASE_HASH_GENERATED = $RELEASE_HASH_GENERATED \n"
  printf " RELEASE_HASH_PREVIOUS = $RELEASE_HASH_PREVIOUS \n\n"
fi

if [[ "$1" = "--load" ]]
then
  export RELEASE_HASH_LOADED=$(cat $RELEASE_HASH_FILE)
  if [ -z "$RELEASE_HASH_LOADED" ]
  then
    printf "No release hash found in $RELEASE_HASH_FILE. Build a release first! \n\n"
    return 1
  fi
  printf " RELEASE_HASH_LOADED = $RELEASE_HASH_LOADED \n\n"
fi

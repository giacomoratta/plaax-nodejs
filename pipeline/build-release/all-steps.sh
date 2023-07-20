#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Expected env. variables
# $RELEASE_HASH (e.g. '31805e9')

export RELEASE_HASH=$RELEASE_HASH

# Check $RELEASE_HASH
if [ ${#RELEASE_HASH} -lt 2 ]
  then
    printf "Missing RELEASE_HASH environment variable! \n"
    exit 1
fi

chmod +x ./pipeline/utils/*.sh
chmod +x ./pipeline/build-release/*.sh

./pipeline/build-release/build.sh

./pipeline/build-release/bundle-zip.sh

./pipeline/build-release/release.sh

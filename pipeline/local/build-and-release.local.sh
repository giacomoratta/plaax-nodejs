# This script is a wrapper for build-and-release.sh in order to be executed in a local environment,
# with some additional configurations (aws, node, npm, etc.).

# How-to RUN. This script must be executed from its directory: "source ./build-and-release.local.sh".


# Prepare local env for aws
source utility.set-aws-env.local.sh
RETURNED_VALUE=$?
if [ $RETURNED_VALUE -ne 0 ]
then
  # not the correct aws local setup!
  return
fi

CURRENT_DIRECTORY=$(pwd)
cd ../../

# Prepare local env for node/npm
nvm use

source ./pipeline/build-and-release.sh dev
RETURNED_VALUE=$?

if [ $RETURNED_VALUE -eq 1 ]
then
  echo "Something went wrong..."
  return
fi

echo "Cleaning..."
RELEASE_ZIP_FILENAME="release-"$GIT_COMMIT_SHORT".zip"
echo "- "$RELEASE_ZIP_FILENAME && rm $RELEASE_ZIP_FILENAME

cd $CURRENT_DIRECTORY

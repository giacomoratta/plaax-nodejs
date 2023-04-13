# ABOUT THE SCRIPT
# - it builds and push the release (as zip file) to S3 releases bucket;
# - it is supposed to be copied inside the main level of the repository and executed from there.

# ARGUMENTS
#  $1 = env-name (e.g. "dev", "prd", etc.)

# HOW-TO
# Run. This script must be executed from the main level of repo (same level of "src" directory).

ENV_NAME="dev"
GIT_COMMIT_SHORT=$(git rev-parse --short HEAD)
RELEASE_ZIP_FILENAME="release-"$GIT_COMMIT_SHORT".zip"
S3_RELEASES_DIRECTORY="s3://plaax-releases/"$ENV_NAME"/"

# Check arguments
if [ $# -ne 1 ]
  then
    echo "Missing argument #1 env-name (e.g. 'dev')."
    return 1
else
  ENV_NAME=$1
fi

echo "\nBuilding the release..."
npm run clean
npm run build

echo "\nCreating release zip file..."
rm $RELEASE_ZIP_FILENAME 2>/dev/null
cd ./dist/
zip -r ../$RELEASE_ZIP_FILENAME .
cd ..

echo "\nUploading file "$RELEASE_ZIP_FILENAME" to "$S3_RELEASES_DIRECTORY" ..."
aws s3 cp $RELEASE_ZIP_FILENAME $S3_RELEASES_DIRECTORY

echo ""

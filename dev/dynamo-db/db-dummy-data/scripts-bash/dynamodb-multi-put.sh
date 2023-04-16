# This generic script reads all JSON files from given directory
# and it runs 1 PUT command per file for the given dynamodb table.
#
# The script shows the file list first, then ask for a confirmation before
# proceeding with the multiple PUT commands.
#
# Usage: ./script <dir-with-source-files> <dynamodb-table>

source $HOME/.zshrc
aws-set-env-giacomoratta1

if [[ "$AWS_PROFILE" != "giacomoratta1" ]]
then
  echo "AWS_PROFILE is not the expected one.\n"
  return
fi

if [ $# -lt 2 ]
then
  echo "Missing arguments."
  echo "Usage: ./script <dir-with-source-files> <dynamodb-table>\n"
  return
fi

sourceDirectory=$1
destinationTable=$2

echo "Directory with JSON files: $sourceDirectory"
echo "DynamoDB destination table: $destinationTable"
echo ""

jsonDbFiles=( $sourceDirectory/*-db.json )
if [ ${#jsonDbFiles[@]} -eq 0 ]
then
  echo "No DB files found in" $(pwd)
  return
fi

for entry in $jsonDbFiles
do
  echo $entry
done

echo "\n"${#jsonDbFiles[@]} "files found in" $sourceDirectory "\n"

echo "Ready to put items to" $destinationTable "\n"

echo "Do you want to put all the files above into" $destinationTable "? (n,Y)"
if [ -n "$ZSH_VERSION" ]; then
  read -r "answer?"
else
  read -r answer
fi

if [[ "$answer" == "Y" ]]
then
  echo "Putting items to" $destinationTable "..."

  for entry in $jsonDbFiles
  do
    echo $entry
    aws dynamodb put-item \
    --table-name $destinationTable \
    --item file://$entry
  done
fi

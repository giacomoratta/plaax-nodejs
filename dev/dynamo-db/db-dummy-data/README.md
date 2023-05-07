# Dummy data for manual tests

## Directories
- [scripts-bash](scripts-bash): bash scripts
- [scripts-nodejs](scripts-nodejs): node scripts
- [json-final-data](json-final-data): final JSON files which can be used immediately for dynamodb, unit tests, etc.;
- [json-initial-data](json-initial-data): initial JSON files used to generate the final JSON files;

## Scripts

### [scripts-bash/dynamodb-multi-put.sh](scripts-bash%2Fdynamodb-multi-put.sh)
This generic script reads all JSON files from given directory, and it runs 1 PUT command per file for the given dynamodb table.

The script shows the file list first, then ask for a confirmation before proceeding with the multiple PUT commands.

Usage: `./script <dir-with-source-files> <dynamodb-table>`

### [scripts-nodejs/generate-data-from-table-definitions.js](scripts-nodejs%2Fgenerate-data-from-table-definitions.js)

Generate the data that DynamoDB should accept or return from the directory [../table-definitions](..%2Ftable-definitions).

### [scripts-nodejs/generate-plaax-db-example-data.js](scripts-nodejs%2Fgenerate-plaax-db-example-data.js)

Generate the data that DynamoDB should accept or return from the file [json-initial-data/plaax-example-data-env.json](json-initial-data%2Fplaax-example-data-env.json).

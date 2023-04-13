### MVP for API

#### Goals
- immediately play with deployment
- do a quick manual tests of api
- deal with values returned by api (from TS-interfaces to JSON ?)

#### Technical plan
- simulation of implementation, test, deployment, changes, re-deployment
- 1 simple endpoint
- 1 unit-test path (api controller, repo, dynamodb)
- 1 full path from URL to DynamoDB (and back)
- simple AWS-CloudFormation script for 1 lambda, 1 api-gw, no dynamodb-tables
- test error logs to see source-map (for TS line numbers)

#### Work-in-progress
- Build
  - Upload zip to S3 with commit short
  - Create a simple index file (no koa server)
  - Bash-Script for distribution
  - Unify all scripts in 1-Bash with external params (for env-name)
  - Create a docker image for build

- Deploy
  - Prepare Cloudformation script
  - CF-Deploy Lambda, Log, Authorizer in 1 YAML file
  - Accept external params for env-name
  - Create 1 Bash script for deployment
  - Split YAML file in multiple files (?)
  - Create a docker image for deployment

- Distribute and deploy basic lambda with hello-world endpoint
- Simple API endpoint: get full project
- Unit-Test single api controller
- Unit-Test data repository
- Unit-Test dynamodb-gateway
- CF-Deploy DynamoDb table
- CF-Deploy Api-Gateway

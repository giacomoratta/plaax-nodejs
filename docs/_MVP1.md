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
- Build 1
  - (done) Upload zip to S3 with commit short
  - (done) Bash-Script for distribution
  - (done) Create a docker image for build and release

- Deploy 1
  - Prepare Cloudformation script
  - CF-Deploy Lambda, Log, Authorizer in 1 YAML file
  - Accept external params for env-name
  - Split YAML file in multiple files (?)

- Deploy 2
  - Create 1 Bash script for deployment
  - Create a docker image for deployment

- Build 2
  - Create a simple index file (no koa server)
  - Unify all scripts in 1-Bash with external params (for env-name)

- Distribute and deploy basic lambda with hello-world endpoint
- Simple API endpoint: get full project
- Unit-Test single api controller
- Unit-Test data repository
- Unit-Test dynamodb-gateway
- CF-Deploy DynamoDb table
- CF-Deploy Api-Gateway


#### Nice-to-have
- set lifecycle for releases on S3
  - remove simple releases after 1 month
  - keep releases of main branch
  - define directories to differentiate what to delete and what to keep
- Pipelines on GitHub
  - Setup GitHub simple actions
  - Setup GitHub action for build-and-release
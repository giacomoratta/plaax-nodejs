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

#### Work-in-progress
- Distribute and deploy basic lambda with hello-world endpoint
- Prepare Cloudformation script
- CF-Deploy Lambda
- Simple API endpoint: get full project
- Unit-Test single api controller
- Unit-Test data repository
- Unit-Test dynamodb-gateway
- CF-Deploy DynamoDb table
- CF-Deploy Api-Gateway

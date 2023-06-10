## Archive of Work-in-Progress
_(sorted by descending date)_

#### PLX-1005: MVP1 part3
...

#### PLX-1005: MVP1 part2
- Create the initial form of a final API-Layer
  - finalize the simple controller to lambda (hello-world)
  - functions directory
  - functions/apiLambdaHandler.ts
  - api directory is for controllers (add readme?) ... that can be integrated everywhere
  - decide the most important endpoints (at the moment)
  - create API routes for some basic endpoints
  - copy only handler and code specific for a lambda
  - add meaningful logs for incoming requests in main lambda api handler
  - handle static resources with aws cloudformation
    - stack for lambda, api, etc.
    - stack for s3, dynamodb, etc.
    - script for stack-static operations
    - renamed dynamodb tables as "stack-env-..."
  - focus on 1 simple controller for 'userProjects'
    - concept for jest tests and mocks
    - install aws libs as dev dependencies (already present in lambda node-runtime)
    - jest mock aws in __mocks__ folder
    - unit-tests for Repository
      - get real data from scripts in 'dev' folder
      - save aws data (json files) in repo/__tests__/__data__
      - save repo data (ts files) in repo/__tests__/__data__
      - use repo data (ts files) in repo tests as expected data
      - use repo data (ts files) in higher levels for mocking response from repo
    - working api: integrate user+board repo calls in API + lambdaAPI
    - unit-tests for ApiControllers
    - unit-tests for internalLambdaApiHandler
    - create integration test stub
    - deploy and test with new handler, test entire flow
    - create initial integration test for api lambda
  - focus on 1 controller for 'getUserBoard' and implement the whole chain
    - add repo function + tests
    - add api controller + tests
    - add lambda route handler + tests
    - add lambda integration tests
    - deploy and test
  - extra-work and nice-to-have
    - Unit-Test single api controller
    - Unit-Test data repository
    - Unit-Test dynamodb-gateway
    - Centralize DynamoDb config (and functions?) w/ dependency on ENV_NAME
    - Create one-time cloudformation templates
    - create S3 bucket for release
    - create dynamo-db tables by env
    - (done/not-possible - time-boxed 1h) try to split api-gw into another file (dir "/aws-cfn-resources"): not possible from local yml files


#### PLX-1004: MVP1 part1
- Build 1
  - Upload zip to S3 with commit short
  - Bash-Script for distribution
  - Create a docker image for build and release
- Deploy 1
  - (ref) https://octopus.com/blog/deploying-lambda-cloudformation
  - Prepare Cloudformation script
  - CFN-Deploy Lambda, Log, Authorizer in 1 YAML file
  - Accept external params for env-name
  - (postponed) Split YAML file in multiple files (?)
- Deploy 2
  - Create 1 Bash script for deployment
  - rename "aws-cfn-stack.sh" to "plaax-stack.aws-cfn.operations.sh" (+local)
  - (not-needed... too many layers) create "deploy.sh"/"deploy.local.sh" (wrap "plaax-stack.aws-cfn.operations.sh")
  - Create a docker image for deployment
    - "deploy.dockerfile"
    - (postponed - todo added) basic linux image
    - same approach like build-release.dockerfile
    - "deploy.dockerfile.local.sh"
- Build 2
  - throw Error (from src/nested-dir/dir2/...) included in the handler
  - check what happens with Error info...
  - add source maps
- Build and deploy local zip files with CFN
  - just replace lambda code (script for build, zip, replace lambda code) ?
  - (or) local scripts uses a different hash
  - make release hash generic (not linked to git commit short)
  - rename zip files with "plaax-<hash>.zip"
  - handle missing release hash
- Deploy API-Gateway
  - (ref) https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ApiGatewayV2.html
  - (ref / api-gw-cfn) https://gist.github.com/toddlers/7c324e39c2ef3058d6c50b895076b16f
  - deploy stand-alone GW with CFN
  - trigger lambda with GW
  - fix names for api-gw stuff in CFN template, fix Stack name

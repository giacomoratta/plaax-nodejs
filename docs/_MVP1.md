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
- ((WIP)) Create the initial form of a final API-Layer
  - finalize the simple controller to lambda (hello-world)
    - (done) functions directory
    - (done) functions/apiLambdaHandler.ts
    - (done) api directory is for controllers (add readme?) ... that can be integrated everywhere
    - (done) decide the most important endpoints (at the moment)
    - (done) create API routes for some basic endpoints
    - (done) copy only handler and code specific for a lambda
    - (done) add meaningful logs for incoming requests in main lambda api handler
    - (done) handle static resources with aws cloudformation
      - (done) stack for lambda, api, etc.
      - (done) stack for s3, dynamodb, etc.
      - (done) script for stack-static operations
      - (done) renamed dynamodb tables as "stack-env-..."
    - (done) focus on 1 simple controller for 'userProjects'
      - (done) concept for jest tests and mocks
      - (done) install aws libs as dev dependencies (already present in lambda node-runtime)
      - (done) jest mock aws in __mocks__ folder
      - (done) unit-tests for Repository
        - (done) get real data from scripts in 'dev' folder
        - (done) save aws data (json files) in repo/__tests__/__data__
        - (done) save repo data (ts files) in repo/__tests__/__data__
        - (done) use repo data (ts files) in repo tests as expected data
        - (done) use repo data (ts files) in higher levels for mocking response from repo
      - (done) working api: integrate user+board repo calls in API + lambdaAPI
      - (done) unit-tests for ApiControllers
      - (done) unit-tests for internalLambdaApiHandler
      - (done) create integration test stub
      - (done) deploy and test with new handler, test entire flow
      - (done) create initial integration test for api lambda
    - (wip) focus on 1 controller for 'getUserBoard' and implement the whole chain
      - (done) add repo function + tests
      - (done) add api controller + tests
      - (done) add lambda route handler + tests
      - (done) add lambda integration tests
      - (wip!) deploy and test
      - try a core change - add "status" for Activity and Task (new: default, ready, progress, waiting, done)
      - redefine the goal of this mvp1
        - finish some changes
        - start mvp2 with the following stuff
        - no more API controllers
        - cfn multiple files
        - local dev with koa + local dynamodb
        - github actions
    - (done) extra-work and nice-to-have
      - (done) Unit-Test single api controller
      - (done) Unit-Test data repository
      - (done) Unit-Test dynamodb-gateway
      - (done) Centralize DynamoDb config (and functions?) w/ dependency on ENV_NAME
      - (done) Create one-time cloudformation templates
      - (done) create S3 bucket for release
      - (done) create dynamo-db tables by env
      - apply retention days on s3 buckets?
    - (wip-paused) create 3-4 controllers GET/POST/PUT/DELETE for expected CRUD operations
    - define returned types (undefined, empty array.. ??)
  - research possibilities for automatic logs from API-Gateway
  - (done - time-boxed 1h) try to split api-gw into another file (dir "/aws-cfn-resources"): not possible from local yml files

#### Next work
- Local-dev with server, koa (dev dependency only!), docker, etc.
  - to test api with requests to aws cloud
  - setup a full local aws env?
- !! Mind the package.json dependencies for Lambda bundle

#### Nice-to-have
- set lifecycle for releases on S3
  - remove simple releases after 1 month
  - keep releases of main branch
  - define directories to differentiate what to delete and what to keep
- Pipelines on GitHub
  - Setup GitHub simple actions
  - Setup GitHub action for build-release
- Cloudformation templates
  - split in multiple files
  - export output values
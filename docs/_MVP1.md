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
    - (wip-paused) create 3-4 controllers GET/POST/PUT/DELETE for expected CRUD operations
    - (wip) focus on 1 controller for 'getBoard' and implement the whole chain
      - install aws libs as dev dependencies (already present in lambda node-runtime)
      - jest mock aws in __mock__ folder
      - unit-tests for Repository
        - get real data from scripts in 'dev' folder
      - unit-tests for ApiControllers
      - unit-tests for internalLambdaApiHandler
      - use DynamoDb (lambda permissions?)
      - define returned types (undefined, empty array.. ??)
  - automatic logs for gw ?
  - (done - time-boxed 1h) try to split api-gw into another file (dir "/aws-cfn-resources"): not possible from local yml files
- Add DynamoDb table to CFN template
  - try with a different name first (to prevent overwriting/deleting)
  - add initial data from CFN template

#### Next work
- Local-dev with server, koa (dev dependency only!), docker, etc.
  - to test api with requests to aws cloud
  - setup a full local aws env?
- Unit-Test single api controller
- Unit-Test data repository
- Unit-Test dynamodb-gateway


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
- Create one-time cloudformation templates
  - create S3 bucket for release with retention days
  - create dynamo-db tables by env
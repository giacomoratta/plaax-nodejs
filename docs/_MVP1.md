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
T.B.D.


#### MVP-Part3
- redefine the goal of this mvp1
  - try a core change - add "status" for Activity and Task (new: default, ready, progress, waiting, done)
  - finish some changes
  - start mvp2 with the following stuff
  - no more API controllers
  - cfn multiple files
  - local dev with koa + local dynamodb
  - github actions
- (wip-paused) create 3-4 controllers GET/POST/PUT/DELETE for expected CRUD operations
- define returned types (undefined, empty array.. ??)
- research possibilities for automatic logs from API-Gateway
- (done - time-boxed 1h) try to split api-gw into another file (dir "/aws-cfn-resources"): not possible from local yml files
- apply retention days on s3 buckets?


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

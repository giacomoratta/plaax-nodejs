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
- Add "status" for Activity and Task (new: default, ready, progress, waiting, done)
  - GOAL: try to change the core
- Local dev with koa + local dynamodb
  - GOAL: play with local aws services and containers
  - build and run a local-dev server with koa running on docker
  - allow test api with requests to remote aws cloud
  - setup a full local aws env on docker containers
- GitHub actions
  - GOAL: proper ci/cd setup
  - start with very basic actions
  - setup action for build-release
  - setup action for deploy
- Create POST controller for new items
  - GOAL: play with IDs table
- Create GET controller for user calendar
  - GOAL: play with time-based queries
- Research possibilities for automatic logs from API-Gateway
  - GOAL: more knowledge on aws-gw
- Mind the package.json dependencies for Lambda bundle
  - GOAL: optimize pipelines
- Manage lifecycle for releases on S3
  - GOAL: prevent uncontrolled growth of release packages
  - remove simple releases after 1 month
  - apply retention days on s3 buckets?
  - keep releases of main branch?
  - define directories to differentiate what to delete and what to keep

#### Next work
...

#### Nice-to-have
...

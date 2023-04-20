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
- Build and deploy local zip files with CFN
  - just replace lambda code (script for build, zip, replace lambda code) ?
  - (or) local scripts uses a different hash
  - make release hash generic (not linked to git commit short)
- Deploy API-Gateway
  - deploy stand-alone GW with CFN
  - trigger lambda with GW
  - add simple controller to lambda (hello-world)
  - add controller for full project from DynamoDb
  - permissions for lambda, gw, dynamodb, etc.
  - automatic logs for gw ?
- Deploy DynamoDb table
  - try with a different name first (to prevent overwriting/deleting)

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
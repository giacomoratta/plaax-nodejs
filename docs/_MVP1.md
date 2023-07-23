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


#### Next work
- Local dev with koa + local dynamodb
  - GOAL: play with local aws services and containers
  - STEPS:
    - build and run a local-dev server with koa running on docker
    - allow test api with requests to remote aws cloud
    - setup a full local aws env on docker containers

- Create POST controller for new items
  - GOAL: play with IDs table

- Create GET controller for user calendar
  - GOAL: play with time-based queries

- Add "status" for Activity and Task (new: default, ready, progress, waiting, done)
  - GOAL: try to change the core

- Mind the package.json dependencies for Lambda bundle
  - GOAL: optimize operations

- Add the final logger
  - GOAL: do not log with console
  - Introduce pino-logger (+ research for alternatives)

- Plan and produce some articles based on ./docs or ./dev
  - GOAL: start presence on medium/hash-node

- Update dependencies and vulnerabilities
  - GOAL: deal with major updates (Typescript 5, Eslint, Jest, etc.)
  - Get rid of vulnerabilities ASAP
  - Update with breaking changes
  - Think about some automations


#### Nice-to-have
- upload base image with node, aws, apk, etc.
  - use it custom build-release docker images
  - use it in GitHub workflows
- create GitHub action to copy a release when PR is merged into main to "plaax-release-main"
- replace current s3 plaax-dev-release with plaax-temp-release
- deal with weekly operations (fix vulnerabilities, package updates, etc.)
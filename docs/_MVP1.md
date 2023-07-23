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


#### PLX-1007: MVP1 part4
- GitHub actions: introduction
  - GOAL: final ci/cd setup


- FINAL ACTIONS
  - ARE DOCKER IMAGES REALLY NEEDED?
    - run scripts in GitHub container
    - use aws actions or cli?

  - Workflow: Shared docker image for build and deploy
     - run job on demand
     - build and publish on personal docker
     - get/set secrets for personal docker
  - Workflow: Build, release, deploy
    - Test, build, release
      - run job on demand (prevent useless builds)
      - build specific image FROM (1)
      - run container (no ENV)
    - Deploy
      - run job on demand
      - build specific image FROM (1)
      - run container (by ENV)

- (wip-waiting) Manage lifecycle for releases on S3
  - Enabling S3 versioning is not free
  - GOAL: prevent uncontrolled growth of release packages
  - STEPS:
    - remove simple releases after 1 month
    - apply retention days on s3 buckets?
    - keep releases of main branch?
    - define directories to differentiate what to delete and what to keep
  - WIP:
    - created a copy of object + created a rule
    - wait until 11 Jun at 16:00 and something should be deleted
    - try with 1 non-current-version objects retained
    - set up the rule in [plaax-stack-static.aws-cfn.yml](..%2Fpipeline%2Fplaax-stack-static.aws-cfn.yml)

- (done) Research possibilities for automatic logs from API-Gateway
  - GOAL: more knowledge on aws-gw

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
  - GOAL: optimize pipelines

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


#### Next work
...

#### Nice-to-have
- upload base image with node, aws, apk, etc.
  - use it custom build-release docker images
  - use it in GitHub workflows

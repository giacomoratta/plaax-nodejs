# MVP1: API, CI/CD, development

### Goals
- immediately play with deployment
- do a quick manual tests of api
- deal with values returned by api (from TS-interfaces to JSON ?)
- start presence on medium/hash-node: produce some articles based on ./docs or ./dev


### Technical plan
- simulation of implementation, test, deployment, changes, re-deployment
- 1 simple endpoint
- 1 unit-test path (api controller, repo, dynamodb)
- 1 full path from URL to DynamoDB (and back)
- simple AWS-CloudFormation script for 1 lambda, 1 api-gw, no dynamodb-tables
- test error logs to see source-map (for TS line numbers)



### Next steps for MVP: general - MVP1-Part6

- Finalize server app for hybrid local development
  - GOAL: use koa, koa middlewares, play with docker
  - (bug) npm run server-dev not working even if AWS env vars are set
  - (wip) implement 1 api endpoint
    - with unit-tests
  - implement all api endpoints
    - with unit-tests
    - some integration tests

- Improve README to be a good presentation of the project
  - doc git guidelines
    - commit message stile
    - not allowed to push on master
    - always pull-req
  - document scripts in operations + locals
    - briefly
    - everything can change a lot
    - just do it for making the README complete for an external presentation
    - also document git workflows and the usage of operations
    - add schemas and drawings
    - repo split: pros & cons
      - more efforts with operations (e.g. extra care with paths and packages)
      - more efforts in keeping the repo well-structured and easy to understand
      - work on code re-usability shared among 2 different backends
        - e.g. api controllers needs to be the source of truth: specific backends have to just transform and send
      - open to be playground for different backends and infra (aws-lambdas, gcp-functions, aws-ec-server, ...)



### Next steps for MVP: test development experience - MVP1-Part7

- Create POST controller for new items
  - GOAL: play with IDs table

- Create GET controller for user calendar
  - GOAL: play with time-based queries

- Add "status" for Activity and Task (new: default, ready, progress, waiting, done)
  - GOAL: try to change the core



### Nice-to-have (not for MVP)

- Deploy server app on ECS
  - with shared dynamodb (deployed from static cfn)

- Local dev with koa + local aws (e.g. dynamodb)
  - GOAL: play with local aws services and containers
  - build and run a local-dev server with koa running on docker
  - setup a full local aws env on docker containers

- Replace current s3 plaax-dev-release with plaax-temp-release
  - dev is an ENV name, but the s3 is not for dev env. only
  - "temp" clarifies the purpose and the low-importance of the data inside the s3
    - ...in case we want to delete the content, the word "temp" suggests that it can be done with no consequences
  - check aws-release.utils.sh
  - check plaax-stack-static.aws-cfn.yml

- Automate copy main releases into special bucket
  - create GitHub action
  - copy a release when PR is merged into main to "plaax-release-main"
  - periodic cleaning of dev-releases
  - automate with S3
 
- Make a plan for periodic operations
  - GitHub actions? Local scripts? >> Do some local scripts first!
  - npm vulnerabilities
  - package minor updates
  - package major updates
  - periodic cleaning of S3 dev-releases (local, s3, or actions?)

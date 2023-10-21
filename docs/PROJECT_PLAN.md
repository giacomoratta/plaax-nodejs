# Project Plan

#### DOCKER
- (done) base image with all packages
- (done) builder for ts
- (done) runner for js
- (done) set node version not aliases

#### CHANGES BASED ON FEEDBACK
- (done) do not overcomplicate the structure with DDD

#### THE PROJECT (basics): general
- (done) set local configs
- (done) rename project: backend for Plaax-nodejs; "nodejs" is the tech, 
         in case I make other backends with a different tech-stack

#### THE PROJECT (basics): dynamo-db
- (done) define db data, table, r/w access
  - (done) define data tables for DynamoDb
  - (done) create dummy-data in table definitions
  - (done) put dummy/initial data into dynamodb
  - (done) define AWS-CLI queries
  - (done) define typical queries CRUD for the APIs
  - (done) connect to AWS via SDK3
- (done) define main AWS-SDK3 queries

#### THE PROJECT (basics): concept of backend
- (done) define structure of api, gateway, repositories, etc. (clear architecture)
- (done) TDD approach: start from api > repositories > gateway
  - (done) get full test data from dynamo-db
  - (done) create expected domain data
- (done) MOCK aws libraries on top level (./src/_\_mocks__)
- (done) create basic api layer with common operations
  - (done) get user board (multi project)
  - (done) get user calendar (between dates)
  - add new item
  - add new item on calendar
- (done) create specific dynamodb gateway
  - (done) define db data models
- (done) create specific app repository
  - (done) define domain data models
  - (done) interact with gateway
  - (done) complex operations with db executed together, return complex domain objects

#### THE PROJECT (basics): MVP1
- (wip) simulation of implementation, test, deployment, changes, re-deployment
- (done) simple cloudformation template with lambda, gateway, dynamodb, etc.
- (done) add source-map (for TS line numbers)
- (done) GitHub actions

#### THE PROJECT (basics): MVP1-backend
- (wip) create api layer (focus on the basic features of task manager)
- (done) add pino logger for the code (suppress on tests)
- (done) add logger for api requests (pino? as middleware?) (suppress on tests)
- (done) local-dev env. with server
  - (done) containerized
  - (done) script for cleaning docker stuff from this project
  - (done) simulate api with remote dynamodb connection

#### DEPLOYMENT ON AWS AS SERVERLESS
- (done) deploy on AWS as DEV environment
  - (done) create script AWS-CFN to create db tables w/ env variable
  - (done) create AWS-CLI script for initial data w/ env variable
- (done) deploy on AWS as ACC environment
- (done) define architecture
- (done) arch#1 = lambda, api gateway, script with cloudformation on local

#### Final MVP1: last requirements check
- (done) clean architecture
- (done) unit tests
- (done) tech/repo documentation (init, install, run, clean, stop, etc.)
- (done) good api documentation on .md files
- (done) control distributed code on lambda(s)
- (done) clear and simple aws architecture:
  - api gateway
  - dynamodb
  - lambda handler for api
- (done) deployment with local AWS-CFN script with params: env, ...?

#### THE PROJECT (extended): backend auth
- API authentication layer w/ Lambda Authorizer or other on AWS
- secure connection to API (use credentials, get token, api controllers checks current user)
- wait for calls from frontend?



## More challenges

#### THE PROJECT (more)
- split code in more lambdas and api gateways (not needed for now, but good to experiment with)
- docker compose with postgres
- docker compose with dynamodb
- integration tests
- lambda layers (enhance startup time)
- ship logs to DataDog, Sentry, Logzio, or others
- check test memory leaks
- cache api responses (avoid dynamo, processing, etc.)
  - better performance
  - less usage (and costs) of aws services

#### THE PROJECT (pro/optionals)
- provide API with GraphQL
- e2e tests
- websocket
- interact with external API (with oAuth or JWT or ...?)

#### PRODUCTION
- distinction between dev and prod
- arch#2 = ecs/ec2, pm2, stability
- nodejs security: https://levelup.gitconnected.com/top-10-best-practices-to-secure-node-js-apps-in-production-916c69fcb43f
- nodejs memory leak: https://medium.com/@london.lingo.01/advanced-techniques-for-detecting-memory-leaks-in-node-js-applications-6169995ff729

#### CI/CD
- GitHub actions
- automatic tests on GitHub
- deploy from GitHub
- setup 2 environments

#### Local development (optionals)
- create scripts for generating dummy data (npm libs)

#### FRONTEND
- basic interface with React+Typescript
- basic UI with common libraries (e.g. Bootstrap)
- connect with SSO, Cognito, etc. ?
- implement SSR
- serve fragments w/ Lambda (SSR)
- state management with Redux, Mobx, etc.
- js bundlers: Webpack5, Rollup, Esbuild, Parcel, Vite, etc. https://byby.dev/web-bundlers
  (Vite uses esbuild for dependency bundles, rollup for production bundles)
- Faster Virtual DOM https://github.com/aidenybai/million


#### SERVERLESS PATTERN
- https://blog.serverlessadvocate.com/unlocking-serverless-superpowers-mastering-the-8-crucial-design-patterns-every-engineer-should-128fafb87113




## MVP2: (more challenges on MVP1 and leftovers)

### Goals
- start presence on medium/hash-node: produce some articles based on ./docs or ./dev
- simulation of structural changes: implementation, test, deployment, changes, re-deployment

### Next steps for MVP: test development experience - MVP1-Part7
- Create POST controller for new items
  - GOAL: play with IDs table
  - also add new endpoint on server
- Create GET controller for user calendar
  - GOAL: play with time-based queries
  - also add new endpoint on server
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

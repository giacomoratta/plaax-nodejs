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
- add logger for api requests (pino? as middleware?) (suppress on tests)
- local-dev env. with server
  - nodemon
  - containerized
  - script for cleaning docker stuff from this project
  - simulate api with remote dynamodb connection
  - add sql-db (mysql) locally?
  - add no-sql-db (dynamodb?) locally?

#### DEPLOYMENT ON AWS AS SERVERLESS
- (done) deploy on AWS as DEV environment
  - (done) create script AWS-CFN to create db tables w/ env variable
  - (done) create AWS-CLI script for initial data w/ env variable
- (done) deploy on AWS as ACC environment
- (done) define architecture
- (done) arch#1 = lambda, api gateway, script with cloudformation on local

#### Final MVP1: last requirements check
- clean architecture
- unit tests
- tech/repo documentation (init, install, run, clean, stop, etc.)
- good api documentation on .md files
- control distributed code on lambda(s)
- clear and simple aws architecture:
  - api gateway
  - dynamodb
  - lambda handler for api
- deployment with local AWS-CFN script with params: env, ...?

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
- js bundlers: Webpack5, Rollup, Esbuild, Parcel, Vite, etc. https://byby.dev/web-bundlers
  (Vite uses esbuild for dependency bundles, rollup for production bundles)
- Faster Virtual DOM https://github.com/aidenybai/million

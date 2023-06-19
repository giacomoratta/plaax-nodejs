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
- (t.b.d.) add sql-db (mysql) locally
- (t.b.d.) add no-sql-db (dynamodb?) locally

#### THE PROJECT (basics): MVP1
- simulation of implementation, test, deployment, changes, re-deployment
- simple cloudformation template with lambda, gateway, dynamodb, etc.
- add source-map (for TS line numbers)

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

#### THE PROJECT (basics): backend
- add pino logger for the code (suppress on tests)
- add logger for api requests (pino? as middleware?) (suppress on tests)
- (done) create api layer (focus on the basic features of task manager)
- use nodemon, better dev env

#### DEPLOYMENT ON AWS AS SERVERLESS
- (done) deploy on AWS as DEV environment
  - (done) create script AWS-CFN to create db tables w/ env variable
  - (done) create AWS-CLI script for initial data w/ env variable
- (done) deploy on AWS as ACC environment
- (done) define architecture
- (done) arch#1 = lambda, api gateway, script with cloudformation on local

#### THE PROJECT (extended): backend
- API authentication layer w/ Lambda Authorizer or other on AWS
- secure connection to API (use credentials, get token, api controllers checks current user)
- script for cleaning docker stuff from this project

#### Final MVP1: requirements
- clean architecture
- unit tests
- tech/repo documentation (init, install, run, clean, stop, etc.)
- good api documentation on .md files
- control distributed code on lambda(s)
- clear and simple aws architecture:
  - api gateway
  - dynamodb
  - lambda handler for api
  - aws auth. for api
- deployment with local AWS-CFN script with params: env, ...?



## More challenges

#### THE PROJECT (more)
- split code in more lambdas and api gateways (not needed for now, but good to know)
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
- nodejs security: https://link.medium.com/cWMfbbv1SAb

#### CI/CD
- github pipelines
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

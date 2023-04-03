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

#### THE PROJECT (basics): concept of backend
- define structure of api, gateway, repositories, etc. (clear architecture)
- TDD approach: start from api > repositories > gateway
  - get full test data from dynamo-db
  - create expected domain data
- MOCK aws libraries on top level (./src/_\_mocks__)
- create basic api layer with common operations
  - get user board (multi project)
  - get user calendar (between dates)
  - add new item
  - add new item on calendar
- create specific dynamodb gateway
  - define db data models
- create specific app repository
  - define domain data models
  - interact with gateway
  - complex operations with db executed together, return complex domain objects

#### THE PROJECT (basics): backend
- add pino logger for the code (suppress on tests)
- add logger for api requests (pino? as middleware?) (suppress on tests)
- create api layer (focus on the basic features of task manager)
- use nodemon, better dev env

#### DEPLOYMENT ON AWS AS SERVERLESS
- deploy on AWS as DEV environment
  - create script AWS-CF to create db tables w/ env variable
  - create AWS-CLI script for initial data w/ env variable
- deploy on AWS as ACC environment
- define architecture
- arch#1 = lambda, api gateway, script with cloudformation on local

#### THE PROJECT (more)
- provide API with GraphQL
- library for a working mock for APIs
- docker compose with postgres
- docker compose with dynamodb
- script for cleaning docker stuff from this project
- integration tests

#### THE PROJECT (pro/optionals)
- e2e tests
- api auth layer (passport?) for my APIs
- websocket
- interact with external API (with oAuth or JWT or ...?)

#### PRODUCTION
- distinction between dev and prod
- arch#2 = ecs/ec2, pm2, stability

#### CI/CD
- github pipelines
- automatic tests on GitHub
- deploy from GitHub
- setup 2 environments

#### Local development (optionals)
- create scripts for generating dummy data (npm libs)

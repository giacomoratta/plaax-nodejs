#### MAIN GOALS
- build a boilerplate for NodeJs-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)
- build a simple backend layer (node, python, go, rust)
- build a simple frontend layer (js, react)
- use Cloudformation
- use Terraform
- deploy a backend layer on AWS
- deploy a frontend layer on AWS
- deploy a backend layer on GCP
- deploy a frontend layer on GCP
- deploy a backend layer on Azure
- deploy a frontend layer on Azure
- deploy the backend layer on AWS, GCP, Azure as not serverless
- build a boilerplate for Deno-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)
- build a boilerplate for BunJs-app (full setup typescript, eslint, jest, docker, docker-compose, project structure)



#### THE IDEA FOR BACKEND
This is just an example of a generic serverless service on AWS with API Gateway, Lambda, EC2, ECS.
The actual initial project: provide an API layer for managing tasks for a ToDo list based on a calendar.

1. Provide backend
2. Easily develop locally
3. Logging layer
4. Excellent unit-tests (TDD)
5. Deploy to AWS on 2 environments: ACC and PRD
6. Set up a strategy for monitoring and observability on AWS
7. Provide authorization and authentication layers
8. Add an interaction with external API with auth
9. Good tests: integration, end-to-end (to test full flow, and test behavior with external API)


#### THE IDEA FOR FRONTEND
This is just an example of a generic serverless web-app on AWS with Lambda and Cloudfront.
The actual initial project: provide a complex UI and use the API layer implemented above.

1. Implement frontend with React and modern techniques
2. Do not waste much time to implement the perfect UI: make it working
3. Easily develop locally
4. Logging layer for frontend
5. Excellent unit-tests (TDD/BDD)
6. Deploy to AWS on 2 environments: ACC and PRD
7. Set up a strategy for monitoring and observability for frontend errors (e.g. Sentry)
8. Handle login and registration via Google, Facebook, etc.
9. Good tests: integration, end-to-end


#### BRANCHES
- tag branches?
- 1 main branch for a standard and simple setup, shared by all branches
- 1 branch for more features (auth, db, api)
- 1 branch for test features (integration and e2e), +triggered by github
- 1 branch for aws serverless deployment
- 1 branch for aws server-ec2 deployment
- 1 branch for different environments
- 1 branch for deployment triggered by github


# Project Plan

#### DOCKER
- (done) base image with all packages
- (done) builder for ts
- (done) runner for js
- (done) set node version not aliases

#### CHANGES BASED ON FEEDBACK
- (done) do not overcomplicate the structure with DDD

#### THE PROJECT (basics)
- (done) set local configs
- (done) rename project: backend for Plaax-nodejs; nodejs is the tech, in case I do other backends with different techs
- define data, table, r/w access
- add sql-db (mysql) locally
- add no-sql-db (dynamodb?) locally
- add pino logger for the code (suppress on tests)
- add logger for api requests (pino? as middleware?) (suppress on tests)
- create api layer (focus on the basic features of task manager)
- use nodemon, better dev env

#### DEPLOYMENT ON AWS AS SERVERLESS
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

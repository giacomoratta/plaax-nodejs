# PLAAX NodeJs Backend

## About this project
**What is PLAAX?** It is a small personal project inspired by some web-apps for activity planning.
This project is a personal playground for learning and development purposes, therefore it is not supposed 
to be released on production for many users.

The **main goal** is to gain more hands-on experience with different cloud infra, CI/CD operations and scripting,
NodeJS, Typescript, bash scripting, etc. by building everything from scratch without the help of frameworks or 
multi-tools packages in order to have the chance to learn the deepest details.


## The repository
**This repo** contains the backend layer for PLAAX service, build with NodeJS and Typescript.
It provides both the [core](./src/core) of the backend and the [infra-specific implementations](./src/app) which can be 
differentiated by provider (e.g. AWS, GCP, Azure) and/or pattern (e.g. serverless, containerized server, etc.).

**The frontend** is implemented in a separated repo by following the same approach of separation between core and
infra-specific implementation.

### Structure of this repository
This project could be structured in - at least - two ways:
1. create one repository per different app-specific implementation with a sub-repository for the core;
   - manage 2+ repository;
   - core repo configured as sub-repository;
2. keep everything in one single repository:
   - easier to manage 1 repo only;
   - extra effort on keeping the repo structure clean and easy to understand;
   - extra effort on ci/cd operations (e.g. extra care with paths and packages);
   - deal with node_modules hierarchy;
   - more scripting for a faster development process.

The structure nr. 2 (apparently, the most complex one) has been chosen for learning purposes because of some
interesting challenges outside my comfort zone.

### The directory tree
- [dev](./dev): scripts for generating data, spare proof-of-concepts, static data, etc.;
- [docs](./docs): notes, snippets, project documentations;
- [src/core](./src/core): common code shared by specific applications of this project;
  - this directory might be moved into a separate repo and imported as sub-repository, but it might add some complexity;
  - a shared core for different apps represents a "source of truth" therefore the single apps should only implement
    their specific logic;
- [operations](./operations): scripts for ci/cd operations both for local run and GitHub actions;
  the internal structure should match the structure of [src/app](./src/app):
  - [/aws-lambdas](./operations/aws-lambdas): ci/cd operations for [/src/aws-lambdas](./src/app/aws-lambdas);
  - [/server](./operations/server): ci/cd operations for [/src/server](./src/app/server).
- [src/app](./src/app):
  - [/aws-lambdas](./src/app/aws-lambdas): project implementation as serverless (based on AWS Lambda);
  - [/server](./src/app/server): project implementation as containerized server;
- [.github/workflows](.github/workflows): the GitHub workflows (these files should have the prefix matching the 
  app-specific label, something that specifies cloud platform and the kind of app).


## Development: install, build, code

### Pre-install: local configuration
1. set local GitHub profile to prevent overlapping with other profiles on the current machine;
2. make sure `.npmrc` file is present, with the default npm registry, to prevent installing from other registries;
3. use the correct version of node (see section `npm+nvm`);
4. (opt.) make sure you can connect to AWS, if you want to use scripts for ci/cd operations.

See [DEV_NOTES.md](./docs/DEV_NOTES.md) for "how-to" documentation.

### Rules for this GIT repo
1. Each branch has a progressive ID like `PLAAX-1002`
2. The commit message should start with the branch ID
3. Pushes on `master` branch are not allowed (blocked by repo settings)
4. Each branch and change should pass through a pull request

### Install the project
```
# check local git config (username, email)
git config --local user.name
git config --local user.email

# if you are using nvm, set the right version of node and npm
nvm use

# check local npm registry (should be the default one)
node --version
npm --version
(or) nvm current

# initialize the project before install
npm run init

# start the full installation of main packages and applications inside ./src/app
npm run install-all

# quick checks
npm run ts-check
npm run lint
npm test
```

### Linting & Checking
- `npm run ts-check`: check the typescript code
- `npm run lint`: check the code syntax
- `npm run lint-fix`: check and fix the code syntax
- `npm run lint-debug`: check the code syntax and show the analyzed files

### Testing
- `npm test`: run all tests
- `npm run test-coverage`: run all tests and get coverage report
- `npm run test-aws-lambdas`: run all common tests and the specific tests for aws-lambda app
- `npm run test-server`: run all common tests and the specific tests for server app

### Install & cleaning
- `npm run clean`: removes all generated files and directories (after build, test-coverage, etc.)
- `npm run reset-install`: removes all node_modules directories
- `npm run install-all`: install common packages and all application(s) packages with dev dependencies
- `npm run install-all-prd`: install common packages and all application(s) packages
- `npm run install-aws-lambdas`: install common packages and aws-lambdas application packages with dev dependencies
- `npm run install-aws-lambdas-prd`: install common packages and aws-lambdas application packages
- `npm run install-server`: install common packages and server application packages with dev dependencies
- `npm run install-server-prd`: install common packages and server application packages

### Building
- `npm run build-aws-lambdas`: build the aws-lambda app
- `npm run build-server`: build the server app

The main package.json should not have any build scripts since it is not a single application;
the commands above are just some wrappers which facilitate the build from the main directory.
Alternatively, to build a specific application, go to its directory (e.g. `cd ./src/app/server`) and run `npm run build`.


## CI/CD Operations

**Scripts**. The directory [./operations](./operations) has some scripts, dockerfiles, yml files, etc. launched from GitHub Workflows,
Bitbucket pipelines, local environment for remote operations, or just for local development.
These scripts are just generic scripts which are ready to work with remote environments.
They all need some parameters or need to be called with specific CLI commands.

**Structure**. This directory should be structured like [./src/app](./src/app) for a better understanding of the repo structure.
Therefore, **for any environment** where we need to call the scripts in "operations", we should ideally create 
another directory with some bash scripts that call them in the correct way for the specific env.

**Local to remote**. The way how they are used strictly depends on the context and the environment.
For instance, each subdirectory has the directory **"local"** with some bash scripts that wrap a call to the generic
scripts in a way that is only suitable for the local environment. A **readme** file should be present in order to
explain the correct usage of the local operations.


## App implementation: AWS Lambda

This implementation is one of the most typical serverless pattern: lambda, api-gateway, dynamo-db.
For learning purposes, no frameworks have been used (e.g. serverless framework) in order to not hide any technical
details such as cloudformation configuration, deployment processes, local-dev execution, etc.

### Serverless pattern
At the moment, the structure is very simple: 1 lambda, 1 api-gateway, and 1 dynamo-db.
Actually, the database client (repository) is part of the core which is not totally correct if we want to support 
a different cloud provider rather than AWS. It should be moved somewhere else in the future.

### CI/CD operations

**Build & Release** step installs all npm dependencies, build the final js distribution (no bundles), pack everything
into a zip file and uploads it to the S3 bucket. **Deploy** and **Deploy-static** runs the cloudformation templates to
respectively deploy the dynamic and static resources (ideally, deploy-static should be executed only once).

**Local** directory contains some bash scripts and dockerfiles that wraps the scripts above in order to be executed
for the local environment.

[**GitHub Workflow**](./.github/workflows) has some actions and workflows that run the scripts above. 


## App implementation: Containerized Server

The implementation as server is only for local-dev purposes in order to quickly run the APIs in the local environment
by using the remove database. It is also used as PoC for showing the separation between the core directory and an
actual specific implementation.

### CI/CD operations

At the moment, this implementation is not made to be deployed on remote environment.
The operation directory for server has 2 dockerfiles (dev and prd) which show some differences between a possible
execution for a development environment and the container for production.

**Local** directory contains a bash script which makes easy to run one of the docker files (dev, prd) or just
do some simple operations with images and containers related to the server implementation.

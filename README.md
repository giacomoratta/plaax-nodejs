# PLAAX NodeJs Backend

A backend layer for PLAAX service, build with NodeJS and Typescript.

**What is PLAAX?** It is a small personal project inspired by some web-apps for activity planning.
It is not supposed to be released on production for many users.
The **main goal** is to gain more hands-on experience with AWS infra, CI/CD, 
NodeJS, Typescript, bash scripting, etc. by building everything from scratch 
without the help of frameworks or multi-tools packages.

### Structure of this repository
- [dev](dev): scripts for generating data, spare proof-of-concepts, static data, etc.;
- [docs](docs): notes, snippets, project documentations;
- [operations](operations): scripts for ci/cd operations both for local run and GitHub actions;
- [src/core](src%2Fcore): common code shared by specific applications of this project;
- [src/app/awsLambdas](src%2Fapp%2FawsLambdas): project implementation as serverless (based on AWS Lambda);
- [src/app/server](src%2Fapp%2Fserver): project implementation as containerized server.

**src/core vs. src/app**. This repository has the main code of the project and some of its possible applications 
(server, serverless, etc.). Therefore, only these specific applications can be built (not the full project).

### Pre-install: local configuration
See [DEV_NOTES.md](docs%2FDEV_NOTES.md) for "how-to" documentation.
1. set local GitHub profile to prevent overlapping with other profiles on the current machine;
2. make sure `.npmrc` file is present, with the default npm registry, to prevent installing from other registries;
3. use the correct version of node (see section `npm+nvm`);
4. (opt.) make sure you can connect to AWS, if you want to use scripts for ci/cd operations.


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
the commands above are just some wrappers which facilitates the build from the main directory.
Alternatively, to build a specific application, go to its directory (e.g. `cd ./src/app/server`) and run `npm run build`.

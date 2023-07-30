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



### Next steps for MVP: general - MVP1-Part5

- Add the final logger
  - GOAL: do not log with console
  - Introduce pino-logger (+ research for alternatives)
  - Error stacks should point to the exact line of source TS code
  - !! Do before the code starts growing up

- Finalize server app for local development
  - (done) run local and run local docker
  - Dockerfile / Dockerfile.prod
    - is really needed now to be perfect?
    - no, do the best and leave comments with technical debt
    - do not change current one
    - make it working good enough
    - rename to work with Dockerfile.dev
  - add docker scripts
    - create bash script with single option (with variables, etc.)
    - add build step // docker build --target distbuilder -t gr/plaax-nodejs -f ./Dockerfile ../../../
    - "docker-build": "docker build -t gr/plaax-nodejs .",
    - "docker-run": "docker run -p 3000:3000 gr/plaax-nodejs",
    - "docker-start": "docker container start $(docker container ls -a | awk '/plaax-nodejs/ {print $1}' | head -n1)",
    - "docker-stop": "docker container stop $(docker container ls | awk '/plaax-nodejs/ {print $1}')",
    - "docker-list-containers": "docker container ls -a | awk '/plaax-nodejs/'",
    - "docker-list-images": "docker images | awk '/plaax-nodejs/'",
    - "docker-rm-containers": "docker rm $(docker container ls -a | awk '/plaax-nodejs/ {print $1}')",
    - "docker-rm-images": "docker rmi $(docker images | awk '/plaax-nodejs/ {print $3}')"
  - implement 1 api endpoint
    - with unit-tests
  - run local with docker working with remote aws services
    - extend bash script to autoload local aws credentials
    - use .env file?
  - implement all api endpoints
    - with unit-tests
    - some integration tests

- Improve README to be a good presentation of the project
  - doc git guidelines
    - commit message stile
    - not allowed to push on master
  - document scripts in operations + locals
    - briefly
    - everything can change a lot
    - just do it for making the README complete for an external presentation
    - also document git workflows and the usage of operations


### Next steps for MVP: test development experience - MVP1-Part6

- Create POST controller for new items
  - GOAL: play with IDs table

- Create GET controller for user calendar
  - GOAL: play with time-based queries

- Add "status" for Activity and Task (new: default, ready, progress, waiting, done)
  - GOAL: try to change the core



### Nice-to-have (not for MVP)

- Experiment with Lambda's code
  - Extract "awsLambdas" dir
  - All the logic for lambdas here
  - package.json with the specific packages
  - Challenge#1: build code from separate directories
    - multiple rootDir with `"rootDirs": ["./scripts", "./src"]` 
    - https://www.typescriptlang.org/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs
  - Challenge#2: operations and workflows should be differentiated
    - current ops/wf should be put into sub-dir "aws-serverless"
    - then rename all file paths into .sh and docker files

- Local dev with koa + local aws (e.g. dynamodb)
  - GOAL: play with local aws services and containers
  - GOAL2: remove useless dependencies for lambda bundles
  - STEPS:
    - build and run a local-dev server with koa running on docker
    - allow test api with requests to remote aws cloud
    - setup a full local aws env on docker containers
  - Possible implementation:
    - Extract "server" dir
    - All the logic for an EC service here
    - package.json with the specific packages

- Automate copy main releases into special bucket
  - create GitHub action
  - copy a release when PR is merged into main to "plaax-release-main"

- Replace current s3 plaax-dev-release with plaax-temp-release
 
- Make a plan for periodic operations
  - npm vulnerabilities
  - package minor updates
  - package major updates
  - GitHub actions? Local scripts?

- Deploy server app on ECS

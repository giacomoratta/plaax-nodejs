## Archive of Work-in-Progress
_(sorted by descending date)_

#### PLX-1005: MVP1 part2



#### PLX-1004: MVP1 part1

- Build 1
  - (done) Upload zip to S3 with commit short
  - (done) Bash-Script for distribution
  - (done) Create a docker image for build and release

- Deploy 1
  - (ref) https://octopus.com/blog/deploying-lambda-cloudformation
  - (done) Prepare Cloudformation script
  - (done) CFN-Deploy Lambda, Log, Authorizer in 1 YAML file
  - (done) Accept external params for env-name
  - (postponed) Split YAML file in multiple files (?)

- Deploy 2
  - (done) Create 1 Bash script for deployment
  - (done) rename "aws-cfn-stack.sh" to "aws-cfn.operations.sh" (+local)
  - (not-needed... too many layers) create "deploy.sh"/"deploy.local.sh" (wrap "aws-cfn.operations.sh")
  - (done) Create a docker image for deployment
    - (done) "deploy.dockerfile"
    - (postponed - todo added) basic linux image
    - (done) same approach like build-release.dockerfile
    - (done) "deploy.dockerfile.local.sh"

- Build 2
  - (done) throw Error (from src/nested-dir/dir2/...) included in the handler
  - (done) check what happens with Error info...
  - (done) add source maps

- Build and deploy local zip files with CFN
  - just replace lambda code (script for build, zip, replace lambda code) ?
  - (or) local scripts uses a different hash
  - make release hash generic (not linked to git commit short)
  - rename zip files with "plaax-<hash>.zip"
  - handle missing release hash

- Deploy API-Gateway
  - (ref) https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ApiGatewayV2.html
  - (ref / api-gw-cfn) https://gist.github.com/toddlers/7c324e39c2ef3058d6c50b895076b16f
  - deploy stand-alone GW with CFN
  - trigger lambda with GW
  - fix names for api-gw stuff in CFN template, fix Stack name

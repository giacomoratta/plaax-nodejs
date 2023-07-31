#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

printf "\n\nSoftware versions:\n"

printf " >> OS: "
uname -a

printf " >> Node version: "
node --version

printf " >> NPM version: "
npm --version

CURRENT_DIRECTORY=$(pwd)
AWS_LAMBDA_APP_DIRECTORY="./src/app/awsLambdas"

printf "\nInstalling all packages with a clean-install..."
npm run init

printf "\nRunning test suite..."
npm run test-aws-lambdas

printf "\nBuilding the final distribution..."
cd $AWS_LAMBDA_APP_DIRECTORY
npm run build
cd $CURRENT_DIRECTORY

printf "\nInstalling the production packages..."
npm run reset-init -- --yes
npm run init-prd

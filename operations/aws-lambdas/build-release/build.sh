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
AWS_LAMBDA_APP_DIRECTORY="./src/app/aws-lambdas"

printf "\nInstalling all packages with a clean-install..."
npm run init
npm run install-aws-lambdas

printf "\nRunning test suite..."
npm run test-aws-lambdas

printf "\nBuilding the final distribution..."
npm run build-aws-lambdas

printf "\nInstalling the production packages..."
npm run reset-install -- --yes
npm run install-aws-lambdas-prd

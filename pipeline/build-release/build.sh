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


printf "\nInstalling the packages with a clean-install..."
npm ci

printf "\nRunning test suite..."
npm test

printf "\nBuilding the final distribution..."
npm run build
#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

printf "\n\nInstalling the package...\n"
npm ci

printf "\n\nBuilding the release...\n"
npm run clean
npm run test

printf "\n\n"

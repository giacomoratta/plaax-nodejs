#!/bin/bash

printf "\nPackage.json scripts utility: $1 \n"
printf "Node version: $(node --version)\n"
printf "Npm version: $(npm --version)\n"
printf "\n"

CURRENT_DIRECTORY=$(pwd)



# Functions ----------------------------------------------------------------------------------------------------

# Return 1 if the current shell is zsh, 0 otherwise.
is_zsh_shell () {
  SUB='zsh'
  if [[ "$SHELL" == *"$SUB"* ]]
  then
    return 1
  fi
  return 0
}


# Ask for confirmation; return 1 if 'yes', 0 otherwise.
ask_for_confirmation () {
  QUESTION="Are you sure? [y/N] "
  is_zsh_shell
  if [ $? -eq 1 ]
  then
    read "REPLY?$QUESTION"
  else
    read -r -p "$QUESTION" REPLY
  fi

  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    return 1
  fi
  return 0
}


# Removes all generated directories and files after tests and builds.
cleanup_temp_generated () {
  rm -rf **/release*.zip 2>/dev/null
  rm -rf **/dist 2>/dev/null
  rm -rf **/coverage 2>/dev/null
}



# Commands ----------------------------------------------------------------------------------------------------

if [ "$1" = "--clean" ]
then
  printf "Cleaning locally generated data...\n"
  cleanup_temp_generated
fi


if [[ $1 =~ ^"--install" ]]
then
  # Note: npm ci solves the error when trying to run the dist:
  # Cannot find module... Please verify that the package.json has a valid "main" entry"

  NPM_CI_OPTIONS=""

  if [[ "$1" =~ "-prd"$ ]]
  then
    printf "Installing in production mode...\n"
    NPM_CI_OPTIONS=" --omit=dev"
  fi

  printf "Installing the main packages of the repository...\n"
  npm ci $NPM_CI_OPTIONS
  printf "\n\n"

  if [[ $1 =~ ^"--install-all" ]] || [[ $1 =~ ^"--install-aws-lambdas" ]]
  then
    printf "Installing the packages of 'aws-lambdas' application...\n"
    cd "$CURRENT_DIRECTORY/src/app/aws-lambdas"
    npm ci $NPM_CI_OPTIONS
    printf "\n\n"
  fi

  if [[ $1 =~ ^"--install-all" ]] || [[ $1 =~ ^"--install-server" ]]
  then
    printf "Installing the packages of 'server' application...\n"
    cd "$CURRENT_DIRECTORY/src/app/server"
    npm ci $NPM_CI_OPTIONS
    printf "\n\n"
  fi
fi


if [ "$1" = "--reset-install" ]
then
  printf "All 'node_modules' directories will be deleted.\n"

  REPLY=0
  if [ "$2" != "--yes" ]
  then
    ask_for_confirmation
    REPLY=$?
  else
    REPLY=1
  fi

  if [[ $REPLY -eq 1 ]]
  then
    rm -rf **/node_modules 2>/dev/null
  fi
fi


if [ "$1" = "--build-aws-lambdas" ]
then
  cd "$CURRENT_DIRECTORY/src/app/aws-lambdas"
  npm run build
  cd $CURRENT_DIRECTORY
fi


if [ "$1" = "--build-server" ]
then
  cd "$CURRENT_DIRECTORY/src/app/server"
  npm run build
  cd $CURRENT_DIRECTORY
fi


printf "\n"

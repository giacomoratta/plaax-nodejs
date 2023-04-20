#!/bin/bash

source $HOME/.zshrc
aws-set-env-giacomoratta1

if [[ "$AWS_PROFILE" != "giacomoratta1" ]]
then
  printf "AWS_PROFILE is not the expected one.\n\n"
  return 1
fi

return 0
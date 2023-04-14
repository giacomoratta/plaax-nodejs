source $HOME/.zshrc
aws-set-env-giacomoratta1

if [[ "$AWS_PROFILE" != "giacomoratta1" ]]
then
  echo "AWS_PROFILE is not the expected one.\n"
  return 1
fi

return 0
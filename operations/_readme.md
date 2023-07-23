# CI/CD Operations

All the scripts in the directory "operations" are just generic scripts which are ready to work with remote environments.

They all need some parameters or need to be called with specific CLI commands.

However, the way how they are used strictly depends on the context and the environment.

For instance, the directory "local" has some bash scripts which internally call the generic scripts in "operations"
directory in a way that is only suitable for the local environment.

Therefore, for any env. where we need to call the scripts in "operations", we should ideally create another directory
with some bash scripts that call them in the correct way for the specific env.

N.B. this directory should maybe be renamed to something like "ci-cd-operations" or just "operations".
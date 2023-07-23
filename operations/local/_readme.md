# Local scripts

These scripts are basically wrappers for the scripts used remotely for CI/CD; local scripts just automatically 
prepare the local environment with some additional configurations (aws, node, npm, etc.).

Therefore, all the scripts in the directory "local" will have some effects on remote environments (AWS Cloud):
**Execute with care!**.

### How-to Run

**_Always execute from the main level of this repo!_**
...as they are supposed to be executed inside workflows, pipelines, etc.

1. Go to the main level of this repo
2. Call the script via `/bin/zsh ./operations/local/abc.sh --param --param2`
3. Use the right shell otherwise they might not work as expected (e.g. `/bin/zsh`, `/bin/bash`)

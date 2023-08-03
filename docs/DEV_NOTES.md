# Dev Notes

## Local config for `git`, `npm`, `nvm`

### `git`: set a permanent git config for a repository 
This way will prevent the usage of other git accounts or global settings.
```
$ git config --local user.email '878787+myusername@users.noreply.github.com'
$ git config --local user.name 'myusername'

# Quick check of the git config for the current repositories:
$ cat .git/config

# Add ssh keys
$ ssh-add $HOME/.ssh/<key-name>
$ ssh-add -K ~/.ssh/<key-name> #add permanently
$ ssh-add --apple-use-keychain ~/.ssh/<key-name> #add permanently (macOs 2023)

# Try ssh-authentication with verbose mode
$ ssh -vT git@github.com
```

### `npm`: set a local npm registry
Create the file `.npmrc` with the following content:
```
registry=https://registry.npmjs.org/
@namespace:registry=https://registry.npmjs.org/
```

### `npm` + `nvm`: set local node and npm versions
1. Add `engines` section to `package.json`:
    ```
    "engines": {
      "node": ">=18.12.1 <19.0.0",
      "npm": ">=9.5.0 < 10.0.0"
    }
    ```
2. Install `nvm`
3. Create the `.nvmrc` file:
    ```
    $ nvm use lts/hydrogen
    $ node -v > .nvmrc
    
    # next time, just run:
    $ nvm use
    ```
  
### Exclusions in .gitignore
```
*
!.gitignore
!readme
```


## Typescript

### Option --noEmit
The noEmit option tells TypeScript that we only want to run type checking and do not want the compiler to output any transpiled code.

### Different TsConfigs
- [tsconfig.json](..%2Ftsconfig.json): the main tsconfig with common and general configs;
  it must keep this name (not tsconfig.common.json) so the IDE or other automatic checks can easily find it.
- [tsconfig.build.json](..%2Ftsconfig.build.json): specific config for distribution build;
- [tsconfig.eslint.json](..%2Ftsconfig.eslint.json): config for eslint checks.


## Bash Scripting
> N.b. Pay attention to the Unix shell with which you are running the script
> because something might fail for no clear reasons (e.g. 'file' not found).
> Make sure you run the script with the correct `/bin/bash` or `/bin/zsh`.

- `#!/bin/bash` is needed to run the script as executable (e.g. `./script.sh`);
- `exit` must be used instead of `return` in order to stop a script execution;
- `set -e`: exit immediately if a command exits with a non-zero status;
- `alias` must be avoided in the scripts: it is made for terminal usage; use functions instead;
- `printf` is preferable to `echo` (which does not process escape characters like `\n`; `echo -e` does it!).
- `$SHELL` (outputs: `/bin/zsh` or `/bin/bash`) states the current shell; it can be used to:
  - force scripts to be executed with the current shell
  - differentiate commands based on the compatibility zsh vs. bash (e.g. `read` or `date`)
- `read`: differences between bash and zsh
  - zsh: `read "REPLY?$QUESTION"`
  - bash: `read -r -p "$QUESTION" REPLY`
- `date`: differences between bash and zsh
  - zsh: `date -v-30d "+%Y-%m-%d"`
  - bash: `date -d "30 days ago" "+%Y-%m-%d"`
- run commands and save output into a file:
  - `2>&1 | tee -a build.log`
  - `2>&1` redirects stderr into the stdout stream
  - `-a` option appends the output instead of overwriting (the log file will have more info)


## Docker

### COPY always as 'root' user
- The `COPY` instruction sets the copied files with `root` user.
- Use `--chowm` if we need to set another user.
- `COPY --chown=${USER_GROUP} ./src ./src`

### Remove container after the execution
- `docker run --rm ...`

### ENV vs. ARG
- `ARG` should be used for arguments inside the docker file and saving environment variables
  - usage (image build): `docker build --build-arg var_name="value" ...`
  - usage for setting environment variables:
    ```
    ARG var_name
    ENV MY_ENV_VAR $var_name
    ```
- `ENV` should be used for on-the-fly environment variables for the running software
  - better for sensitive data, since it will be not saved into the image
  - usage (container run): `docker run --env var_name="value" ...` 
  - usage (container run) with variable: `docker run --env AWS_ACCESS_KEY_ID ...`
    - the docker command reads the value from local variable $AWS_ACCESS_KEY_ID
    - the container will have the environment variable as $AWS_ACCESS_KEY_ID

### Secrets inside images and containers
- Keeping secrets in the image is an unsafe solution: look for alternative approaches.
- Containers are always accessible, so do not keep secrets in containers where other people can access them;
- if we run a container in a controlled environment (e.g. local env.), secrets are quite safe;
- ...otherwise, there are other methods to access and use secrets.

### Good practice: do not run processes as root
Running processes in the container as the root user is a precarious security practice: use a low privileged user and proper filesystem permissions. Builder stages are run as root because 1) it requires less docker instructions and 2) as far as I know - it does not represent a security issue. 

### Good practice: do not run the app as PID1
> PID 1 is special in unix, and so omitting an init system often leads to incorrect handling of processes and signals, and can result in problems such as containers which can't be gracefully stopped, or leaking containers which should have been destroyed. In Linux, processes in a PID namespace form a tree with each process having a parent process. Only one process at the root of the tree doesn't really have a parent. This is the "init" process, which has PID 1.

**Solution**: use `tini` or `dumb-init`.
- If PID1 is our app, it does not handle child-process signals, so they remain as zombie with reserved resources.
- When PID1 is 'tini' and our app terminates, the init system takes care of cleaning the process table.

### Naming conventions of Docker files
- `Dockerfile.testRunner`
- `testRunner.Dockerfile`

### REFERENCES
- https://towardsdev.com/writing-a-docker-file-for-your-node-js-typescript-micro-service-c5170b957893
- https://snyk.io/wp-content/uploads/10-best-practices-to-containerize-Node.js-web-applications-with-Docker.pdf
- https://petermalmgren.com/pid-1-child-processes-docker/
- https://gist.github.com/StevenACoffman/41fee08e8782b411a4a26b9700ad7af5


## GitHub Actions

### Runners
We do not need to create a Docker file to run scripts for tests, builds, deployments, etc.

GitHub already provides hosted runners with a lot of pre-installed software: 
https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners

For example, the runner with Ubuntu 22 and its internal packages is described here: 
https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md


### Create and run workflows on a branch
 
1. Create a dummy `.github/workflows/wf1.yml` to test;
2. Push to your default branch (probably `main`);
3. Go to "Actions": the new action should appear and the dummy workflow could be run;
4. Create new branch `test-branch` from default repo branch;
5. Modify workflow file `.github/workflows/wf1.yml` with the actual workflow;
6. Commit and push to `test-branch`;
7. Go to "Actions", click on workflow name and set "Use workflow" from to test-branch;
8. Click the button "Run workflow".
9. From now on, many changes can be made on the workflow: name, job or step names, input for the trigger, etc.

In conclusion, the basic idea is that GitHub cannot execute a workflow from a branch if it does not exist in the `main` branch.
So, when we want to introduce a new workflow and test it into a branch, we need to start by pushing the dummy version of
this new workflow on the `main` branch.

Credits: https://stackoverflow.com/a/65389878


### Run workflow with a docker custom image

- There are not many differences on how docker commands are executed;
- DOCKER_BUILDKIT is needed to enable some new or advanced features: https://docs.docker.com/build/buildkit/;
  - for example, it is needed in case the docker image has to set permissions on files with `chmod`;
  - is an improved backend to replace the legacy builder;
  - it is the default builder for users on Docker Desktop, and Docker Engine as of version 23.0.

### Environments, secrets and variables

- Go to "Settings" > "Environments" and create a new environment;
- Each environment has its own secrets and variables;
- Secrets and variables can be defined on a global level but
  - in case of overlap with an env. secret/variable, the latter wins;
- Got "Settings" > "Secrets and variables" to create secrets and variables or just display them by environment.

**Useful global variables defined by GitHub:**
- `${{ github.sha }}`: the full commit hash
- https://docs.github.com/en/actions/learn-github-actions/contexts#github-context

**How to use secrets and variables:**
- `${{ secrets.AWS_ACCESS_KEY_ID }}`
- `${{ vars.TEST_VAR }}`
- (no need to state the env)

### Notes about [workflows](..%2F.github%2Fworkflows)

- Workflow based on Docker:
  - nice experiment but, it is not needed at the moment;
  - running bash scripts is enough.
- Differentiate environments for deployments:
  - define a global env. variable `ENV_NAME`;
  - use it in the script wherever it is needed as `$ENV_NAME`.


## Package.json
- How to add comments:  https://bobbyhadz.com/blog/add-comments-to-package-json
- Pass external parameters to npm scripts: with '--'; example: `npm run reset-init -- --yes`
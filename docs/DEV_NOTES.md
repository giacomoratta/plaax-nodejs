# Dev Notes

## General steps before developing: local dev config
- node and npm (nvm use)
- npm registry
- GitHub profile
- AWS profile


## Local config for `git`, `npm`, `nvm`

#### Set a permanent git config for a repository 
This way will prevent the usage of other git accounts or global settings.
```shell
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

#### Set a local npm registry
Create the file `.npmrc` with the following content:
```text
registry=https://registry.npmjs.org/
@namespace:registry=https://registry.npmjs.org/
```

#### Set local node and npm versions
- Add `engines` section to `package.json`:
  ```
  "engines": {
    "node": ">=18.12.1 <19.0.0",
    "npm": ">=9.5.0 < 10.0.0"
  }
  ```
- Create the `.nvmrc` file:
  ```shell
  $ nvm use lts/hydrogen
  $ node -v > .nvmrc
  
  # next time, just run:
  $ nvm use
  ```
  
#### Exclusions in .gitignore
```text
*
!.gitignore
!readme
```

## Docker

#### COPY always as 'root' user
- The `COPY` instruction sets the copied files with `root` user.
- Use `--chowm` if we need to set another user.
- `COPY --chown=${USER_GROUP} ./src ./src`

#### Remove container after the execution
- `docker run --rm ...`

#### ENV vs. ARG
- `ENV` should be used for environment variables for the running software.
- `ARG` should be used for arguments inside the docker file.

#### Environment variables
- Image: `docker build --build-arg var_name ...`
- Container: `docker run --env var_name ...`

#### Secrets inside images and containers
- Keeping secrets in the image is an unsafe solution: look for alternative approaches.
- Containers are always accessible, so do not keep secrets in containers where other people can access them;
- if we run a container in a controlled environment (e.g. local env.), secrets are quite safe;
- ...otherwise, there are other methods to access and use secrets.

#### Good practice: do not run processes as root
Running processes in the container as the root user is a precarious security practice: use a low privileged user and proper filesystem permissions. Builder stages are run as root because 1) it requires less docker instructions and 2) as far as I know - it does not represent a security issue. 

#### Good practice: do not run the app as PID1
> PID 1 is special in unix, and so omitting an init system often leads to incorrect handling of processes and signals, and can result in problems such as containers which can't be gracefully stopped, or leaking containers which should have been destroyed. In Linux, processes in a PID namespace form a tree with each process having a parent process. Only one process at the root of the tree doesn't really have a parent. This is the "init" process, which has PID 1.

**Solution**: use `tini` or `dumb-init`.
- If PID1 is our app, it does not handle child-process signals, so they remain as zombie with reserved resources.
- When PID1 is 'tini' and our app terminates, the init system takes care of cleaning the process table.

#### Naming conventions of Docker files
- `Dockerfile.testRunner`
- `testRunner.Dockerfile`

#### REFERENCES
- https://towardsdev.com/writing-a-docker-file-for-your-node-js-typescript-micro-service-c5170b957893
- https://snyk.io/wp-content/uploads/10-best-practices-to-containerize-Node.js-web-applications-with-Docker.pdf
- https://petermalmgren.com/pid-1-child-processes-docker/
- https://gist.github.com/StevenACoffman/41fee08e8782b411a4a26b9700ad7af5

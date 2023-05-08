# PLAAX NodeJs Backend

A backend layer for PLAAX service, build with NodeJS and Typescript.

### Pre-req: set local dev config
See [DEV_NOTES.md](docs%2FDEV_NOTES.md) for "how-to" documentation.
- node and npm: `nvm use` (set locally into `.nvmrc`)
- npm registry: `default` (set locally into `.npmrc`)
- GitHub profile (set to `local config`)
- AWS profile (from `.aws` credentials or scripts)


### Install the project
```bash
# set local git config (username, email)

# check local npm registry (should be the default one)

# set the right version of node and npm
nvm use

npm install 
```

### Linting
* `npm run lint`: check the code
* `npm run lint-fix`: check and fix the code
* `npm run lint-debug`: check the code and show the analyzed files

### Testing
* `npm test`: run all tests
* `npm run test-coverage`: run all tests and get coverage report

### Build & Run
* `npm run build`: build the project distribution (`dist` directory)
* `npm run dev`: build and run the project in _development_ mode
* `npm start`: run the project in _production_ mode

### Docker commands
* `npm run docker-build`: build the docker image
* `npm run docker-run`: create and run a container based on the docker image
* `npm run docker-start`: start an existing container of this project
* `npm run docker-stop`: stop a running container of this project
* `npm run docker-list-containers`: list all docker containers related to this project
* `npm run docker-list-images`: list all docker images related to this project

### Cleaning
* `npm run clean`: delete generated directories (e.g. `dist`, `coverage`)
* `npm run docker-rm-containers`: remove all docker containers related to this project
* `npm run docker-rm-images`: remove all docker images related to this project

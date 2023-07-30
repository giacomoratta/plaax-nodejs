## PLAAX NodeJs Backend: server and containers

This application is the implementation of the project as containerized service.

### Build & Run
- `npm run build`: build the project distribution (`dist` directory)
- `npm run start-dev`: build and run the project in _development_ mode
- `npm run start-prd`: run the project in _production_ mode

### Docker commands
- `npm run docker-build`: build the docker image
- `npm run docker-run`: create and run a container based on the docker image
- `npm run docker-start`: start an existing container of this project
- `npm run docker-stop`: stop a running container of this project
- `npm run docker-list-containers`: list all docker containers related to this project
- `npm run docker-list-images`: list all docker images related to this project

### Cleaning
- `npm run clean`: delete generated directories (e.g. `dist`, `coverage`)
- `npm run docker-rm-containers`: remove all docker containers related to this project
- `npm run docker-rm-images`: remove all docker images related to this project

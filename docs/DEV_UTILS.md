# Dev Utils

## Docker

Docker images for Node: https://hub.docker.com/_/node

#### Images
```
# Build the image
docker build -t gr/node-bpv1 .
```

#### Containers
```
# Run container, detached (-d) and with terminal (-t)
$ docker run -d -t gr/node-bp-v1

# Port mapping
$ docker run -d -t -p 3020:3000 gr/node-bpv1

# Expose ports with automatically assigned one
$ docker run -d -t -P gr/node-bpv1

# Access the container with a terminal
$ docker exec -ti e390ceb99781 sh

# List all running containers of a specific image
$ docker container ls | awk '/node-bp-v1/ {print $1}'

# Stop all running containers of a specific image
$ docker container stop $(docker container ls | awk '/node-bp-v1/ {print $1}')

# Run the newest container of a specific image
$ docker container start $(docker container ls | awk '/node-bp-v1/ {print $1}' | head -n1)
```

#### Cleaning
```
# Remove all images
$ docker rmi $(docker images -q)

# Stop all containers
$ docker container stop $(docker ps -a -q)

# Remove all containers
$ docker rm $(docker ps -a -q)

# print all image IDs of intermediates <none>
# the size is cumulative, so nothing to care about... just look at the list sometimes 
$ docker images -a | awk '/none/ {print $3}'
$ docker rmi $(docker images -a | awk '/none/ {print $3}')
```

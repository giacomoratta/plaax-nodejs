# Dev Utils

## Bash

#### Strings
```
# Check string length
if [[ ${#StringVar} -lt $MinLength ]]
then
  ...
fi

# Get substring 
echo $RELEASE_HASH | cut -c1-8  # between char(1) and char(8)
```

#### Search files by prefix in the current directory
```
find . -maxdepth 1 -type f -name "$1*"
```

#### Dates
```
# Current timestamp
date +"%s"

# Print the date of 30 days ago with a specific format
date -d "30 days ago" "+%Y-%m-%d"  # linux
date -v-30d "+%Y-%m-%d"            # unix
```

#### Awk
```
# Complex output / custom '-' separator
echo "..." | awk -F- '{printf "%s-%s\n", $v1, $v2}'
```

#### Loop over text lines
```
while read -r SingleLine
  do
    ...
  done <<< "$MultipleLines"
```


## AWS Cli

#### S3: Get the most recent file by prefix
```
aws s3api list-objects-v2 \
   --bucket "$S3_RELEASES_BUCKET" \
   --prefix "$1" \
   --query 'sort_by(Contents, &LastModified)[-1].Key'\
   --output text
```

#### S3: Get all the files older than a date
```
aws s3api list-objects-v2 \
 --bucket "$S3_RELEASES_BUCKET" \
 --query "Contents[?LastModified<'$1']" \
 --output text
```


## Docker

Docker images for Node: https://hub.docker.com/_/node

#### Images
```
# Build the image
docker build -t gr/plaax-nodejs .

# Build the image of a specific stage
docker build --target basebuilder -t gr/plaax-nodejs .

# Check image content
docker run -it gr/plaax-nodejs sh
```

#### Containers
```
# Run container, detached (-d) and with terminal (-t)
$ docker run -d -t gr/plaax-nodejs

# Port mapping
$ docker run -d -t -p 3020:3000 gr/plaax-nodejs

# Expose ports with automatically assigned one
$ docker run -d -t -P gr/plaax-nodejs

# Access the container with a terminal
$ docker exec -ti e390ceb99781 sh

# List all running containers of a specific image
$ docker container ps | awk '/plaax-nodejs/ {print $1}'

# Stop all running containers of a specific image
$ docker container stop $(docker container ls | awk '/plaax-nodejs/ {print $1}')

# Run the newest container of a specific image
$ docker container start $(docker container ls | awk '/plaax-nodejs/ {print $1}' | head -n1)
```

#### Cleaning
```
# Remove all images
$ docker rmi $(docker images -q)

# Stop all containers
$ docker container stop $(docker ps -a -q)

# Remove all exited containers
$ docker rm $(docker container ls -a | awk '/Exited/ {print $1}')

# Remove all containers
$ docker rm $(docker ps -a -q)

# print all image IDs of intermediates <none>
# the size is cumulative, so nothing to care about... just look at the list sometimes 
$ docker image ls | awk '/none/ {print $3}'
$ docker rmi $(docker image ls | awk '/none/ {print $3}')
```

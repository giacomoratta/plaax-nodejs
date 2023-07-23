#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e


# Keep S3 bucket clean (versioning is disabled, so no lifecycle rules)
source ./operations/utils/aws-release.utils.sh --delete-current-published-release


# Publish current release from local bundle files
source ./operations/utils/aws-release.utils.sh --publish-current-local-release

#!/bin/bash
set -e

error_handler() {
   echo "ERROR on line $LINENO"
   echo "Command: '$BASH_COMMAND'"
   echo "Exit Code: $?"
}

trap 'error_handler' ERR

echo "Pulling latest code from Git"
git pull

echo "Rebuilding and restarting containers"
docker-compose up -d --build

echo "--- Update Complete ---"
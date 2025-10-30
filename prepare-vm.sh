#!/bin/bash

if [ "$(id -u)" -ne 0 ]; then
   echo "This script must be run as root. Please use: sudo ./prepare-vm.sh"
   exit 1
fi

set -e

error_handler() {
   echo "ERROR on line $LINENO"
   echo "Command: '$BASH_COMMAND'"
   echo "Exit Code: $?"
}

trap 'error_handler' ERR

echo "Updating and upgrading system packages"
apt update
yes | DEBIAN_FRONTEND=noninteractive apt-get -yqq upgrade

echo "Installing Docker, Docker Compose, and Curl"
apt-get install -y docker.io docker-compose curl

echo "Configuring firewall (UFW)..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 3307/tcp
yes | ufw enable

echo "Adding user '$SUDO_USER' to the docker group"
usermod -aG docker $SUDO_USER

echo "--- VM Preparation Complete ---"
echo "IMPORTANT: You must log out and log back in (as $SUDO_USER) for Docker permissions to apply."
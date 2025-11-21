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

# Function to remove conflicting Docker packages
remove_conflicting_docker() {
  echo "Checking for conflicting Docker packages..."
  if dpkg -l | grep -q docker.io; then
    echo "Removing conflicting docker.io package"
    apt-get remove -y docker.io
  fi
  if dpkg -l | grep -q "^ii  containerd "; then
    echo "Removing conflicting containerd package"
    apt-get remove -y containerd
  fi
}

echo "Updating and upgrading system packages"
apt update
yes | DEBIAN_FRONTEND=noninteractive apt-get -yqq upgrade

# Check if Docker is already installed
if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker engine and plugins"
  remove_conflicting_docker
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "Docker already installed; skipping installation."
fi

echo "Configuring firewall (UFW)..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 3307/tcp
yes | ufw enable

echo "Adding user '$SUDO_USER' to the docker group"
usermod -aG docker $SUDO_USER

echo "--- VM Preparation Complete ---"
echo "IMPORTANT: You must log out and log back in (as $SUDO_USER) for Docker permissions to apply."
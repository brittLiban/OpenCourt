#!/bin/bash

OSTYPE=$(uname -s)
if [ "$OSTYPE" == "Linux" ]; then
  SED="sed -i"
else
  SED="sed -i ''"
fi

DB_USER="app_user"
DB_NAME="opencourt"
ENV_FILE=".env"
TEMPLATE_ENV_FILE="template.env"
NGINX_CONF_FILE="nginx.conf"
TEMPLATE_NGINX_FILE="template.nginx.conf"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

set -e

error_handler() {
  echo "ERROR on line $LINENO"
  echo "Command: '$BASH_COMMAND'"
  echo "Exit Code: $?"
}

trap 'error_handler' ERR

echo "Starting OpenCourt Setup"

if ! command_exists docker; then
  echo "Error: 'docker' is required."
  echo "Please run prepare-vm.sh then re-run this script."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: 'docker compose' plugin is required."
  echo "Please run prepare-vm.sh then re-run this script."
  exit 1
fi

if [ ! -f "$TEMPLATE_ENV_FILE" ]; then
  echo "Error: $TEMPLATE_ENV_FILE not found."
  exit 1
fi

if [ ! -f "$TEMPLATE_NGINX_FILE" ]; then
  echo "Error: $TEMPLATE_NGINX_FILE not found."
  exit 1
fi

echo "Please provide the database passwords:"
read -sp "Enter a new, strong password for the database user ($DB_USER): " DB_PASS
echo
read -sp "Enter a new, strong password for the database ROOT user: " ROOT_PASS
echo

VM_IP=$(curl -s ifconfig.me)

if [ -z "$VM_IP" ]; then
    echo "Warning: Could not auto-detect public IP."
    read -p "Please enter your VM's public IP address manually: " VM_IP
fi

echo "Creating .env file"
cp "$TEMPLATE_ENV_FILE" "$ENV_FILE"

$SED "s/DB_HOST = \"\"/DB_HOST = \"db\"/" "$ENV_FILE"
$SED "s/DB_USER = \"\"/DB_USER = \"$DB_USER\"/" "$ENV_FILE"
$SED "s/DB_PASSWORD = \"\"/DB_PASSWORD = \"$DB_PASS\"/" "$ENV_FILE"
$SED "s/DB_NAME = \"\"/DB_NAME = \"$DB_NAME\"/" "$ENV_FILE"
$SED "s/DB_PORT =/DB_PORT = 3306/" "$ENV_FILE"

echo "" >> "$ENV_FILE"
echo "# MySQL Root Password (for Docker)" >> "$ENV_FILE"
echo "MYSQL_ROOT_PASSWORD=$ROOT_PASS" >> "$ENV_FILE"

echo "Creating nginx.conf file"
cp "$TEMPLATE_NGINX_FILE" "$NGINX_CONF_FILE"
$SED "s|YOUR_SERVER_IP|$VM_IP|" "$NGINX_CONF_FILE"

echo "Building and starting all containers (web, backend, db)"
docker-compose up -d --build

echo "---"
echo "Setup Complete!"
echo "Your application is running at: http://$VM_IP"
echo "Connect to MySQL Workbench at: $VM_IP:3307 (User: $DB_USER)"
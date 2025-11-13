#!/bin/bash

DB_USER="test_user"
DB_NAME="opencourttest"
ENV_FILE=".env"
TEMPLATE_ENV_FILE="template.env"
NGINX_CONF_FILE="nginx.conf"
TEMPLATE_NGINX_FILE="template.nginx.conf"
VM_IP="localhost"

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

echo "Starting OpenCourt LOCAL Setup"

if ! command_exists docker || ! command_exists docker-compose; then
  echo "Error: 'docker' and 'docker-compose' are required."
  echo "Please have Docker Desktop running."
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

echo "Creating .env file"
cp "$TEMPLATE_ENV_FILE" "$ENV_FILE"

sed -i "" "s/DB_HOST = \"\"/DB_HOST = \"db\"/" "$ENV_FILE"
sed -i "" "s/DB_USER = \"\"/DB_USER = \"$DB_USER\"/" "$ENV_FILE"
sed -i "" "s/DB_PASSWORD = \"\"/DB_PASSWORD = \"$DB_PASS\"/" "$ENV_FILE"
sed -i "" "s/DB_NAME = \"\"/DB_NAME = \"$DB_NAME\"/" "$ENV_FILE"
sed -i "" "s/DB_PORT =/DB_PORT = 3306/" "$ENV_FILE"

echo "" >> "$ENV_FILE"
echo "# MySQL Root Password (for Docker)" >> "$ENV_FILE"
echo "MYSQL_ROOT_PASSWORD=$ROOT_PASS" >> "$ENV_FILE"

echo "Creating nginx.conf file"
cp "$TEMPLATE_NGINX_FILE" "$NGINX_CONF_FILE"

sed -i "" "s|YOUR_SERVER_IP|$VM_IP|" "$NGINX_CONF_FILE"

echo "Building and starting all containers (web, backend, db)"
docker-compose -p opencourt_test -f docker-compose.test.yml up -d --build

echo "---"
echo "Setup Complete!"
echo "Your application is running at: http://localhost:3005"
echo "Connect to MySQL Workbench at: localhost:3307 (User: $DB_USER)"
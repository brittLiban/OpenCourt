#!/bin/bash

DB_USER="app_user"
DB_NAME="opencourt"
ENV_FILE=".env"
TEMPLATE_FILE="template.env"

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

echo "Starting OpenCourt Setup..."

if ! command_exists docker || ! command_exists docker-compose; then
  echo "Error: 'docker' and 'docker-compose' are required."
  echo "Please install them and re-run this script."
  exit 1
fi

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: $TEMPLATE_FILE not found."
  exit 1
fi

echo "Please provide the database passwords."
read -sp "Enter a new, strong password for the database user ($DB_USER): " DB_PASS
echo
read -sp "Enter a new, strong password for the database ROOT user: " ROOT_PASS
echo
echo "--- Passwords set ---"

echo "Creating .env file..."
cp "$TEMPLATE_FILE" "$ENV_FILE"

sed -i "s/DB_HOST = \"\"/DB_HOST = \"db\"/" "$ENV_FILE"
sed -i "s/DB_USER = \"\"/DB_USER = \"$DB_USER\"/" "$ENV_FILE"
sed -i "s/DB_PASSWORD = \"\"/DB_PASSWORD = \"$DB_PASS\"/" "$ENV_FILE"
sed -i "s/DB_NAME = \"\"/DB_NAME = \"$DB_NAME\"/" "$ENV_FILE"
sed -i "s/DB_PORT =/DB_PORT = 3306/" "$ENV_FILE"

echo "" >> "$ENV_FILE"
echo "# MySQL Root Password (for Docker)" >> "$ENV_FILE"
echo "MYSQL_ROOT_PASSWORD=$ROOT_PASS" >> "$ENV_FILE"

echo ".env file configured."

echo "Building and starting all containers (web, backend, db)..."
docker-compose up -d --build

echo "---"
echo "Setup Complete!"
echo "Your application is running."
echo "Connect to MySQL Workbench at: <your-vm-ip-address>:3307 (User: $DB_USER)"
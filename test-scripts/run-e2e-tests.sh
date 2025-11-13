#!/bin/bash
set -e 

echo "==============================="
echo " Running End-to-End Tests"
echo "==============================="

error_handler() {
   echo "ERROR on line $LINENO"
   echo "Command: '$BASH_COMMAND'"
   echo "Exit Code: $?"
}

trap 'error_handler' ERR

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "PROJECT_ROOT is: $PROJECT_ROOT"
echo "SCRIPT_DIR' is: $SCRIPT_DIR"


echo "Setting up end to end test environment..."

"$PROJECT_ROOT/setup-local-testing.sh"

echo "==============================="
echo "🔄 Restarting Docker container(s)"
echo "==============================="

cd $SCRIPT_DIR/

docker compose -p opencourt_test -f "$SCRIPT_DIR/../docker-compose.test.yml" down
docker compose -p opencourt_test -f "$SCRIPT_DIR/../docker-compose.test.yml" up -d


echo "Docker containers restarted successfully!"

cd "$PROJECT_ROOT/src/frontend/opencourt"

echo "Launching Cypress interactive GUI..."
npm run cypress



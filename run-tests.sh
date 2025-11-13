#!/bin/bash
set -e

echo "==============================="
echo " Running ALL Tests"
echo "==============================="

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR"/test-scripts

echo "SCRIPT_DIR = $SCRIPT_DIR"

./run-backend-tests.sh

./run-frontend-tests.sh


echo "==============================="
echo "🎉 All tests finished successfully!"
echo "==============================="
#!/bin/bash
set -e  # exit if anything fails

echo "==============================================="
echo " Running backend integration and unit tests..."
echo "==============================================="

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

cd "$ROOT_DIR/src/server"

echo "🧪 Running Jest integration tests in $(pwd)..."
npx cross-env RUN_MODE=test jest --forceExit

cd "$ROOT_DIR"

echo "✅ Integration tests completed successfully!"

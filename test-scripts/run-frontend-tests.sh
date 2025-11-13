#!/bin/bash
set -e  # exit if anything fails

echo "==============================="
echo " Running frontend integration tests..."
echo "==============================="

cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

cd "$ROOT_DIR/src/frontend/opencourt"

echo "🧪 Running Vite Unit Tests in $(pwd)..."
npx vitest run

cd "$ROOT_DIR"

echo "✅ Integration tests completed successfully!"


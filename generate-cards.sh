#!/usr/bin/env bash
set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set."
  echo "Usage: GITHUB_TOKEN=your_token_here ./generate-cards.sh"
  exit 1
fi

# Create a temporary directory in the system /tmp/ (fixes NTFS/exFAT mount issues with npm)
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

echo "Cloning vn7n24fzkq/github-profile-summary-cards..."
git clone --depth 1 https://github.com/vn7n24fzkq/github-profile-summary-cards.git "$TEMP_DIR"

cd "$TEMP_DIR"
echo "Installing dependencies..."
npm install --no-audit --no-fund
echo "Building project..."
npm run build
echo "Generating cards for nguyencongminh090..."
npm run run nguyencongminh090 7

cd - > /dev/null
echo "Copying generated cards to profile-summary-card-output/..."
mkdir -p profile-summary-card-output
cp -r "$TEMP_DIR/profile-summary-card-output/"* profile-summary-card-output/

echo "Cleaning up..."
rm -rf "$TEMP_DIR"
echo "Success! Cards generated in profile-summary-card-output/"

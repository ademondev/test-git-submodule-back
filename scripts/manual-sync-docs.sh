#!/bin/bash

# Manual script to sync docs changes to the docs repository
# Use this when the GitHub Action fails or for immediate testing

set -e

echo "🔄 Manually syncing docs to docs repository..."

# Check if we're in the right directory
if [ ! -d "docs" ] || [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the backend repository root"
    exit 1
fi

# Create a temporary branch with just docs changes
TEMP_BRANCH="temp-docs-sync-$(date +%s)"

echo "📋 Creating temporary branch: $TEMP_BRANCH"

# Checkout docs remote main branch
git fetch docs-remote
git checkout -b "$TEMP_BRANCH" docs-remote/main

# Copy current docs files over
echo "📝 Copying current docs files..."
rm -rf *.md *.txt 2>/dev/null || true  # Remove old docs files
cp -r ../docs/* . 2>/dev/null || true

# Check if there are any changes
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No docs changes to sync"
    git checkout main
    git branch -D "$TEMP_BRANCH"
    exit 0
fi

# Commit and push docs changes
git add .
git commit -m "Sync docs from backend repository

Auto-synced docs changes from backend commit: $(cd .. && git rev-parse --short HEAD)"

git push docs-remote "$TEMP_BRANCH"

# Merge to main on docs repo
echo "🔀 Merging to docs repository main branch..."
git push docs-remote "$TEMP_BRANCH":main

# Clean up
git checkout main
git branch -D "$TEMP_BRANCH"

echo "✅ Docs successfully synced to docs repository!"
echo "🔗 Check: https://github.com/ademondev/test-git-submodule-docs"
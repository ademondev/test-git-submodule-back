#!/bin/bash

# Script to update docs from the docs repository
# Run this when you want to pull latest docs changes

set -e

echo "🔄 Updating docs from docs repository..."

# Check if we're in the right directory
if [ ! -d "docs" ] || [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the backend repository root"
    exit 1
fi

# Fetch latest from docs repo
echo "📥 Fetching latest docs..."
git fetch docs-remote

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Create temp directory and copy latest docs
TEMP_DIR=$(mktemp -d)
echo "📝 Getting latest docs files..."

# Clone docs repo to temp location
git clone git@github.com:ademondev/test-git-submodule-docs.git "$TEMP_DIR/docs-repo"

# Copy docs files
cp "$TEMP_DIR/docs-repo"/*.md docs/ 2>/dev/null || echo "ℹ️  No markdown files to copy"

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Check if there are changes
if git diff --quiet docs/; then
    echo "ℹ️  Docs are already up to date"
    exit 0
fi

# Show what changed
echo "📋 Changes to be committed:"
git diff --name-status docs/

# Commit the changes
git add docs/
git commit -m "Update docs from docs repository

Auto-update to latest documentation changes from docs repo"

echo "✅ Docs updated successfully!"
echo "💡 Don't forget to push if you want to share these updates: git push origin $CURRENT_BRANCH"
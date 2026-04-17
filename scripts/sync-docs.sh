#!/bin/bash

# Script to properly sync docs changes to the docs repository
# Run this after making changes to both backend and docs

set -e

echo "🔄 Syncing docs changes to docs repository..."

# Check if we're in the backend repo root
if [ ! -f "package.json" ] || [ ! -d "docs" ]; then
    echo "❌ Error: Run this script from the backend repo root"
    exit 1
fi

# Check if there are docs changes
cd docs
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No docs changes to sync"
    cd ..
    exit 0
fi

echo "📝 Found docs changes, syncing..."

# Create a feature branch in docs repo based on backend branch name
BACKEND_BRANCH=$(cd .. && git branch --show-current)
DOCS_BRANCH="sync-from-backend-${BACKEND_BRANCH}"

echo "📋 Creating docs branch: $DOCS_BRANCH"

# Create and switch to feature branch in docs
git checkout -b "$DOCS_BRANCH" 2>/dev/null || git checkout "$DOCS_BRANCH"

# Commit docs changes
git add .
git commit -m "Sync docs changes from backend branch: $BACKEND_BRANCH

Auto-synced by sync-docs.sh script" || echo "ℹ️  No changes to commit in docs"

# Push docs branch
git push origin "$DOCS_BRANCH" || echo "ℹ️  Branch already up to date"

echo "✅ Docs changes pushed to branch: $DOCS_BRANCH"
echo "📋 Next steps:"
echo "   1. Create PR in docs repo: $DOCS_BRANCH → main"
echo "   2. Merge docs PR first"
echo "   3. Update backend submodule to point to merged docs"
echo "   4. Create and merge backend PR"

cd ..
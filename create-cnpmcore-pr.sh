#!/bin/bash
# Script to create PR in cnpmcore repository for OIDC maintainers fix
# Usage: ./create-cnpmcore-pr.sh

set -e

BRANCH_NAME="fix/oidc-published-packages-empty-maintainers"
PATCH_URL="https://raw.githubusercontent.com/cnpm/cnpm/copilot/fix-version-sync-issue/cnpmcore-oidc-fix.patch"

echo "🚀 Creating PR in cnpmcore repository..."

# Check if we're in cnpmcore directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Must be run from cnpmcore repository root"
    echo "Please run: git clone https://github.com/cnpm/cnpmcore.git && cd cnpmcore"
    exit 1
fi

# Check if on master/main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: Not on master/main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create new branch
echo "📝 Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Download and apply patch
echo "📦 Downloading and applying patch..."
curl -sL "$PATCH_URL" | git apply

if [ $? -ne 0 ]; then
    echo "❌ Failed to apply patch"
    echo "You may need to apply it manually. See CNPMCORE-PR-INSTRUCTIONS.md"
    exit 1
fi

# Stage changes
echo "✅ Staging changes..."
git add .

# Show changes
echo ""
echo "📊 Changes to be committed:"
git diff --staged --stat

echo ""
echo "Files modified:"
git status --short

# Commit
echo ""
read -p "Commit these changes? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting. You can commit manually with:"
    echo "  git commit -m 'fix: handle OIDC-published packages with empty maintainers'"
    exit 1
fi

echo "💾 Committing changes..."
git commit -m "fix: handle OIDC-published packages with empty maintainers

Packages published via GitHub OIDC (e.g., @nomicfoundation/hardhat-utils@3.0.6) 
have empty maintainers arrays but include _npmUser field with GitHub Actions 
credentials. This causes sync to fail with 'invalid maintainers: []' error.

This fix uses _npmUser as a fallback maintainer when:
- Package has empty maintainers array
- Latest version has _npmUser with both name and email
- Example: { name: 'GitHub Actions', email: 'npm-oidc-no-reply@github.com' }

Changes:
- Modified PackageSyncerService.ts to check _npmUser when maintainers empty
- Applied fix in both executeTask and executeTaskWithPackument code paths
- Added comprehensive tests for OIDC-published packages

Fixes cnpm/cnpm#488"

# Push
echo ""
read -p "Push to origin? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Not pushing. You can push manually with:"
    echo "  git push -u origin $BRANCH_NAME"
    exit 0
fi

echo "🚀 Pushing to origin..."
git push -u origin "$BRANCH_NAME"

echo ""
echo "✅ Done! Branch pushed successfully."
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/cnpm/cnpmcore/pull/new/$BRANCH_NAME"
echo "2. Create the PR with title: fix: handle OIDC-published packages with empty maintainers"
echo "3. Reference issue: cnpm/cnpm#488"
echo "4. Add description from CNPMCORE-PR-INSTRUCTIONS.md"
echo ""

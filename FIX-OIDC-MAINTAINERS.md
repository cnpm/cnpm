# Fix for OIDC-Published Packages Sync Issue

## Issue
[#488](https://github.com/cnpm/cnpm/issues/488) - No matching version found for @nomicfoundation/hardhat-utils@^3.0.6

## Root Cause
Packages published via GitHub OIDC authentication (such as `@nomicfoundation/hardhat-utils@3.0.6`) have empty `maintainers` arrays both at the root level and in version manifests. The sync service in cnpmcore was failing with error:
```
❌ invalid maintainers: []
```

## Solution
The fix needs to be applied to the **cnpmcore** repository (the registry server), not this client repository.

### Creating the PR in cnpmcore

**📋 See [CNPMCORE-PR-INSTRUCTIONS.md](CNPMCORE-PR-INSTRUCTIONS.md) for complete instructions**

**Quick Start:**
```bash
# Option 1: Use the automated script
git clone https://github.com/cnpm/cnpmcore.git
cd cnpmcore
curl -O https://raw.githubusercontent.com/cnpm/cnpm/copilot/fix-version-sync-issue/create-cnpmcore-pr.sh
chmod +x create-cnpmcore-pr.sh
./create-cnpmcore-pr.sh

# Option 2: Manual application
cd /path/to/cnpmcore
git checkout -b fix/oidc-published-packages-empty-maintainers
curl https://raw.githubusercontent.com/cnpm/cnpm/copilot/fix-version-sync-issue/cnpmcore-oidc-fix.patch | git apply
git commit -am "fix: handle OIDC-published packages with empty maintainers"
git push -u origin fix/oidc-published-packages-empty-maintainers
```

### Files in This Repository
- `cnpmcore-oidc-fix.patch` - Git patch file to apply to cnpmcore
- `CNPMCORE-PR-INSTRUCTIONS.md` - Detailed instructions for creating the PR
- `create-cnpmcore-pr.sh` - Automated script to create the PR

### Changes Made
Modified `app/core/service/PackageSyncerService.ts` to use `_npmUser` as a fallback maintainer when:
1. Package has empty maintainers array
2. The latest version has `_npmUser` field with both name and email

This allows packages published via GitHub OIDC (with `_npmUser.email: "npm-oidc-no-reply@github.com"`) to sync successfully.

### Technical Details
OIDC-published packages have characteristics like:
- Empty `maintainers: []` array
- `_npmUser` field with `trustedPublisher` information
- Example: `_npmUser: { name: "GitHub Actions", email: "npm-oidc-no-reply@github.com" }`

### Code Location
The fix is in: `cnpmcore/app/core/service/PackageSyncerService.ts`
- Lines ~690-700: First occurrence (executeTask with buffer)
- Lines ~1301-1311: Second occurrence (executeTaskWithPackument)

Both locations now include:
```typescript
// If still no maintainers, try to use _npmUser from the latest version
// This handles packages published via GitHub OIDC or other automated publishing
if ((!Array.isArray(maintainers) || maintainers.length === 0) && latestPackageVersion?._npmUser) {
  const npmUser = latestPackageVersion._npmUser;
  if (npmUser.name && npmUser.email) {
    maintainers = [{ name: npmUser.name, email: npmUser.email }];
    logs.push(`[${isoNow()}] 📖 Use _npmUser from version ${latestPackageVersion.version} as maintainer (${npmUser.name})`);
  }
}
```

### Tests Added
Added tests in:
- `test/core/service/PackageSyncerService/executeTask.test.ts`
- `test/core/service/PackageSyncerService/executeTaskWithPackument.test.ts`

Test case: "should use _npmUser as maintainer for OIDC-published packages with empty maintainers"

The tests simulate a package published via GitHub OIDC with:
- Empty maintainers arrays
- `_npmUser: { name: "GitHub Actions", email: "npm-oidc-no-reply@github.com" }`

## Next Steps
This fix needs to be:
1. Reviewed and merged in the cnpmcore repository
2. Deployed to production cnpmcore instances (r.cnpmjs.org, registry.npmmirror.com)
3. Verified by syncing @nomicfoundation/hardhat-utils@3.0.6

## Note
This issue was filed in cnpm/cnpm (client) repository, but the actual code change is in cnpmcore (server) repository since the sync logic resides there.

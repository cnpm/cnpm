# Fix for OIDC-Published Packages Sync Issue

## Issue
[#488](https://github.com/cnpm/cnpm/issues/488) - No matching version found for @nomicfoundation/hardhat-utils@^3.0.6

## Root Cause
Packages published via GitHub OIDC authentication (such as `@nomicfoundation/hardhat-utils@3.0.6`) have empty `maintainers` arrays both at the root level and in version manifests. The sync service in cnpmcore was failing with error:
```
❌ invalid maintainers: []
```

## Solution
The fix has been implemented in the **cnpmcore** repository (the registry server), not in this client repository.

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
- Lines 690-700: First occurrence (executeTask with buffer)
- Lines 1301-1311: Second occurrence (executeTaskWithPackument)

### Tests Added
Added tests in:
- `test/core/service/PackageSyncerService/executeTask.test.ts`
- `test/core/service/PackageSyncerService/executeTaskWithPackument.test.ts`

Test case: "should use _npmUser as maintainer for OIDC-published packages with empty maintainers"

## Next Steps
This fix needs to be:
1. Reviewed and merged in the cnpmcore repository
2. Deployed to production cnpmcore instances (r.cnpmjs.org, registry.npmmirror.com)
3. Verified by syncing @nomicfoundation/hardhat-utils@3.0.6

## Note
This issue was filed in cnpm/cnpm (client) repository, but the actual code change is in cnpmcore (server) repository since the sync logic resides there.

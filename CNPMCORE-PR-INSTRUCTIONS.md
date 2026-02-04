# Instructions to Create PR in cnpmcore Repository

## Overview
The fix for issue #488 (OIDC-published packages with empty maintainers) needs to be applied to the **cnpmcore** repository. This document provides instructions to create the PR.

## Quick Start

### Option 1: Apply the Patch File (Recommended)
```bash
# Clone or navigate to cnpmcore repository
git clone https://github.com/cnpm/cnpmcore.git
cd cnpmcore

# Create a new branch
git checkout -b fix/oidc-published-packages-empty-maintainers

# Apply the patch from cnpm/cnpm repository
curl https://raw.githubusercontent.com/cnpm/cnpm/copilot/fix-version-sync-issue/cnpmcore-oidc-fix.patch | git apply

# Commit the changes
git add .
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

# Push the branch
git push -u origin fix/oidc-published-packages-empty-maintainers
```

### Option 2: Manual Changes

If you prefer to make the changes manually, see the detailed changes below.

## Changes Required

### File 1: `app/core/service/PackageSyncerService.ts`

**Location 1** - Around line 690, after the existing fallback logic for latest version maintainers:

```typescript
      } else {
        // try to use latest tag version's maintainers instead
        const latestPackageVersion = distTags.latest && versionMap[distTags.latest];
        if (latestPackageVersion && Array.isArray(latestPackageVersion.maintainers)) {
          maintainers = latestPackageVersion.maintainers as AuthorType[];
          logs.push(`[${isoNow()}] 📖 Use the latest version(${latestPackageVersion.version}) maintainers instead`);
        }
        
        // ADD THIS BLOCK:
        // If still no maintainers, try to use _npmUser from the latest version
        // This handles packages published via GitHub OIDC or other automated publishing
        if ((!Array.isArray(maintainers) || maintainers.length === 0) && latestPackageVersion?._npmUser) {
          const npmUser = latestPackageVersion._npmUser;
          if (npmUser.name && npmUser.email) {
            maintainers = [{ name: npmUser.name, email: npmUser.email }];
            logs.push(`[${isoNow()}] 📖 Use _npmUser from version ${latestPackageVersion.version} as maintainer (${npmUser.name})`);
          }
        }
      }
```

**Location 2** - Around line 1300, in the executeTaskWithPackument method (similar logic):

```typescript
      } else {
        // try to use latest tag version's maintainers instead
        const latestPackageVersion = packument.getLatestVersion();
        if (latestPackageVersion && Array.isArray(latestPackageVersion.maintainers)) {
          maintainers = latestPackageVersion.maintainers as AuthorType[];
          logs.push(`[${isoNow()}] 📖 Use the latest version(${latestPackageVersion.version}) maintainers instead`);
        }
        
        // ADD THIS BLOCK:
        // If still no maintainers, try to use _npmUser from the latest version
        // This handles packages published via GitHub OIDC or other automated publishing
        if (maintainers.length === 0 && latestPackageVersion?._npmUser) {
          const npmUser = latestPackageVersion._npmUser;
          if (npmUser.name && npmUser.email) {
            maintainers = [{ name: npmUser.name, email: npmUser.email }];
            logs.push(`[${isoNow()}] 📖 Use _npmUser from version ${latestPackageVersion.version} as maintainer (${npmUser.name})`);
          }
        }
      }
```

### File 2: `test/core/service/PackageSyncerService/executeTask.test.ts`

Add this test after the existing "should try to use latest tag version maintainers instead" test (around line 2035):

```typescript
    it('should use _npmUser as maintainer for OIDC-published packages with empty maintainers', async () => {
      // Simulate a package published via GitHub OIDC with empty maintainers
      const name = 'cnpmcore-test-oidc-published';
      app.mockHttpclient(`https://registry.npmjs.org/${name}`, 'GET', {
        data: JSON.stringify({
          _id: name,
          _rev: '1-abc123',
          name,
          'dist-tags': { latest: '1.0.0' },
          versions: {
            '1.0.0': {
              name,
              version: '1.0.0',
              description: 'Package published via GitHub OIDC',
              main: 'index.js',
              _id: `${name}@1.0.0`,
              _npmUser: {
                name: 'GitHub Actions',
                email: 'npm-oidc-no-reply@github.com',
              },
              dist: {
                integrity: 'sha512-ptVWDP7Z39wOBk5EBwi2x8/SKZblEsVcdL0jjIsaI2KdLwVpRRRnezJSKpUsXr982nGf0j7nh6RcHSg4Wlu3AA==',
                shasum: 'c73398ff6db39d138a56c04c7a90f35b70d7b78f',
                tarball: `https://registry.npmjs.org/${name}/-/${name}-1.0.0.tgz`,
              },
              maintainers: [],
            },
          },
          time: {
            created: '2026-01-19T19:16:58.391Z',
            '1.0.0': '2026-01-19T19:16:58.391Z',
            modified: '2026-01-19T19:16:58.391Z',
          },
          maintainers: [],
        }),
        persist: false,
      });
      app.mockHttpclient(
        `https://registry.npmjs.org/${name}/-/${name}-1.0.0.tgz`,
        'GET',
        {
          data: await TestUtil.readFixturesFile('registry.npmjs.org/foobar/-/foobar-1.0.0.tgz'),
          persist: false,
        },
      );
      
      await packageSyncerService.createTask(name);
      const task = await packageSyncerService.findExecuteTask();
      assert.ok(task);
      assert.equal(task.targetName, name);
      await packageSyncerService.executeTask(task);
      const stream = await packageSyncerService.findTaskLog(task);
      assert.ok(stream);
      const log = await TestUtil.readStreamToLog(stream);
      // console.log(log);
      assert.ok(log.includes('📖 Use _npmUser from version 1.0.0 as maintainer (GitHub Actions)'));
      assert.ok(log.includes('] 🔗'));
      app.mockAgent().assertNoPendingInterceptors();
    });
```

### File 3: `test/core/service/PackageSyncerService/executeTaskWithPackument.test.ts`

Add the same test as above (around line 1959).

## After Creating the PR

1. Run tests: `npm test`
2. Create PR with title: "fix: handle OIDC-published packages with empty maintainers"
3. Link to issue: cnpm/cnpm#488
4. The PR description should explain:
   - The problem (OIDC packages have empty maintainers)
   - The solution (_npmUser as fallback)
   - Testing (comprehensive test cases added)

## Files Changed
- `app/core/service/PackageSyncerService.ts`: +20 lines
- `test/core/service/PackageSyncerService/executeTask.test.ts`: +60 lines
- `test/core/service/PackageSyncerService/executeTaskWithPackument.test.ts`: +60 lines
- **Total**: 140 lines added

## Verification

After deployment, verify by syncing the problematic package:
```bash
# This should now succeed
curl -X PUT https://r.cnpmjs.org/@nomicfoundation/hardhat-utils/sync
```

The sync should succeed and show:
```
📖 Use _npmUser from version 3.0.6 as maintainer (GitHub Actions)
```

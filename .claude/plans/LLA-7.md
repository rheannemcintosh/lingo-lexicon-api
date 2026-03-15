# LLA-7: Fix Deployment for Flex Consumption (Round 2)

## Overview
The `az functionapp deploy --type zip` used in LLA-6 returns a 415 Unsupported Media Type on Flex Consumption. The fix is minimal: replace the zip + `az functionapp deploy` step with `azure/functions-action@v1` using `sku: 'flexconsumption'` and `remote-build: 'true'`, which is the supported deployment method. Also remove the `WEBSITE_RUN_FROM_PACKAGE` app setting from Azure as it is not supported on Flex Consumption and causes issues. Node.js version is also bumped from 20 to 22 (current LTS).

## What this work item covers
- Updating the deploy step in `.github/workflows/deploy.yml`
- Removing `WEBSITE_RUN_FROM_PACKAGE` from Azure app settings (Portal only, no commit)

## Dependencies
- LLA-6 must be merged (`azure/login@v2` and `AZURE_CREDENTIALS` secret in place)

## Steps

### 1. Create plan
Add the LLA-7 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-7 fix Flex Consumption deployment method

Documents the switch to azure/functions-action with Flex Consumption
sku flag, and removal of unsupported WEBSITE_RUN_FROM_PACKAGE setting.

[LLA-7]
```

---

### 2. Remove WEBSITE_RUN_FROM_PACKAGE from Azure
Azure Portal → Function App → **Settings → Environment variables** → delete `WEBSITE_RUN_FROM_PACKAGE` → Apply.

No commit — this is Portal configuration only.

---

### 3. Update deployment workflow
In `.github/workflows/deploy.yml`, replace the `Install dependencies` and `Deploy to Azure Functions` steps with:

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm install

      - uses: azure/functions-action@v1
        with:
          app-name: lingo-lexicon-api
          sku: flexconsumption
          remote-build: true
```

The `azure/login@v2` step and the rest of the workflow stays the same. The zip and `az functionapp deploy` run step is removed entirely.

**Commit message:**
```
Fix deployment to use azure/functions-action for Flex Consumption

Replaces az functionapp deploy (unsupported, returns 415) with
azure/functions-action v1 using sku and remote-build flags required
for Flex Consumption plans. Bumps Node.js from 20 to 22 (current LTS).

[LLA-7]
```

---

## Verification
- Push to `main` triggers the workflow
- `azure/functions-action` step succeeds
- Functions are accessible in the Azure Portal

## Status: Not Started

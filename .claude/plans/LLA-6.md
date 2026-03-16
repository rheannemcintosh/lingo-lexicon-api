# LLA-6: Fix GitHub Actions Deployment for Flex Consumption

## Overview

The `azure/functions-action@v1` used in LLA-5 does not support the Flex Consumption hosting plan. This replaces the publish profile approach with a Service Principal and Azure CLI deployment using `az functionapp deploy`, which is the correct method for Flex Consumption.

## What this work item covers

- Updating `.github/workflows/deploy.yml` to use `azure/login` + `az functionapp deploy`
- Removing the `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` secret (no longer needed)
- Adding the `AZURE_CREDENTIALS` secret to GitHub

## Dependencies

- LLA-5 must be merged (workflow file exists)

## Details

- **Resource group:** `rg-lingo-lexicon-api`
- **Function App name:** `lingo-lexicon-api`
- **Auth:** Service Principal stored as `AZURE_CREDENTIALS` GitHub secret

## Steps

### 1. Create plan

Add the LLA-6 plan to `.claude/plans/`.

**Commit message:**

```
Add plan for LLA-6 fix deployment for Flex Consumption

Documents the switch from azure/functions-action to Azure CLI
deployment to support the Flex Consumption hosting plan.

[LLA-6]
```

---

### 2. Create the Service Principal

Run the following in the Azure CLI, substituting your subscription ID:

```bash
az ad sp create-for-rbac \
  --name "lingo-lexicon-api-deploy" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/rg-lingo-lexicon-api \
  --json-auth
```

Copy the entire JSON output and add it as a new GitHub secret:

- **Settings → Secrets and variables → Actions → New repository secret**
- Name: `AZURE_CREDENTIALS`
- Value: the JSON output

> ⚠️ The `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` secret is no longer needed and can be deleted from GitHub.

No commit — this is configuration only.

---

### 3. Update deployment workflow

Replace the contents of `.github/workflows/deploy.yml` with:

```yaml
name: Deploy to Azure Functions

on:
    push:
        branches:
            - main

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: '20'

            - name: Install dependencies
              run: npm install

            - uses: azure/login@v2
              with:
                  creds: ${{ secrets.AZURE_CREDENTIALS }}

            - name: Deploy to Azure Functions
              run: |
                  zip -r deploy.zip . \
                    --exclude "*.git*" \
                    --exclude "local.settings.json" \
                    --exclude ".claude/*" \
                    --exclude ".vscode/*"
                  az functionapp deploy \
                    --resource-group rg-lingo-lexicon-api \
                    --name lingo-lexicon-api \
                    --src-path deploy.zip \
                    --type zip
```

**Commit message:**

```
Fix deployment workflow for Flex Consumption hosting plan

Replaces azure/functions-action with azure/login and az functionapp
deploy, which is required for Flex Consumption. Switches auth from
publish profile to Service Principal via AZURE_CREDENTIALS secret.

[LLA-6]
```

---

## Verification

- Push to `main` triggers the workflow
- `azure/login` step succeeds
- `az functionapp deploy` step succeeds
- Functions are accessible in the Azure Portal

## Status: Not Started

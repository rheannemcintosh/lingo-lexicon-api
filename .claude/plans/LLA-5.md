# LLA-5: GitHub Actions Deployment Workflow

## Overview
Creates a GitHub Actions workflow that automatically deploys the Azure Functions app to Azure on every push to `main`. Authentication uses a publish profile stored as a GitHub secret.

## What this work item covers
- Creating `.github/workflows/deploy.yml`

## Dependencies
- LLA-3 must be complete (v4 runtime configured, `src/functions/` structure in place)
- LLA-4 must be complete (`getConcept` function implemented)

## Steps

### 1. Create plan
Add the LLA-5 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-5 GitHub Actions deployment workflow

Documents the steps to create a CI/CD pipeline that deploys the
Azure Functions app to Azure on push to main.

[LLA-5]
```

---

### 2. Create deployment workflow
Create `.github/workflows/deploy.yml`:

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

      - uses: azure/functions-action@v1
        with:
          app-name: lingo-lexicon-api
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

**Commit message:**
```
Add GitHub Actions workflow to deploy Azure Functions app

Deploys to Azure on push to main using the Azure Functions action,
authenticating via the AZURE_FUNCTIONAPP_PUBLISH_PROFILE secret.

[LLA-5]
```

---

## Verification
- Workflow file exists at `.github/workflows/deploy.yml`
- Pushing to `main` triggers the workflow in the GitHub Actions tab
- Deployment succeeds once the secret is configured

## Post-implementation reminder
> ⚠️ Before the workflow will succeed, add the publish profile secret to your GitHub repository:
> **Settings → Secrets and variables → Actions → New repository secret**
> - Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
> - Value: the XML publish profile downloaded from your Function App in the Azure Portal (Function App → Overview → Get publish profile)

## Status: Not Started

# LLA-2: Scaffold Azure Functions Project

## Overview

This work item scaffolds the Azure Functions project structure in the `lingo-lexicon-api` repo using the Azure Functions Core Tools CLI.

## What this work item covers

- Scaffolding the Azure Functions project using the Azure Functions Core Tools CLI
- Adding `local.settings.json` to `.gitignore`

## Steps

### 1. Create plan

Add the LLA-2 plan to `.claude/plans/`.

**Commit message:**

```
Add plan for LLA-2 Azure Functions scaffold

Documents the steps to scaffold the Azure Functions project structure
using the Azure Functions Core Tools CLI.

[LLA-2]
```

---

### 2. Scaffold Azure Functions project and update `.gitignore`

```
func init . --worker-runtime node --language javascript
```

Generates the Azure Functions project structure in the repo root, including `host.json` and `local.settings.json`. Add `local.settings.json` and `.vscode/` to `.gitignore` immediately to prevent sensitive connection strings and editor config from being committed.

**Commit message:**

```
Scaffold Azure Functions project and update .gitignore

Initialises the Azure Functions project structure with Node.js worker
runtime and excludes local.settings.json and .vscode/ from version control.

[LLA-2]
```

---

## Verification

- `host.json` and `local.settings.json` exist in the repo root
- `local.settings.json` does not appear in `git status`

## Status: In Progress

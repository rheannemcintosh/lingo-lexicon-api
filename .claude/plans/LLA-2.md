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

### 2. Scaffold Azure Functions project
```
func init . --worker-runtime node --language javascript
```
Generates the Azure Functions project structure in the repo root, including `host.json` and `local.settings.json`.

**Commit message:**
```
Scaffold Azure Functions project

Initialises the Azure Functions project structure with Node.js worker
runtime using func init.

[LLA-2]
```

---

### 3. Add `local.settings.json` to `.gitignore`
`local.settings.json` contains sensitive connection strings and must not be committed.

Add to `.gitignore`:
```
local.settings.json
```

**Commit message:**
```
Add local.settings.json to .gitignore

Prevents sensitive Azure connection strings stored in local.settings.json
from being committed to version control.

[LLA-2]
```

---

## Verification
- `host.json` and `local.settings.json` exist in the repo root
- `local.settings.json` does not appear in `git status`

## Status: In Progress

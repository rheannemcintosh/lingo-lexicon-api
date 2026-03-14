# LLA-1: App Initialisation

## Overview
`lingo-lexicon-api` is a REST API that takes a concept or term (e.g. "PHP") and returns two explanations:
- **Professional** — a concise, technical definition
- **ELI5 (Explain Like I'm 5)** — a simple, plain-English explanation

The API is built on Azure Functions and uses an LLM to generate the explanations. Azure Table Storage is used to cache results so repeated lookups for the same term avoid unnecessary LLM calls.

## What this work item covers
This work item sets up the Node.js project from scratch — initialising npm, installing the core dependencies, and adding a `.gitignore`.

## Dependencies

### `@azure/data-tables`
The official Azure SDK client for Azure Table Storage. Used to read and write cached term explanations, so the API can return results without calling the LLM every time the same term is requested.

### `node-fetch`
A lightweight `fetch` implementation for Node.js. Used to make HTTP requests to the LLM API to generate the professional and ELI5 explanations.

## Steps

### 1. Create plan
Add the LLA-1 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-1 app initialisation

Documents the project overview, dependencies, and steps required to
initialise the lingo-lexicon-api Node.js project.

[LLA-1]
```

### 2. Initialise npm
```
npm init -y
```
Generates a `package.json` with default values in the repo root.

**Commit message:**
```
Initialise npm project

Adds package.json with default values to set up the Node.js project
structure for lingo-lexicon-api.

[LLA-1]
```

### 3. Install dependencies
```
npm install @azure/data-tables node-fetch
```

**Commit message:**
```
Install core dependencies

Adds @azure/data-tables for Azure Table Storage access and node-fetch
for making HTTP requests to the LLM API.

[LLA-1]
```

### 4. Create `.gitignore`
```
node_modules/
.env
.DS_Store
*.log
dist/
```

**Commit message:**
```
Add .gitignore

Excludes node_modules, environment files, OS files, logs, and build
output from version control.

[LLA-1]
```

## Verification
- `package.json` lists `@azure/data-tables` and `node-fetch` under `dependencies`
- `node_modules/` exists with both packages installed
- `.gitignore` is present and excludes `node_modules/`

## Status: Complete ✓

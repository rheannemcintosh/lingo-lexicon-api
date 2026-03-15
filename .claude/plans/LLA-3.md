# LLA-3: Build GET /api/concepts Endpoint

## Overview
This work item implements the first endpoint: `GET /api/concepts`. It queries Azure Table Storage and returns a JSON array of all stored term names (e.g. `["PHP", "Laravel", "CAP Theorem"]`).

No LLM call is needed for this endpoint — it is a straight read from Table Storage.

## What this work item covers
- Creating the `GetConcepts` HTTP trigger function scaffold
- Adding a shared Table Storage client module
- Configuring the `GetConcepts` function bindings and route
- Implementing the `GetConcepts` handler
- Creating `local.settings.json` for local development (not committed)

## Dependencies
- LLA-2 must be complete (Azure Functions project scaffolded)

## Steps

### 1. Create plan
Add the LLA-3 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-3 GET /api/concepts endpoint

Documents the steps to implement the GetConcepts endpoint using Azure Table
Storage and a shared table client.

[LLA-3]
```

---

### 2. Create GetConcepts HTTP trigger
```
func new --name GetConcepts --template "HTTP trigger"
```
Scaffolds a new HTTP-triggered function under `GetConcepts/`, creating `index.js` and `function.json`.

**Commit message:**
```
Add GetConcepts HTTP trigger function scaffold

Creates the GetConcepts Azure Function using the HTTP trigger template,
ready to be configured for the GET /api/concepts route.

[LLA-3]
```

---

### 3. Create shared Table Storage client
Create `shared/tableClient.js`:
```js
const { TableClient } = require("@azure/data-tables");

const client = TableClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING,
  "concepts"
);

module.exports = client;
```
Provides a single reusable Table Storage client instance, connecting to the `concepts` table using the connection string from environment variables.

**Commit message:**
```
Add shared Azure Table Storage client

Creates a reusable TableClient instance connected to the concepts table,
using the STORAGE_CONNECTION_STRING environment variable.

[LLA-3]
```

---

### 4. Configure GetConcepts function bindings
Replace `GetConcepts/function.json` with:
```json
{
  "bindings": [{
    "authLevel": "function",
    "type": "httpTrigger",
    "direction": "in",
    "name": "req",
    "methods": ["get"],
    "route": "concepts"
  }, {
    "type": "http",
    "direction": "out",
    "name": "res"
  }]
}
```
Configures the function to handle `GET /api/concepts` with function-level auth.

**Commit message:**
```
Configure GetConcepts function bindings for GET /api/concepts

Sets the HTTP trigger route to concepts, restricts to GET method, and
configures function-level authorisation.

[LLA-3]
```

---

### 5. Implement GetConcepts handler
Replace `GetConcepts/index.js` with:
```js
const client = require("../shared/tableClient");

module.exports = async function (context, req) {
  const entities = client.listEntities();
  const concepts = [];
  for await (const entity of entities) {
    concepts.push(entity.rowKey);
  }
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(concepts)
  };
};
```
Iterates over all entities in the `concepts` table and returns their `rowKey` values as a JSON array.

**Commit message:**
```
Implement GET /api/concepts endpoint

Queries all entities from Azure Table Storage and returns term names
as a JSON array using the shared table client.

[LLA-3]
```

---

### 6. Create `local.settings.json`
Create `local.settings.json` in the repo root (not committed):
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "YOUR_STORAGE_CONNECTION_STRING",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "STORAGE_CONNECTION_STRING": "YOUR_STORAGE_CONNECTION_STRING"
  }
}
```
> ⚠️ Replace `YOUR_STORAGE_CONNECTION_STRING` with your actual connection string from Azure before running `func start`.

No commit — this file is excluded by `.gitignore`.

---

### 7. Fix runtime compatibility issues
Several issues were encountered when running `func start` for the first time:

- `func init` with Core Tools v4 scaffolded a v4 programming model (`src/functions/`) but `func new` generated a v3-style function (`GetConcepts/index.js` + `function.json`). These are incompatible — the v3 folder was removed and the handler was rewritten as `src/functions/getConcepts.js` using the v4 `app.http()` style.
- The extension bundle in `host.json` was set to `[1.*, 2.0.0)`, which was too old. Upgraded to `[4.*, 5.0.0)`.
- `@azure/functions` v4 package was installed and `package.json` `main` updated to `src/functions/*.js`.

**Commit message:**
```
Fix Azure Functions v4 runtime compatibility issues

Rewrites GetConcepts using the v4 programming model, upgrades the
extension bundle to v4, and installs the @azure/functions package.

[LLA-3]
```

---

## Verification
- `func start` runs without errors
- `GET http://localhost:7071/api/concepts` returns a JSON array
- `local.settings.json` does not appear in `git status`
- `shared/tableClient.js` exists and exports a `TableClient` instance

## Status: Not Started

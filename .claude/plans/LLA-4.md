# LLA-4: Build GET /api/concepts/{concept} Endpoint

## Overview

Implements the `GET /api/concepts/{concept}` endpoint as an Azure Function called `getConcept`. The function checks Azure Table Storage for a cached result first. On a cache hit it returns immediately. On a cache miss it calls the OpenAI API to generate two explanations — one professional, one in plain language — saves both to Table Storage, then returns them. All responses include a `cached` boolean flag.

## What this work item covers

- Installing the `openai` npm package
- Creating `src/functions/getConcept.js` using the v4 `app.http()` programming model
- Adding `OPENAI_API_KEY` placeholder to `local.settings.json`

## Dependencies

- LLA-3 must be complete (`shared/tableClient.js` exists and the v4 runtime is configured)

## Table Storage schema

- **Table:** `concepts` (reuses the existing table and shared client)
- **partitionKey:** `"concept"` (static — all terms share one partition)
- **rowKey:** the term string as provided in the URL (e.g. `"PHP"`, `"CAP Theorem"`)
- **Properties:** `professional` (string), `plain` (string)

## Steps

### 1. Create plan

Add the LLA-4 plan to `.claude/plans/`.

**Commit message:**

```
Add plan for LLA-4 GET /api/concepts/{concept} endpoint

Documents the steps to implement the getConcept function with
Table Storage caching and OpenAI-generated explanations.

[LLA-4]
```

---

### 2. Install openai package

```
npm install openai
```

Installs the latest stable OpenAI Node.js SDK. Updates `package.json` and `package-lock.json`.

**Commit message:**

```
Install openai npm package

Adds the OpenAI SDK as a dependency for generating concept
explanations via the chat completions API.

[LLA-4]
```

---

### 3. Create getConcept function

Create `src/functions/getConcept.js`:

```js
const { app } = require('@azure/functions');
const OpenAI = require('openai');
const tableClient = require('../../shared/tableClient');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.http('getConcept', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'concepts/{concept}',
    handler: async (request, context) => {
        const concept = request.params.concept;

        try {
            const entity = await tableClient.getEntity('concept', concept);
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    concept,
                    professional: entity.professional,
                    plain: entity.plain,
                    cached: true,
                }),
            };
        } catch (err) {
            if (err.statusCode !== 404) throw err;
        }

        const [professionalRes, plainRes] = await Promise.all([
            openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a technical expert. Explain the following term professionally and concisely in 2-3 sentences.',
                    },
                    { role: 'user', content: concept },
                ],
            }),
            openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content:
                            'Explain the following term in plain, simple language that anyone can understand. Use 2-3 sentences.',
                    },
                    { role: 'user', content: concept },
                ],
            }),
        ]);

        const professional = professionalRes.choices[0].message.content;
        const plain = plainRes.choices[0].message.content;

        await tableClient.upsertEntity({
            partitionKey: 'concept',
            rowKey: concept,
            professional,
            plain,
        });

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                concept,
                professional,
                plain,
                cached: false,
            }),
        };
    },
});
```

**Commit message:**

```
Add getConcept function for GET /api/concepts/{concept}

Checks Table Storage for a cached result and returns it immediately
if found. On a cache miss, calls the OpenAI chat completions API in
parallel to generate professional and plain-language explanations,
saves both to Table Storage, then returns them. All responses include
a cached flag.

[LLA-4]
```

---

### 4. Add OPENAI_API_KEY to local.settings.json

Add the `OPENAI_API_KEY` key to the `Values` object in `local.settings.json`:

```json
"OPENAI_API_KEY": "YOUR_OPENAI_API_KEY"
```

> ⚠️ Replace `YOUR_OPENAI_API_KEY` with your actual key from the OpenAI platform before running `func start`.

No commit — `local.settings.json` is excluded by `.gitignore`.

---

## Verification

- `func start` runs without errors and registers both `getConcepts` and `getConcept`
- First call to `GET http://localhost:7071/api/concepts/PHP` hits OpenAI, saves to Table Storage, returns `cached: false`
- Second call to `GET http://localhost:7071/api/concepts/PHP` reads from Table Storage, returns `cached: true`
- Response shape: `{ concept, professional, plain, cached }`
- `OPENAI_API_KEY` is set in `local.settings.json` before testing

## Status: Not Started

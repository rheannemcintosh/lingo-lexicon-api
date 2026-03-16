# LLA-8: Create README

## Overview
Writes a comprehensive, portfolio-quality README for the project.

## What this work item covers
- Creating architecture SVG diagrams in `docs/`
- Creating `local.settings.json.example`
- Replacing the placeholder `README.md` with a full README

## Steps

### 1. Create plan
Add the LLA-8 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-8 README

Documents the steps to create the project README.

[LLA-8]
```

---

### 2. Create architecture SVG diagram
Create `docs/lingo-lexicon-api-architecture-diagram.svg` showing the full function app architecture.

**Commit message:**
```
Add architecture SVG diagram

Creates an overview diagram of the function app architecture.

[LLA-8]
```

---

### 3. Create local.settings.json.example
Create `local.settings.json.example` with angle bracket placeholders for all required environment variables.

**Commit message:**
```
Add local.settings.json.example

Provides a template for local development configuration.

[LLA-8]
```

---

### 4. Write README
Replace `README.md` with sections covering: title, header badges, overview, architecture, API endpoints, tech stack, local development, environment variables, deployment, and tools & technologies badges.

**Commit message:**
```
Add README with project overview, architecture and API docs

Covers overview, architecture, API endpoints, tech stack, local
development setup, environment variables and deployment.

[LLA-8]
```

---

## Verification
- README renders correctly on GitHub
- All badges display with correct colours
- Architecture diagram renders
- `local.settings.json.example` is committed and `local.settings.json` is not

## Status: Complete

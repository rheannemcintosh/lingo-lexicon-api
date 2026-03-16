# LLA-9: Install Prettier and Format Code

## Overview
Installs Prettier as a dev dependency, adds a configuration file, and formats all JavaScript and JSON files in the project.

## What this work item covers
- Installing Prettier
- Adding a `.prettierrc` configuration file
- Formatting all `.js` and `.json` files

## Steps

### 1. Create plan
Add the LLA-9 plan to `.claude/plans/`.

**Commit message:**
```
Add plan for LLA-9 install Prettier and format code

Documents the steps to install Prettier and format all JavaScript
and JSON files in the project.

[LLA-9]
```

---

### 2. Install Prettier
```bash
npm install --save-dev prettier
```

**Commit message:**
```
Install Prettier as a dev dependency

Adds Prettier to dev dependencies for consistent code formatting
across JavaScript and JSON files.

[LLA-9]
```

---

### 3. Add .prettierrc
Create `.prettierrc`:

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Commit message:**
```
Add Prettier configuration

Configures Prettier with single quotes, semicolons, 2-space
indentation, and ES5 trailing commas.

[LLA-9]
```

---

### 4. Format all files
Run Prettier across the project:

```bash
npx prettier --write .
```

**Commit message:**
```
Format all JavaScript and JSON files with Prettier

Applies Prettier formatting consistently across all JS and JSON
files in the project.

[LLA-9]
```

---

## Verification
- `npx prettier --check .` passes with no issues
- Formatted files look correct

## Status: Not Started

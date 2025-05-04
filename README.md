### Change **`package.json`** and/or **`turbo.json`** scripts

### Change and/or add your own directories in `pnpm-workspace.yaml`

### `package.json`
```json
{
  "name": "fullstack-example", // <-- Rename your own project
  "private": true,
  "version": "0.0.1", // <-- Change version for your own project
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
    // <-- Add your own scripts
  },
  "license": "MIT",
  "packageManager": "pnpm@10.10.0", // <-- Change version for your own package manager
  "devDependencies": {
    "@s-ui/mono": "2.45.0",
    "turbo": "2.5.2"
  }
}

```

### `turbo.json`
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
    // <-- Add your own scripts that you want to run in-parallel
  }
}
```

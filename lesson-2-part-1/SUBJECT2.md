# Subject 2: Frontend CI Pipeline

In this exercise, you will create a GitHub Actions workflow to check code quality on the frontend. This time, with less guidance - use your knowledge of JavaScript/TypeScript tooling and the documentation.

**Learning Objectives:**
- Set up Prettier (code formatter)
- Create a CI pipeline for a Node.js project
- Read documentation to find solutions

---

## Part A: Setting Up Prettier

The frontend needs a code formatter. **Prettier** is the standard for JavaScript/TypeScript projects.

### Your tasks:

1. **Install Prettier** as a dev dependency in `frontend/`
2. **Create a configuration file** (`.prettierrc`) with your preferred settings
3. **Add npm scripts** to `package.json`:
   - `format:check` - Check if files are formatted (for CI)
   - `format` - Auto-format files (for development)

### Resources

- Prettier documentation: https://prettier.io/docs/en/configuration.html
- Common options to consider: `semi`, `singleQuote`, `tabWidth`, `printWidth`

### Validation

```bash
cd frontend

# This should report which files need formatting (or exit 0 if all good):
npm run format:check

# This should format all files:
npm run format
```

---

## Part B: Creating the CI Workflow

Create `.github/workflows/frontend-ci.yml` to run on Pull Requests.

Your workflow should:
1. Trigger on pull requests to `main` when `frontend/**` files change
2. Check code formatting with Prettier
3. Run ESLint (`npm run lint`)
4. Run tests (`npm test`)

### Skeleton

```yaml
name: Frontend CI

on:
  # TODO: Configure trigger
  # - Pull requests to main branch
  # - Only when frontend/ files change

jobs:
  quality:
    # TODO: Configure the job
    # - What runner? (ubuntu-latest)
    # - What working directory? (frontend/)

    steps:
      # TODO: Add steps for:
      # 1. Checkout code
      # 2. Set up Node.js (version 20, with npm caching)
      # 3. Install dependencies (npm ci)
      # 4. Check formatting
      # 5. Run linter
      # 6. Run tests
```

### Useful Actions

Search the GitHub Marketplace or documentation for:
- `actions/checkout`
- `actions/setup-node`

---

## Validation

### Local validation

Before pushing, verify everything works locally:

```bash
cd frontend
npm run format:check
npm run lint
npm test
```

### CI validation

1. Create a new branch: `git checkout -b feature/frontend-ci`
2. Commit your changes
3. Push and create a Pull Request
4. Check the "Actions" tab

### Test that CI catches problems

1. Break the formatting (e.g., inconsistent quotes)
2. Push and verify CI fails
3. Fix with `npm run format`
4. Push and verify CI passes

---

## Hints

<details>
<summary>Hint: Prettier npm scripts</summary>

The Prettier CLI has different modes:
- `prettier --check .` - Check files, exit with error if unformatted
- `prettier --write .` - Format files in place

You may need to specify which files to check with a glob pattern.

</details>

<details>
<summary>Hint: Setting working directory in GitHub Actions</summary>

You can set a default working directory for all steps in a job:

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: some-folder
```

</details>

<details>
<summary>Hint: Node.js caching</summary>

The `setup-node` action supports caching. Check the action's documentation for the `cache` parameter.

</details>

<details>
<summary>Hint: Trigger with path filter</summary>

```yaml
on:
  pull_request:
    branches: [main]
    paths:
      - 'some-folder/**'
```

</details>

---

## Going Further

Once your basic CI is working:

- Add a build step (`npm run build`) to verify the production build works
- Explore running frontend and backend CI in parallel
- Set up branch protection rules requiring CI to pass before merge

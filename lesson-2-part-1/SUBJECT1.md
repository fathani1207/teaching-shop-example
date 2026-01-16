# Subject 1: Backend CI Pipeline

In this exercise, you will create a GitHub Actions workflow to automatically check code quality on the backend whenever a Pull Request is opened.

**Learning Objectives:**
- Understand how GitHub Actions workflows are structured
- Set up a Python linter and formatter (Ruff)
- Create a CI pipeline that runs on every PR

---

## Part A: Understanding GitHub Actions

GitHub Actions automates tasks in your repository. The core concepts are:

```
Workflow (.yml file)
    └── Jobs (run in parallel by default)
           └── Steps (run sequentially)
```

- **Workflow**: Defined in `.github/workflows/*.yml`
- **Trigger**: When the workflow runs (e.g., on pull requests)
- **Job**: A set of steps that run on the same machine
- **Step**: A single task (run a command or use an action)

**Example structure:**
```yaml
name: My Workflow          # Display name

on:                        # Trigger
  pull_request:
    branches: [main]

jobs:
  my-job:                  # Job ID
    runs-on: ubuntu-latest # Machine type

    steps:
      - uses: actions/checkout@v4    # Use a pre-built action
      - run: echo "Hello World"      # Run a shell command
```

---

## Part B: Setting Up Ruff

Before we can check code quality in CI, we need a tool to check it. **Ruff** is a modern Python linter and formatter - it replaces multiple tools (flake8, black, isort) with one fast tool.

### Step 1: Add Ruff as a dependency

Edit `backend/pyproject.toml` to add a dev dependency section:

```toml
[project]
name = "api"
version = "0.1.0"
# ... existing content ...

[project.optional-dependencies]
dev = [
    "ruff>=0.8.0",
]
```

Then install it:
```bash
cd backend
uv sync --extra dev
```

### Step 2: Create Ruff configuration

Create `backend/ruff.toml` with this configuration:

```toml
# Ruff configuration for the backend
line-length = 120
target-version = "py311"

[lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort (import sorting)
    "B",    # flake8-bugbear
    "UP",   # pyupgrade
]
ignore = [
    "E501",  # line too long (handled by formatter)
]

[format]
quote-style = "double"
indent-style = "space"
```

### Step 3: Verify Ruff works locally

```bash
cd backend

# Check for linting errors
uv run ruff check .

# Check formatting (without modifying files)
uv run ruff format --check .

# To auto-fix issues:
uv run ruff check --fix .
uv run ruff format .
```

---

## Part C: Creating the CI Workflow

Now create the GitHub Actions workflow. Create a new file at `.github/workflows/backend-ci.yml`.

Below is a skeleton - **complete the TODOs** to make it work:

```yaml
name: Backend CI

on:
  pull_request:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  quality:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      # TODO 1: Install uv (the Python package manager)
      # Hint: Look for an action called "astral-sh/setup-uv"
      # Syntax: - uses: action-name@version


      - name: Install dependencies
        run: uv sync --extra dev

      # TODO 2: Add a step to check code formatting with Ruff
      # Step name: "Check formatting"
      # Command: uv run ruff format --check .


      # TODO 3: Add a step to run the Ruff linter
      # Step name: "Run linter"
      # Command: uv run ruff check .


      - name: Run tests
        run: |
          cd core
          uv run python manage.py migrate
          uv run python manage.py test
```

---

## Validation

### Local validation

Before pushing, verify everything works locally:

```bash
cd backend

# These commands should succeed:
uv run ruff format --check .
uv run ruff check .
cd core && uv run python manage.py test
```

### CI validation

1. Create a new branch: `git checkout -b feature/backend-ci`
2. Commit your changes (ruff.toml, pyproject.toml, workflow file)
3. Push and create a Pull Request
4. Check the "Actions" tab - your workflow should run

### Test that CI catches problems

To verify CI is working correctly:

1. Introduce a linting error (e.g., add an unused import)
2. Push the change
3. Verify the CI fails
4. Fix the error and push again
5. Verify CI passes

---

## Hints

<details>
<summary>Hint for TODO 1 (Install uv)</summary>

GitHub Actions can use pre-built actions. The astral-sh organization publishes an action for uv:

```yaml
- uses: astral-sh/setup-uv@v4
```

</details>

<details>
<summary>Hint for TODO 2 (Format check)</summary>

A step needs a `name` and either `run` (for commands) or `uses` (for actions):

```yaml
- name: Step Name Here
  run: your-command-here
```

</details>

<details>
<summary>Hint for TODO 3 (Linter)</summary>

Same structure as TODO 2, but with the linter command instead of the format command.

</details>

---

## Going Further

Once your basic CI is working, consider these improvements:

- Add a code coverage report
- Cache dependencies for faster builds
- Add a step to verify the Django project has no missing migrations

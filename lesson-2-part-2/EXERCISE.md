# Exercise: Testing in CI/CD

In this exercise, you will write tests at three different levels (unit, integration, E2E) and add them to your CI/CD pipeline. The goal is to understand how different test types fit into a CI workflow.

**Learning Objectives:**
- Understand the difference between unit, integration, and E2E tests
- Write tests that run in CI/CD pipelines
- See how tests catch bugs automatically on every PR

---

## Part 1: Unit Tests

Unit tests verify that individual pieces of code work correctly in isolation.

### Step 1.1: Write the Unit Tests

Copy `scaffolds/test_unit.py` to `backend/core/api/tests/test_unit.py` and complete the TODOs.

The scaffold provides the test structure. You need to fill in the assertions.

**Hints:**
- Use `self.assertEqual(actual, expected)` to compare values
- Use `self.assertGreaterEqual(len(list), 1)` to check list has items
- The `status` module has constants like `status.HTTP_200_OK`

### Step 1.2: Run Tests Locally

```bash
cd backend/core
uv run python manage.py test api.tests.test_unit
```

All tests should pass before moving on.

### Step 1.3: Create the CI Workflow

Create a new file `.github/workflows/backend-tests.yml`:

```yaml
name: Backend Tests

on:
  pull_request:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - uses: astral-sh/setup-uv@v4

      - name: Install dependencies
        run: uv sync

      # TODO: Add a step to run unit tests
      # Command: cd core && uv run python manage.py test api.tests.test_unit
```

### Step 1.4: Validate in CI

1. Create a branch: `git checkout -b chore/unit-tests`
2. Commit and push your changes
3. Create a Pull Request
4. Check the Actions tab - tests should run and pass

---

## Part 2: Integration Tests

Integration tests verify that multiple components work together correctly.

### Step 2.1: Write the Integration Tests

Copy `scaffolds/test_integration.py` to `backend/core/api/tests/test_integration.py` and complete the TODOs.

This test simulates a complete user flow:
1. User registers
2. User gets list of products
3. User creates an order

### Step 2.2: Run Tests Locally

```bash
cd backend/core
uv run python manage.py test api.tests.test_integration
```

### Step 2.3: Add to CI Workflow

Update `.github/workflows/backend-tests.yml` to also run integration tests:

```yaml
      - name: Run unit tests
        run: cd core && uv run python manage.py test api.tests.test_unit

      # TODO: Add a step to run integration tests
      # Similar to unit tests but with test_integration
```

### Step 2.4: Validate in CI

Push your changes and verify both unit and integration tests run in CI.

---

## Part 3: E2E Tests (End-to-End)

E2E tests verify the entire application works from the user's perspective, using a real browser.

### Step 3.1: Set Up Playwright

```bash
cd frontend
npm install -D @playwright/test
npx playwright install chromium
```

Copy `scaffolds/playwright.config.ts` to `frontend/playwright.config.ts`.

### Step 3.2: Write the E2E Test

Copy `scaffolds/checkout.spec.ts` to `frontend/e2e/checkout.spec.ts` and complete the TODOs.

This test uses a real browser to:
1. Navigate to the home page
2. Click on a product
3. Complete the checkout flow
4. Verify the order was created

### Step 3.3: Run E2E Tests Locally

You need **3 terminals**:

**Terminal 1 - Backend:**
```bash
cd backend/core
uv run python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev -- --port 8080
```

**Terminal 3 - Tests:**
```bash
cd frontend
npx playwright test
```

### Step 3.4: Create E2E CI Workflow

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'backend/**'

jobs:
  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # TODO: Set up Python and install backend dependencies

      # TODO: Set up Node.js and install frontend dependencies

      # TODO: Start backend server in background
      # Hint: Use & at the end of the command to run in background

      # TODO: Build and serve frontend
      # Commands: npm run build && npm run preview &

      # TODO: Install Playwright browsers
      # Command: npx playwright install chromium

      # TODO: Run E2E tests
      # Command: npx playwright test
```

**Hint:** You may need to add a `sleep` or wait for servers to be ready before running tests.

### Step 3.5: Validate in CI

Push your changes and verify E2E tests run in the Actions tab.

---

## Verification Checklist

- [ ] Unit tests pass locally
- [ ] Unit tests run in CI
- [ ] Integration tests pass locally
- [ ] Integration tests run in CI
- [ ] E2E tests pass locally (with both servers running)
- [ ] E2E tests run in CI

## Going Further

- Add more test cases to cover edge cases
- Try breaking a test and watch CI fail
- Explore test coverage reports
- Add tests for the admin functionality

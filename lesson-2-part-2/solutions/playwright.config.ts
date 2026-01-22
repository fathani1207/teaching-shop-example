import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - SOLUTION
 *
 * Complete configuration ready for CI.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // For CI: automatically start servers
  webServer: process.env.CI
    ? [
        {
          command: 'cd ../backend && uv sync && cd core && uv run python manage.py migrate && uv run python manage.py runserver',
          url: 'http://localhost:8000/api/products/',
          timeout: 120000,
          reuseExistingServer: false,
        },
        {
          command: 'npm run build && npm run preview -- --port 8080',
          url: 'http://localhost:8080',
          timeout: 120000,
          reuseExistingServer: false,
        },
      ]
    : undefined,
});

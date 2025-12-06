import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for CRAM visual regression testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000, // 3 minutes for webpack to build
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Output directory for test artifacts */
  outputDir: 'e2e/test-results',

  /* Timeout for each test */
  timeout: 60000,

  /* Snapshot and assertion configuration */
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      /* Maximum allowed difference in pixels */
      maxDiffPixels: 100,
      /* Threshold for pixel comparison (0-1, where 1 means any difference is acceptable) */
      threshold: 0.2,
      /* Animation threshold - higher tolerance for animated elements */
      animations: 'disabled',
    },
    toMatchSnapshot: {
      /* Maximum allowed difference ratio (0-1) */
      maxDiffPixelRatio: 0.01,
    },
  },
});

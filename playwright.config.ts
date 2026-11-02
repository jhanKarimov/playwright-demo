import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
// Locally: use the installed Google Chrome (no browser download). CI sets PW_USE_BUNDLED_CHROMIUM=1.
const channel = process.env.PW_USE_BUNDLED_CHROMIUM ? undefined : 'chrome';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  // Be polite to a real site: one worker, no hammering.
  workers: 1,
  forbidOnly: isCI,
  // Flaky hygiene: retry only in CI, and capture a trace on the first retry
  // so a flake leaves evidence instead of a shrug.
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://soz6.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off', // video needs an ffmpeg download; traces + screenshots suffice
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    extraHTTPHeaders: { 'User-Agent': 'jhan-playwright-demo/1.0 (portfolio test run)' },
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1366, height: 800 } },
    },
    {
      // Mobile emulation on Chrome; viewport/touch only, no extra browser download.
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], channel },
      testMatch: /responsive\.spec\.ts/,
    },
  ],
});

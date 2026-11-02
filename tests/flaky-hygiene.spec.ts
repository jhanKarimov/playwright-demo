import { test, expect } from '../fixtures';

/**
 * Two small examples of flaky-test hygiene. See README "Flaky-test hygiene".
 */
test.describe('flaky-test hygiene', () => {
  test('async content: web-first assertion + poll instead of sleep()', async ({ newsPage }) => {
    await newsPage.goto();
    // BAD:  await page.waitForTimeout(3000); expect(count).toBeGreaterThan(0)
    // GOOD: poll the condition; it passes the moment it is true and fails with a clear message.
    await expect.poll(async () => (await newsPage.articleHrefs()).length, { timeout: 15_000 })
      .toBeGreaterThan(0);
  });

  test('network wait is tied to the actual event, not a timer', async ({ page }) => {
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/xeber') && r.request().method() === 'GET');
    await page.goto('/xeber');
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
    // Locator auto-waits + retries; no manual visibility polling.
    await expect(page.locator('#mainSearch')).toBeAttached();
  });
});

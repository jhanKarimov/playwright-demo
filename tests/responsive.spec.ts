import { test, expect } from '../fixtures';

// Runs in the mobile-chrome project (Pixel 7 emulation) and the desktop one for comparison.
test.describe('responsive', () => {
  test('home has a viewport meta tag and no horizontal scroll', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
    await expect(homePage.heading).toBeAttached();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    // Allow a few px of slack; flag anything bigger.
    expect.soft(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(8);
  });

  test('viewport size matches the project (mobile is narrower than desktop)', async ({ homePage, page }, info) => {
    await homePage.goto();
    const width = await page.evaluate(() => window.innerWidth);
    if (info.project.name.startsWith('mobile')) expect(width).toBeLessThan(500);
    else expect(width).toBeGreaterThan(1000);
  });
});

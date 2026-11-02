import { test, expect } from '../fixtures';

test.describe('quality budgets', () => {
  test('home page stays inside the console-error budget', async ({ homePage, consoleErrors, page }) => {
    await homePage.goto();
    await expect(homePage.heading).toBeAttached();
    await page.waitForLoadState('load');
    // Budget, not zero: third-party widgets/ads can be noisy. Tighten over time.
    // Baseline measured 2026-11-02 was 9 (real findings: jQuery/Quill load order, duplicate
    // 'leftFrame' declaration, a few 404s). Budget is a ratchet: lower it as the site gets fixed.
    const BUDGET = 10;
    test.info().annotations.push({ type: 'console-errors', description: JSON.stringify(consoleErrors) });
    expect(consoleErrors.length, consoleErrors.join('\n')).toBeLessThanOrEqual(BUDGET);
  });

  test('a11y smoke on home (violations reported as annotation + attachment, not fatal)', async ({ homePage, page }) => {
    const { default: AxeBuilder } = await import('@axe-core/playwright');
    await homePage.goto();
    await expect(homePage.heading).toBeAttached();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const summary = results.violations.map(v => `${v.id} (${v.impact}) x${v.nodes.length}`);
    test.info().annotations.push({ type: 'a11y-violations', description: summary.join('; ') || 'none' });
    await test.info().attach('axe-violations.json', {
      body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
    // Hard check only that axe actually ran; violations are findings, not failures.
    expect(results.passes.length).toBeGreaterThan(0);
  });

  test('main pages send sane response headers', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/html');
  });
});

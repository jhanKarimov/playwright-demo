import { test, expect } from '../fixtures';

// Authorization checks as an ANONYMOUS user. Read-only GETs, redirects NOT followed,
// so we assert on the actual response the server gives, not where the browser ends up.
test.describe('anonymous access to private areas', () => {
  for (const path of ['/charts/', '/projects-map/']) {
    test(`${path} redirects anonymous users to the login page (302)`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status()).toBe(302);
      expect(res.headers()['location']).toMatch(/giris\.php$/);
      // No private content should leak in the redirect body.
      expect((await res.text()).toLowerCase()).not.toContain('"positions"');
    });
  }

  test('/charts/api.php returns 403 JSON for anonymous callers', async ({ request }) => {
    const res = await request.get('/charts/api.php', { maxRedirects: 0 });
    expect(res.status()).toBe(403);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(res.headers()['x-robots-tag']).toContain('noindex');
    expect(() => JSON.stringify(res.json())).not.toThrow();
  });

  test('following the redirect from a private path lands on the login form', async ({ page, loginPage }) => {
    await page.goto('/projects-map/');
    await expect(page).toHaveURL(/giris\.php$/);
    await expect(loginPage.loginForm).toBeAttached();
  });
});

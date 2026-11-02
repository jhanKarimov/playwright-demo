import { test, expect } from '../fixtures';

test.describe('news list', () => {
  test('renders a list of articles with valid SEO tags', async ({ newsPage, page }) => {
    const res = await newsPage.goto();
    expect(res.status()).toBe(200);
    await newsPage.expectSeoBasics();
    // Web-first: poll until client-side rendering has produced article links.
    await expect.poll(async () => (await newsPage.articleHrefs()).length, {
      message: 'expected the news feed to render at least 3 article links',
    }).toBeGreaterThanOrEqual(3);
    await expect(page.locator('#mainSearch')).toBeAttached();
  });

  test('article links resolve (HEAD-style check on first 3, no browser navigation)', async ({ newsPage, page, request }) => {
    await newsPage.goto();
    await expect.poll(async () => (await newsPage.articleHrefs()).length).toBeGreaterThanOrEqual(3);
    const hrefs = (await newsPage.articleHrefs()).slice(0, 3);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), `${href} should resolve`).toBe(200);
    }
  });
});

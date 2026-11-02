import { test, expect } from '../fixtures';

test.describe('topic page', () => {
  test('has heading, title, description, canonical and Open Graph tags', async ({ topicPage, page }) => {
    const res = await topicPage.goto();
    expect(res.status()).toBe(200);
    await expect(topicPage.heading).toBeVisible();
    await expect(page).toHaveTitle(/izahı, nümunələr və yazılar/);
    await topicPage.expectSeoBasics();
    await expect(topicPage.canonical).toHaveAttribute('href', 'https://soz6.com/nedir/17997/abituriyent');
    await expect(topicPage.ogTitle).toHaveAttribute('content', /.+/);
  });

  test('unknown topic id does not return a 5xx', async ({ request }) => {
    const res = await request.get('/nedir/99999999/this-does-not-exist', { maxRedirects: 0 });
    expect(res.status()).toBeLessThan(500);
  });
});

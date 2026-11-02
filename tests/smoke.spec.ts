import { test, expect } from '../fixtures';

test.describe('smoke', () => {
  test('home loads with 200, title and search form', async ({ homePage, page }) => {
    const res = await homePage.goto();
    expect(res.status()).toBe(200);
    await expect(page).toHaveTitle(/Sözaltı Sözlük/);
    await expect(homePage.heading).toBeAttached();
    await expect(homePage.searchForm).toBeAttached();
  });

  test('home links to topics and to the news section', async ({ homePage }) => {
    await homePage.goto();
    expect(await homePage.topicLinks.count()).toBeGreaterThan(3);
    await expect(homePage.newsLink).toBeAttached();
  });

  test('login page shows the form (never submitted)', async ({ loginPage }) => {
    const res = await loginPage.goto();
    expect(res.status()).toBe(200);
    await expect(loginPage.loginForm).toBeAttached();
    await expect(loginPage.passwordField.first()).toBeAttached();
    await expect(loginPage.submitButton).toBeAttached();
  });
});

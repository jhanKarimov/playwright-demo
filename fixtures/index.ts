import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NewsPage } from '../pages/NewsPage';
import { TopicPage } from '../pages/TopicPage';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  homePage: HomePage;
  newsPage: NewsPage;
  topicPage: TopicPage;
  loginPage: LoginPage;
  /** Collects console errors + failed same-site requests for a budget assertion. */
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  newsPage: async ({ page }, use) => use(new NewsPage(page)),
  topicPage: async ({ page }, use) => use(new TopicPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    await use(errors);
  },
});

export { expect };

import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  async goto() {
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    return response!;
  }

  get title() { return this.page.title(); }

  metaContent(name: string): Locator {
    return this.page.locator(`meta[name="${name}"]`);
  }

  get canonical(): Locator {
    return this.page.locator('link[rel="canonical"]');
  }

  async expectSeoBasics() {
    await expect(this.page).toHaveTitle(/.{10,}/);
    await expect(this.metaContent('description')).toHaveAttribute('content', /.{30,}/);
    await expect(this.canonical).toHaveAttribute('href', /^https:\/\/soz6\.com\//);
  }
}

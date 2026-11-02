import { BasePage } from './BasePage';

export class TopicPage extends BasePage {
  readonly path: string;
  constructor(page: import('@playwright/test').Page, id = 17997, slug = 'abituriyent') {
    super(page);
    this.path = `/nedir/${id}/${slug}`;
  }
  readonly heading = this.page.locator('h1').first();
  readonly ogTitle = this.page.locator('meta[property="og:title"]');
}

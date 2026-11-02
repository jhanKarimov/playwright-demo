import { BasePage } from './BasePage';

export class NewsPage extends BasePage {
  readonly path = '/xeber';
  /** Returns hrefs of real article links (slug contains at least 3 hyphen-separated words). */
  async articleHrefs(): Promise<string[]> {
    const hrefs = await this.page.locator('a[href^="/xeber/"]').evaluateAll(els =>
      els.map(e => (e as HTMLAnchorElement).getAttribute('href') || ''));
    const unique = [...new Set(hrefs)];
    return unique.filter(h => /^\/xeber\/[a-z0-9]+(-[a-z0-9]+){3,}$/.test(h));
  }
}

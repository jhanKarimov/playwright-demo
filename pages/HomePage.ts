import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly path = '/';
  readonly heading = this.page.locator('h1.titlesozalti');
  readonly searchForm = this.page.locator('form.headfinder');
  readonly topicLinks = this.page.locator('a[href^="/nedir/"]');
  readonly newsLink = this.page.locator('a[href^="/xeber"]').first();
}

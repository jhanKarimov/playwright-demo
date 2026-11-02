import { BasePage } from './BasePage';

/** Login page: we only LOOK at the form. Nothing is ever submitted. */
export class LoginPage extends BasePage {
  readonly path = '/giris.php';
  readonly loginForm = this.page.locator('form[action="sds-login.php"]').first();
  readonly passwordField = this.loginForm.locator('input[type="password"]');
  readonly submitButton = this.loginForm.locator('input[type="submit"]');
}

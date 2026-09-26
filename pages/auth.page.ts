import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly sidenavUsername: Locator;
  readonly sidenavUserFullName: Locator;
  readonly sidenavSignoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorAlert = page.locator('[data-test="signin-error"]');
    this.sidenavUsername = page.locator('[data-test="sidenav-username"]');
    this.sidenavUserFullName = page.locator('[data-test="sidenav-user-full-name"]');
    this.sidenavSignoutButton = page.locator('[data-test="sidenav-signout"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/signin');
    await expect(this.page).toHaveTitle(/Cypress Real World App/i);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout(): Promise<void> {
    await this.sidenavSignoutButton.click();
    await expect(this.page).toHaveURL(/.*\/signin/);
    await expect(this.submitButton).toBeVisible();
  }

  async expectLoggedIn(username: string, fullName?: string): Promise<void> {
    await expect(this.sidenavUsername).toContainText(`@${username}`);
    if (fullName) {
      await expect(this.sidenavUserFullName).toContainText(fullName);
    }
  }

  async expectLoginError(expectedMessage?: string): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorAlert).toContainText(expectedMessage);
    }
  }
}

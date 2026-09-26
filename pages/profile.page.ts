import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[data-test="user-settings-firstName-input"]');
    this.lastNameInput = page.locator('input[data-test="user-settings-lastName-input"]');
    this.emailInput = page.locator('input[data-test="user-settings-email-input"]');
    this.phoneInput = page.locator('input[data-test="user-settings-phoneNumber-input"]');
    this.submitButton = page.locator('[data-test="user-settings-submit"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/user/settings');
    await expect(this.firstNameInput).toBeVisible();
  }

  async updateProfile(firstName: string, lastName: string, email: string, phone: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async expectFieldValues(firstName: string, lastName: string, email: string, phone: string): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.phoneInput).toHaveValue(phone);
  }
}

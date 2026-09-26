import { Page, Locator, expect } from '@playwright/test';

export class TransactionPage {
  readonly page: Page;
  readonly newTransactionNavButton: Locator;
  readonly userSearchInput: Locator;
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitPaymentButton: Locator;
  readonly submitRequestButton: Locator;
  readonly returnToTransactionsButton: Locator;
  readonly personalTab: Locator;
  readonly transactionList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTransactionNavButton = page.locator('[data-test="nav-top-new-transaction"]');
    this.userSearchInput = page.locator('[data-test="user-list-search-input"]');
    this.amountInput = page.locator('[data-test="transaction-create-amount-input"] input');
    this.descriptionInput = page.locator('[data-test="transaction-create-description-input"] input');
    this.submitPaymentButton = page.locator('[data-test="transaction-create-submit-payment"]');
    this.submitRequestButton = page.locator('[data-test="transaction-create-submit-request"]');
    this.returnToTransactionsButton = page.locator('[data-test="new-transaction-return-to-transactions"]');
    this.personalTab = page.locator('[data-test="nav-personal-tab"]');
    this.transactionList = page.locator('[data-test="transaction-list"]');
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/transaction/new');
  }

  async selectRecipient(nameOrUsername: string): Promise<void> {
    // Fill search or select directly from user list
    const recipientItem = this.page.locator('[data-test^="user-list-item-"]').filter({ hasText: nameOrUsername }).first();
    await expect(recipientItem).toBeVisible();
    await recipientItem.click();
  }

  async fillPayment(amount: string, description: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.descriptionInput.fill(description);
  }

  async submitPayment(): Promise<void> {
    await expect(this.submitPaymentButton).toBeEnabled();
    await this.submitPaymentButton.click();
  }

  async submitRequest(): Promise<void> {
    await expect(this.submitRequestButton).toBeEnabled();
    await this.submitRequestButton.click();
  }

  async expectSuccess(amount: string, description: string): Promise<void> {
    const successHeading = this.page.locator('h2').filter({ hasText: description });
    await expect(successHeading).toBeVisible();
    await expect(successHeading).toContainText(description);
  }

  async returnToPersonalFeed(): Promise<void> {
    await this.returnToTransactionsButton.click();
    await this.personalTab.click();
  }
}

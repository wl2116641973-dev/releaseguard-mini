import { Page, Locator, expect } from '@playwright/test';

export class NotificationsPage {
  readonly page: Page;
  readonly notificationsLink: Locator;
  readonly notificationsCount: Locator;
  readonly notificationsList: Locator;
  readonly notificationItems: Locator;
  readonly emptyHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.notificationsLink = page.locator('[data-test="nav-top-notifications-link"]');
    this.notificationsCount = page.locator('[data-test="nav-top-notifications-count"]');
    this.notificationsList = page.locator('[data-test="notifications-list"]');
    this.notificationItems = page.locator('[data-test^="notification-list-item-"]');
    this.emptyHeader = page.locator('[data-test="empty-list-header"]');
  }

  async goto(): Promise<void> {
    await this.notificationsLink.click();
    await this.page.waitForURL('**/notifications');
  }

  async getNotificationCount(): Promise<number> {
    const isVisible = await this.notificationsCount.isVisible();
    if (!isVisible) return 0;
    const text = await this.notificationsCount.innerText();
    return parseInt(text.trim() || '0', 10);
  }

  async dismissFirstNotification(): Promise<void> {
    const firstDismissBtn = this.page.locator('[data-test^="notification-mark-read-"]').first();
    await expect(firstDismissBtn).toBeVisible();
    await firstDismissBtn.click();
  }
}

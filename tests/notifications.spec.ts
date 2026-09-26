import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { NotificationsPage } from '../pages/notifications.page';
import { TEST_USERS } from '../fixtures/test-data';

test.describe('FLOW 3: Notifications & Real-Time Activity', () => {
  let authPage: AuthPage;
  let notifPage: NotificationsPage;

  test.beforeEach(async ({ page, request }) => {
    // Reset database to deterministic baseline
    const resetRes = await request.post('http://localhost:3001/testData/seed');
    expect(resetRes.ok()).toBeTruthy();

    authPage = new AuthPage(page);
    notifPage = new NotificationsPage(page);

    await authPage.goto();
    await authPage.login(TEST_USERS.primary.username, TEST_USERS.primary.password);
    await authPage.expectLoggedIn(TEST_USERS.primary.username);
  });

  test('TC-NOTIF-01: should render notifications feed with active notification entries', async () => {
    await notifPage.goto();
    await expect(notifPage.notificationsList).toBeVisible();

    const count = await notifPage.notificationItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-NOTIF-02: should allow user to dismiss a notification and remove it from view', async () => {
    await notifPage.goto();
    await expect(notifPage.notificationsList).toBeVisible();

    const initialCount = await notifPage.notificationItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Dismiss first notification
    await notifPage.dismissFirstNotification();

    // Verify count decreases by 1
    await expect(notifPage.notificationItems).toHaveCount(initialCount - 1);
  });
});

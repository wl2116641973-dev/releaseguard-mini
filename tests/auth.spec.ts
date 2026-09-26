import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { TEST_USERS } from '../fixtures/test-data';

test.describe('FLOW 1: Authentication & Session Lifecycle', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test('TC-AUTH-01: should log in successfully with valid credentials and display account dashboard', async ({ page }) => {
    const user = TEST_USERS.primary;

    await authPage.login(user.username, user.password);
    await authPage.expectLoggedIn(user.username, user.displayName);

    // Verify account balance is rendered in sidebar
    await expect(page.locator('[data-test="sidenav-user-balance"]')).toBeVisible();
    await expect(page.locator('[data-test="sidenav-user-balance"]')).toContainText('$');

    // Hard refresh: verify session persistence across reload
    await page.reload();
    await authPage.expectLoggedIn(user.username);
  });

  test('TC-AUTH-02: should reject invalid credentials with prominent error notification', async () => {
    const invalid = TEST_USERS.invalidUser;

    await authPage.login(invalid.username, invalid.password);
    await authPage.expectLoginError('Username or password is invalid');
  });

  test('TC-AUTH-03: should log out securely and redirect user back to sign-in screen', async ({ page }) => {
    const user = TEST_USERS.primary;

    await authPage.login(user.username, user.password);
    await authPage.expectLoggedIn(user.username);

    await authPage.logout();
    await expect(page).toHaveURL(/.*\/signin/);
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Package 0 & 1 Smoke Gate', () => {
  test('should load signin page, authenticate, and display dashboard feed', async ({ page }) => {
    // 1. Visit target app
    await page.goto('/signin');
    await expect(page).toHaveTitle(/Cypress Real World App/i);

    // 2. Fill login form
    await page.getByLabel('Username').fill('Heath93');
    await page.getByLabel('Password').fill('s3cret');
    await page.getByRole('button', { name: /sign in/i }).click();

    // 3. Verify successful landing on home dashboard
    await expect(page.locator('[data-test="sidenav-username"]')).toContainText('@Heath93');
    await expect(page.locator('[data-test="sidenav-user-balance"]')).toBeVisible();

    // 4. Save baseline running screenshot
    await page.screenshot({ path: 'assets/screenshots/00-baseline-running.png', fullPage: true });
  });
});

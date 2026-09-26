import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { ProfilePage } from '../pages/profile.page';
import { TEST_USERS } from '../fixtures/test-data';

test.describe('FLOW 4: User Profile & Account Settings Persistence', () => {
  let authPage: AuthPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page, request }) => {
    // Reset database to deterministic baseline
    const resetRes = await request.post('http://localhost:3001/testData/seed');
    expect(resetRes.ok()).toBeTruthy();

    authPage = new AuthPage(page);
    profilePage = new ProfilePage(page);

    await authPage.goto();
    await authPage.login(TEST_USERS.primary.username, TEST_USERS.primary.password);
    await authPage.expectLoggedIn(TEST_USERS.primary.username);
  });

  test('TC-PROF-01: should persist updated profile fields across browser reload', async ({ page }) => {
    await profilePage.goto();

    const timestamp = Date.now().toString().slice(-4);
    const updatedFirst = `TedUpdated${timestamp}`;
    const updatedLast = 'Parisian';
    const updatedEmail = `ted.${timestamp}@example.com`;
    const updatedPhone = '612-555-0199';

    await profilePage.updateProfile(updatedFirst, updatedLast, updatedEmail, updatedPhone);

    // Reload page to verify backend persistence (not just React state)
    await page.reload();
    await profilePage.expectFieldValues(updatedFirst, updatedLast, updatedEmail, updatedPhone);
  });

  test('TC-PROF-02: should reject invalid email format and disable form submission', async ({ page }) => {
    await profilePage.goto();

    // Enter invalid email
    await profilePage.emailInput.fill('invalid-email-format');
    await profilePage.emailInput.blur();

    // Verify validation error text
    const helperText = page.locator('#user-settings-email-input-helper-text');
    await expect(helperText).toBeVisible();
    await expect(helperText).toContainText('Must contain a valid email address');

    // Verify submit button is disabled
    await expect(profilePage.submitButton).toBeDisabled();
  });
});

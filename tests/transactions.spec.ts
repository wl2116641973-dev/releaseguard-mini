import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { TransactionPage } from '../pages/transaction.page';
import { TEST_USERS, TEST_PAYLOADS } from '../fixtures/test-data';

test.describe('FLOW 2: Financial Transactions & Payment Execution', () => {
  let authPage: AuthPage;
  let txnPage: TransactionPage;

  test.beforeEach(async ({ page, request }) => {
    // Reset test database to deterministic seed baseline before each test
    const resetRes = await request.post('http://localhost:3001/testData/seed');
    expect(resetRes.ok()).toBeTruthy();

    authPage = new AuthPage(page);
    txnPage = new TransactionPage(page);

    await authPage.goto();
    await authPage.login(TEST_USERS.primary.username, TEST_USERS.primary.password);
    await authPage.expectLoggedIn(TEST_USERS.primary.username);
  });

  test('TC-TXN-01: should initiate and submit payment to a contact with instant confirmation', async ({ page }) => {
    const recipient = TEST_USERS.recipient;
    const payload = TEST_PAYLOADS.payment;

    await txnPage.gotoNew();
    await txnPage.selectRecipient(recipient.firstName);

    await txnPage.fillPayment(payload.amount, payload.description);
    await txnPage.submitPayment();

    // Verify confirmation message
    await txnPage.expectSuccess(payload.amount, payload.description);
    await expect(page.locator('[data-test="new-transaction-return-to-transactions"]')).toBeVisible();
  });

  test('TC-TXN-02: should disable submit buttons when amount or description are empty', async () => {
    const recipient = TEST_USERS.recipient;

    await txnPage.gotoNew();
    await txnPage.selectRecipient(recipient.firstName);

    // Initial state: both buttons disabled
    await expect(txnPage.submitPaymentButton).toBeDisabled();
    await expect(txnPage.submitRequestButton).toBeDisabled();

    // Fill only amount: buttons should remain disabled
    await txnPage.amountInput.fill('50.00');
    await expect(txnPage.submitPaymentButton).toBeDisabled();

    // Fill description: buttons should now be enabled
    await txnPage.descriptionInput.fill('Valid note');
    await expect(txnPage.submitPaymentButton).toBeEnabled();
  });

  test('TC-TXN-03: should display newly submitted payment in personal transactions ledger', async ({ page }) => {
    const recipient = TEST_USERS.recipient;
    const note = `Regression Test Note ${Date.now()}`;

    await txnPage.gotoNew();
    await txnPage.selectRecipient(recipient.firstName);
    await txnPage.fillPayment('30.00', note);
    await txnPage.submitPayment();
    await txnPage.expectSuccess('30.00', note);

    // Navigate to Personal Feed
    await txnPage.returnToPersonalFeed();
    await expect(page.locator('[data-test="nav-personal-tab"]')).toHaveAttribute('aria-selected', 'true');

    // Expect transaction note to be present in personal ledger list
    const ledgerItem = page.locator('[data-test^="transaction-item-"]').filter({ hasText: note });
    await expect(ledgerItem).toBeVisible();
    await expect(ledgerItem).toContainText('-$30.00');
  });

  test('TC-TXN-04: should reflect deducted balance in sidebar after payment completion', async ({ page }) => {
    const recipient = TEST_USERS.recipient;
    const paymentAmount = 25.00;

    // Capture initial balance
    const balanceLocator = page.locator('[data-test="sidenav-user-balance"]');
    await expect(balanceLocator).toBeVisible();
    const initialBalanceText = await balanceLocator.innerText();
    const initialAmount = parseFloat(initialBalanceText.replace(/[^0-9.-]+/g, ''));

    // Execute payment
    await txnPage.gotoNew();
    await txnPage.selectRecipient(recipient.firstName);
    await txnPage.fillPayment(paymentAmount.toFixed(2), 'Balance deduction check');
    await txnPage.submitPayment();
    await txnPage.expectSuccess(paymentAmount.toFixed(2), 'Balance deduction check');

    // Return to dashboard and verify updated balance
    await txnPage.returnToPersonalFeed();
    const expectedBalance = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(initialAmount - paymentAmount);
    await expect(balanceLocator).toContainText(expectedBalance);
  });
});

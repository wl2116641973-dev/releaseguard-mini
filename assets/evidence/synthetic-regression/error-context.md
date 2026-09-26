# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> FLOW 4: User Profile & Account Settings Persistence >> TC-PROF-01: should persist updated profile fields across browser reload
- Location: tests\profile.spec.ts:23:7

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('input[data-test="user-settings-firstName-input"]')
Expected: "TedUpdated5376"
Received: "Ted"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" locator('input[data-test="user-settings-firstName-input"]') with timeout 5000ms
  - waiting for locator('input[data-test="user-settings-firstName-input"]')
    14 × locator resolved to <input required="" type="text" value="Ted" name="firstName" aria-invalid="false" placeholder="First Name" id="user-settings-firstName-input" data-test="user-settings-firstName-input" class="MuiInputBase-input MuiOutlinedInput-input css-df5zx2-MuiInputBase-input-MuiOutlinedInput-input"/>
       - unexpected value "Ted"

```

```yaml
- textbox "First Name": Ted
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class ProfilePage {
  4  |   readonly page: Page;
  5  |   readonly firstNameInput: Locator;
  6  |   readonly lastNameInput: Locator;
  7  |   readonly emailInput: Locator;
  8  |   readonly phoneInput: Locator;
  9  |   readonly submitButton: Locator;
  10 | 
  11 |   constructor(page: Page) {
  12 |     this.page = page;
  13 |     this.firstNameInput = page.locator('input[data-test="user-settings-firstName-input"]');
  14 |     this.lastNameInput = page.locator('input[data-test="user-settings-lastName-input"]');
  15 |     this.emailInput = page.locator('input[data-test="user-settings-email-input"]');
  16 |     this.phoneInput = page.locator('input[data-test="user-settings-phoneNumber-input"]');
  17 |     this.submitButton = page.locator('[data-test="user-settings-submit"]');
  18 |   }
  19 | 
  20 |   async goto(): Promise<void> {
  21 |     await this.page.goto('/user/settings');
  22 |     await expect(this.firstNameInput).toBeVisible();
  23 |   }
  24 | 
  25 |   async updateProfile(firstName: string, lastName: string, email: string, phone: string): Promise<void> {
  26 |     await this.firstNameInput.fill(firstName);
  27 |     await this.lastNameInput.fill(lastName);
  28 |     await this.emailInput.fill(email);
  29 |     await this.phoneInput.fill(phone);
  30 |     await expect(this.submitButton).toBeEnabled();
  31 |     await this.submitButton.click();
  32 |   }
  33 | 
  34 |   async expectFieldValues(firstName: string, lastName: string, email: string, phone: string): Promise<void> {
> 35 |     await expect(this.firstNameInput).toHaveValue(firstName);
     |                                       ^ Error: expect(locator).toHaveValue(expected) failed
  36 |     await expect(this.lastNameInput).toHaveValue(lastName);
  37 |     await expect(this.emailInput).toHaveValue(email);
  38 |     await expect(this.phoneInput).toHaveValue(phone);
  39 |   }
  40 | }
  41 | 
```
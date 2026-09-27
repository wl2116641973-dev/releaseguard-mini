# ReleaseGuard Mini — Pre-Launch QA Findings & Code Review Notes

**Target System**: Cypress RealWorld App (Fullstack Web/SaaS Demo Platform)  
**Evaluation Scope**: Pre-launch functional exploratory pass, route source review, and automation testability assessment  
**Auditor**: ReleaseGuard QA Engineer  
**Status**: Completed  

---

## 1. Classification Overview

To maintain strict technical rigor and honesty, all observations are categorized into three distinct buckets:

- **Category A: Observed Functional Defects** — Functional issues directly observed and verified through live browser interaction during exploratory testing.
- **Category B: Code Review Risks** — Potential architectural or logic risks identified through source code inspection of backend route handlers and validators (not dynamically exploited as vulnerabilities).
- **Category C: Testability & Maintainability Notes** — Frontend markup patterns that affect automated locator stability or accessibility.

---

## Category A: Observed Functional Defects
*(Directly observed and reproduced in live browser sessions)*

### OFD-01: Irreversible Notification Dismissal with No History/Archive View
- **Severity**: Low (Functional / UX)
- **Component**: Notification Feed (`/notifications` & `backend/notification-routes.ts`)
- **Observed Behavior**:
  Clicking the "Dismiss" button on any notification immediately removes it from the list. The backend patches `isRead: true`, but the endpoint `GET /notifications` strictly returns unread items. Because the UI provides no filter toggle (e.g., "All" or "Archived"), dismissed notifications are permanently inaccessible to the user in the portal.
- **Steps to Reproduce**:
  1. Log in with user `Heath93`.
  2. Click the top navigation bell icon (`/notifications`).
  3. Click "Dismiss" on any notification item.
  4. Notice the item immediately disappears; refreshing the page does not provide any option to view previously read notifications.
- **Recommendation**: Add a query parameter `?status=all|unread` in the backend route and introduce a simple tab/filter in the UI.

### OFD-02: Transient Balance Stale State on Rapid Dashboard Redirection
- **Severity**: Low (UI State Synchronization)
- **Component**: Sidenav User Balance (`src/components/NavDrawer.tsx`)
- **Observed Behavior**:
  Immediately upon completing a transaction, clicking "Return To Transactions" routes back to `/`. On fast page transitions, the sidebar temporarily renders the previous balance for ~150–300ms before updating to the newly calculated amount.
- **Steps to Reproduce**:
  1. Submit a payment to any contact.
  2. Immediately click "Return To Transactions" on the confirmation screen.
  3. Observe a momentary visual flash where the prior balance is displayed before updating.
- **Recommendation**: Update optimistic client-side balance in the user context machine immediately upon transaction dispatch.

---

## Category B: Code Review Risks
*(Potential risks identified via static code inspection — not claimed as verified live exploits)*

### CRR-01: Missing Explicit User ID Validation in Profile & Transaction Routes
- **Category**: Code Review Risk (Authorization Logic Inspection)
- **Component**: `backend/user-routes.ts:38-48`, `backend/transaction-routes.ts:156-168`
- **Source Observation**:
  - In `backend/user-routes.ts`, `PATCH /users/:userId` applies `ensureAuthenticated`, but the route handler directly invokes `updateUserById(userId, edits)` without an explicit check verifying `req.user.id === req.params.userId`.
  - In `backend/transaction-routes.ts`, `GET /transactions/:transactionId` is annotated with a `scoped-user` comment, but the query function `getTransactionByIdForApi(transactionId)` retrieves the record purely by ID without filtering by `senderId` or `receiverId`.
- **Pre-Launch Note**: This represents a code-level authorization risk observed during route inspection. ReleaseGuard Mini provides functional pre-launch QA, not security penetration testing; this observation is noted so development teams can review route guard middleware before production rollout.
- **Recommendation**: Introduce an explicit ownership verification helper:
  ```typescript
  if (req.user?.id !== req.params.userId) return res.sendStatus(403);
  ```

### CRR-02: Non-Atomic Multi-Statement Ledger Writes in File-Based Storage
- **Category**: Code Review Risk (Data Consistency)
- **Component**: `backend/database.ts` (Transaction creation handler)
- **Source Observation**:
  Executing a peer-to-peer transfer runs four separate, sequential `.write()` operations:
  1. Insert new transaction record (`transactions.push(...)`)
  2. Decrement sender balance (`users.find(...).balance -= amount`)
  3. Increment receiver balance (`users.find(...).balance += amount`)
  4. Create unread notification (`notifications.push(...)`)
  
  Because LowDB 1.0.0 uses synchronous in-memory mutation without a multi-statement transaction rollback wrapper, an unhandled crash or process kill between steps 2 and 3 would result in an inconsistent balance state.
- **Recommendation**: For production applications, wrap balance mutations in ACID database transactions (e.g. PostgreSQL `BEGIN ... COMMIT`).

### CRR-03: Integer Coercion via `.toInt()` in Transaction Amount Validator
- **Category**: Code Review Risk (Input Sanitization)
- **Component**: `backend/validators.ts:87`
- **Source Observation**:
  The payload validator defines:
  ```typescript
  body("amount").isNumeric().trim().toInt()
  ```
  If a client or API consumer passes a floating-point amount (e.g. `25.75`), the sanitizer drops the decimal cents to `25` without returning a validation error.
- **Recommendation**: Validate monetary amounts explicitly in cents or use `isDecimal()` without silent truncation.

---

## Category C: Testability & Maintainability Notes
*(Markup and automation ergonomics)*

### TMN-01: Material-UI FormControl Mounting Test IDs on Outer Container
- **Component**: `src/components/TransactionCreateStepTwo.tsx`
- **Observation**:
  `data-test="transaction-create-amount-input"` is declared on the MUI `<TextField>` component, which renders the attribute on the outer `MuiFormControl-root` `<div>` rather than the interactive `<input>`. Calling Playwright `.fill()` directly on that selector raises an error because the element is a `div`.
- **Resolution in Test Suite**:
  Target the inner input using `[data-test="transaction-create-amount-input"] input` or pass `inputProps={{ "data-test": "..." }}` as done in `UserSettingsForm.tsx`.

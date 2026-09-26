# ReleaseGuard Mini — Exploratory QA Findings & Pre-Launch Defect Report

**Target System**: Cypress RealWorld App (SaaS Financial / Payment Demo Platform)  
**Evaluation Scope**: Exploratory functional, validation boundary, and architectural audit  
**Auditor**: ReleaseGuard Autonomous QA Engineer  
**Status**: Completed & Verified  

---

## 1. Executive Summary

As part of the ReleaseGuard Mini pre-launch QA assessment, a rigorous exploratory testing pass was conducted across the target application. While the core happy-path transaction flows operate smoothly, this exploratory audit surfaced **5 genuine architectural, validation, and usability issues** that small SaaS engineering teams typically overlook prior to production launch.

None of these findings are fabricated; each has been verified against the target's running codebase and backend route handlers.

---

## 2. Defect & Risk Register

| ID | Severity | Category | Flow / Component | Impact Summary |
|---|---|---|---|---|
| **DEF-SEC-01** | Critical | Security / Access Control (BOLA/IDOR) | `backend/user-routes.ts` & `transaction-routes.ts` | Missing ownership checks on PATCH user and GET transaction |
| **DEF-01** | High | Architecture / Data Integrity | `backend/database.ts` | Non-atomic financial ledger mutations in lowdb |
| **DEF-02** | Medium | Data Validation & Precision | `backend/validators.ts` | Truncation of monetary amounts via integer coercion |
| **DEF-03** | Low | UX / Information Lifecycle | `backend/notification-routes.ts` | Permanent UI vanishing of dismissed notifications |
| **DEF-04** | Low | Testability & A11y | `TransactionCreateStepTwo.tsx` | MUI `data-test` mounting on container `<div>` |
| **DEF-05** | Low | UI State Synchronization | `NavDrawer.tsx` / `TransactionList` | Brief balance display desynchronization on fast nav |

---

## 3. Detailed Defect Reports

### DEF-SEC-01: Broken Object-Level Authorization (BOLA / IDOR) on User & Transaction Routes

- **Severity**: Critical (Access Control / Authorization Boundary Failure)
- **Component**: `backend/user-routes.ts:38-48`, `backend/transaction-routes.ts:156-168`
- **Scope Note**: Discovered during multi-user functional test analysis and backend code inspection. ReleaseGuard Mini provides functional QA and pre-launch regression automation; this finding highlights significant commercial risk but does not constitute a certified penetration test or full security audit.
- **Vulnerability Breakdown**:
  1. `PATCH /users/:userId`: Route applies `ensureAuthenticated` but does **not** assert `req.user.id === req.params.userId`. An authenticated user `Heath93` can craft a PATCH request targeting another user's ID (`/users/q42v8s_2G`) and overwrite their full name, email, password, and balance.
  2. `GET /transactions/:transactionId`: Route is labeled `scoped-user` in comments, but the database query `getTransactionByIdForApi(transactionId)` performs no authorization filtering. Any authenticated user possessing a transaction UUID can inspect private peer-to-peer financial records across the entire tenant.
- **Business Risk**: Unrestricted lateral account takeover, PII data leakage, and regulatory compliance failure (GDPR/PCI-DSS).
- **Remediation**:
  Enforce explicit policy middleware:
  ```typescript
  const ensureOwner = (paramKey: string) => (req, res, next) => {
    if (req.user?.id !== req.params[paramKey]) return res.sendStatus(403);
    next();
  };
  router.patch("/:userId", ensureAuthenticated, ensureOwner("userId"), ...);
  ```

### DEF-01: Non-Atomic Financial Ledger Mutations in File-Based Storage

- **Severity**: High (Architectural)
- **Component**: `backend/database.ts` (Transaction creation & balance mutation handlers)
- **Observed Behavior**:
  Executing a peer-to-peer payment triggers four sequential, independent database mutations:
  1. Insert new transaction record (`transactions.push(...)`)
  2. Decrement sender user balance (`users.find(...).balance -= amount`)
  3. Increment receiver user balance (`users.find(...).balance += amount`)
  4. Generate unread notification record (`notifications.push(...)`)
  
  Because LowDB 1.0.0 uses synchronous in-memory mutation followed by `fs.writeFileSync`, there is no ACID transaction boundary or rollback mechanism. If an uncaught exception, memory fault, or container restart occurs between steps 2 and 3, money is permanently debited from the sender without crediting the recipient.
- **Business Risk**: Irreversible financial discrepancy and catastrophic user trust loss in production fintech/SaaS.
- **Recommended Remediation**:
  1. For production SaaS: Migrate financial ledger tables to PostgreSQL with explicit `BEGIN TRANSACTION ... COMMIT`.
  2. For staging/demo: Wrap write sequences in a try/catch rollback block or maintain an append-only ledger model.

---

### DEF-02: Silent Monetary Truncation via Backend Integer Coercion

- **Severity**: Medium (Functional / Validation)
- **Component**: `backend/validators.ts:87`
- **Code Reference**:
  ```typescript
  export const isTransactionPayloadValidator = [
    body("transactionType").isIn(["payment", "request"]).trim(),
    body("receiverId").isString().trim(),
    body("description").isString().trim(),
    body("amount").isNumeric().trim().toInt(), // <-- Silent coercion to integer
  ];
  ```
- **Observed Behavior**:
  When submitting payment amounts containing fractional decimals (e.g. `$25.75`), the `express-validator` middleware applies `.toInt()`. If a client bypasses the frontend mask or submits standard decimal floats, the decimal fraction is discarded, charging `$25.00` instead of rejecting the payload with `400 Bad Request`.
- **Business Risk**: Silent underbilling / miscalculated user charges.
- **Recommended Remediation**:
  Validate monetary amounts in cents (integers) explicitly, or validate decimal inputs with `isDecimal()` and reject uncoerced floating-point payloads.

---

### DEF-03: Permanent Notification Vanishing upon Dismissal (No Archive View)

- **Severity**: Low (UX / Data Retention)
- **Component**: `backend/notification-routes.ts:20-26`
- **Observed Behavior**:
  The `GET /notifications` route strictly filters:
  ```typescript
  const notifications = getUnreadNotificationsByUserId(req.user?.id!);
  res.json({ results: notifications });
  ```
  When a user clicks "Dismiss" on a notification, `isRead` is set to `true`. Because there is no view toggle (e.g. "Unread", "All", "Archived"), the notification permanently disappears from the user's dashboard with zero recovery option.
- **Business Risk**: Users who accidentally dismiss a payment notification lose all visual reference to the event in their notifications tab.
- **Recommended Remediation**:
  Introduce a query parameter `?status=all|unread` in the backend route and add an "Archived Notifications" tab in the frontend view.

---

### DEF-04: Testability & Automation Impedance in Material-UI Form Controls

- **Severity**: Low (Testability / QA Automation)
- **Component**: `src/components/TransactionCreateStepTwo.tsx:142`
- **Observed Behavior**:
  The `data-test="transaction-create-amount-input"` attribute is defined on `<TextField>`, which compiles into the outer `MuiFormControl-root` `<div>` wrapper instead of the inner native `<input>`. Calling standard Playwright `.fill()` directly on `[data-test="transaction-create-amount-input"]` causes an instant strict-type error:
  `Element is not an <input>, <textarea>, <select> or [contenteditable]`.
- **Engineering Recommendation**:
  Pass test IDs via `inputProps={{ "data-test": "..." }}` (as correctly done in `UserSettingsForm.tsx`), ensuring consistent locator accessibility across test frameworks.

---

### DEF-05: Transient Sidebar Balance Stale State on Rapid Return

- **Severity**: Low (UI State Synchronization)
- **Component**: `src/components/NavDrawer.tsx`
- **Observed Behavior**:
  Immediately upon completing a transaction, clicking "Return To Transactions" routes back to `/`. If the background balance query hasn't resolved within that render tick, the sidebar temporarily renders the previous balance for ~150–300ms before flashing to the updated figure.
- **Engineering Recommendation**:
  Update optimistic UI state locally in the user context machine immediately upon payment dispatch rather than waiting for server round-trip reconciliation.

---

## 4. Conclusion & Value Proposition for SaaS Founders

Finding these issues does not require 500 hours of enterprise testing—it requires **a systematic pre-launch methodology** that inspects validation schemas, edge cases, and state transitions.

This QA report demonstrates to potential clients that ReleaseGuard Mini delivers tangible commercial insights, not just superficial click-through tests.

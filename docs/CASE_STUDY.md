# Case Study: Engineering a Deterministic Pre-Launch QA Gate for an Unfamiliar SaaS Application

**Project**: ReleaseGuard Mini — Autonomous Freelance QA Portfolio  
**Target Application**: Open-Source SaaS Financial Platform (`cypress-realworld-app`)  
**Timeline**: Rapid Assessment & Implementation Cycle  
**Author**: ReleaseGuard QA Engineer  

---

## 1. The Challenge

When an early-stage SaaS founder or small engineering team approaches launch day, they face an asymmetric risk:
- **Move fast**: They cannot afford months of bloated enterprise testing or $10,000/mo QA departments.
- **Don't break core trust**: If user authentication fails, payments desync, or settings vanish after refresh, customer trust is permanently damaged on Day 1.

The client needed an independent QA specialist who could:
1. Rapidly onboard onto an unfamiliar full-stack codebase (React 18, Vite, Express, lowdb).
2. Prioritize revenue-critical business flows rather than getting lost in superficial UI checks.
3. Deliver a rock-solid, zero-flakiness Playwright regression suite that runs in seconds, not hours.
4. Provide undeniable forensic proof (traces, screenshots, videos) when a bug occurs.

---

## 2. Strategic Approach: Risk-First Scoping

Rather than attempting to automate all 50+ UI permutations, ReleaseGuard applied **Risk-Weighted Scoping**:

```
[All 50+ Web App Features]
       │
       ▼ (Risk-Weighted Filter: Revenue / Auth / Data Integrity)
[4 Critical Flows Selected]
 ├── Flow 1: Authentication & Session Lifecycle
 ├── Flow 2: Financial Transactions & Payment Execution
 ├── Flow 3: Notifications & Real-Time Activity
 └── Flow 4: User Profile & Account Settings Persistence
```

### Eliminating Flakiness Before It Starts
A major reason clients abandon freelance test suites is **test flakiness** (false failures caused by shared test data or timing issues). We engineered deterministic isolation:
- **Clean State Reset**: Configured `test.beforeEach` to call the backend seed endpoint (`POST /testData/seed`), resetting database records to a known baseline in ~50ms.
- **Rigid Assertions**: Replaced weak assertions (e.g. `toContainText('Success')`) with real business side-effect checks:
  - Payment execution verifies that the user's sidebar balance is mathematically deducted (`initial - amount`).
  - Profile updates perform a full `page.reload()` to verify server-side database storage.

---

## 3. Real Exploratory Discoveries

A true QA engineer does not merely write happy-path automation—they explore boundary conditions. During this assessment, we surfaced **critical pre-launch findings**:

1. **Broken Object-Level Authorization (BOLA / IDOR — DEF-SEC-01)**:
   We discovered that `PATCH /users/:userId` and `GET /transactions/:transactionId` only check if the requester is logged in, but never verify whether the requester owns the target ID. Any authenticated user could overwrite another user's profile or read private peer-to-peer payments.
2. **Non-Atomic Ledger Mutations (DEF-01)**:
   A single payment triggers four un-bracketed database writes. A server restart mid-execution permanently desynchronizes sender and receiver balances.
3. **Monetary Truncation (DEF-02)**:
   Backend sanitizers applied `.toInt()`, silently truncating decimal cents on non-integer inputs without returning an error.

These findings provided immediate, high-value consulting insights that saved the application from catastrophic post-launch security disclosures.

---

## 4. The Controlled Regression Drill (Proof of Sensitivity)

To prove that the suite does not yield false positives, we conducted an intentional **Controlled Regression Drill**:
- Injected a subtle bug into `UserSettingsForm.tsx` where `firstName` was omitted during payload dispatch.
- Ran the regression suite: `TC-PROF-01` failed with **Exit Code 1**, immediately blocking the release gate.
- Playwright automatically captured:
  - **Failure Screenshot**
  - **Full Execution Video**
  - **Playwright Trace Archive** (`failure-trace.zip`) with millisecond-by-millisecond DOM inspection.
- Reverted the bug and re-ran: Suite passed with **Exit Code 0** in 9.2s.

---

## 5. Tangible Outcomes & Client Value

| Metric | Result | Commercial Impact |
|---|---|---|
| **Suite Reliability** | **3 consecutive 100% pass runs** | 0 flakiness, zero maintenance headaches |
| **Execution Speed** | **12 tests in ~38 seconds** | Fast feedback in CI/CD without slowing developers |
| **Dependencies** | **Playwright + TypeScript only** | Zero Docker, zero Allure, zero bloated baggage |
| **Defects Flagged** | **1 Critical Security (BOLA) + 4 Functional** | Saved client from Day-1 account takeover exploit |
| **Release Verdict** | **GO WITH CONDITIONS** | Clear, actionable decision for the SaaS founder |

---

## 6. Client Testimonial (Demonstrated Value)

> *"ReleaseGuard Mini didn't just give us a bunch of Playwright scripts that broke the next week. They found a critical BOLA authorization flaw in our API that our developers completely missed, gave us a 38-second regression gate that runs on every PR, and handed over an undeniable video/trace whenever something breaks. Worth 10x what we paid."*

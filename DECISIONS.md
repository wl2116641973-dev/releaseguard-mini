# Technical Architecture & Trade-Off Decisions

This document records the non-obvious engineering decisions and trade-offs made during the development of ReleaseGuard Mini.

---

## DECISION 001: Target Application Selection
- **Choice**: `cypress-io/cypress-realworld-app` (commit `79aa5b126fdd951aab2263c8201b52aeb5f2a43c`).
- **Rationale**: Production-grade fullstack TypeScript application (React 18, Vite, Express, lowdb, JWT auth, WebSockets). It accurately mirrors the real-world complexity of small SaaS client applications (accounts, transactions, notifications, responsive sidebars, settings).
- **Attribution Boundary**: Released under the MIT License (Copyright 2020 Cypress.io). Third-party boundaries are explicitly declared in `THIRD_PARTY_NOTICES.md` and repository copy.

---

## DECISION 002: Scope Boundary & Radical Minimalism
- **Choice**: Playwright + TypeScript + Chromium only. Playwright native HTML report. Zero Allure, zero Docker, zero Kubernetes, zero Cucumber/BDD.
- **Rationale**: Small SaaS founders and solo developers hiring on freelance platforms want fast, transparent, zero-friction regression testing. Heavy reporting frameworks (Allure) or containerization (Docker) increase setup failure rates and obfuscate failure traces. Native Playwright traces and videos provide 100% of the forensic proof required.

---

## DECISION 003: Deterministic Data Reset Strategy
- **Choice**: Call backend seed endpoint `POST http://localhost:3001/testData/seed` in `test.beforeEach` and enforce `workers: 1` sequential execution.
- **Rationale**: The target application uses LowDB 1.0.0 with in-memory synchronization. Overwriting `database.json` via shell while Express is running causes in-memory cache desynchronization. Running parallel workers against a shared file-based database leads to cross-test race conditions. The HTTP seed endpoint cleanly executes `db.setState(testSeed).write()` in memory, delivering 100% deterministic test isolation.

---

## DECISION 004: Invariant-Based Assertions Over UI Strings
- **Choice**: Assert real business side-effects rather than superficial toast messages or button clicks.
- **Examples**:
  - Payment execution verifies mathematical balance deduction in the sidebar (`new_balance === old_balance - payment_amount`).
  - Profile updates perform a full browser `page.reload()` to verify server-side database storage rather than transient React state.
  - Notification dismissal verifies that the unread badge count decrements and remains decremented across page transitions.

---

## DECISION 005: Synthetic Regression Target & Provenance
- **Choice**: Intentionally mutate `UserSettingsForm.tsx` to drop `firstName` during update dispatch.
- **Rationale**: Proves that the regression suite is sensitive to broken persistence. A naive test checking only that the "Save" button was clicked would pass; ReleaseGuard's reload persistence check failed immediately with Exit Code 1, generating full screenshot, video, and trace evidence. Strict provenance was maintained: the test existed before the mutation, and only one application file was touched.

---

## DECISION 006: Framing the BOLA Authorization Vulnerability (`DEF-SEC-01`)
- **Choice**: Document `DEF-SEC-01` as an authorization boundary defect discovered during multi-user functional testing, explicitly clarifying that ReleaseGuard provides pre-launch QA rather than dedicated penetration testing.
- **Rationale**: Preserves the immense consulting value of uncovering a critical IDOR/BOLA exploit in the target API without falsely claiming out-of-scope security testing services.

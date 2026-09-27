# ReleaseGuard Mini
### SaaS Pre-Launch QA + Playwright Critical-Flow Regression Gate

[![Playwright](https://img.shields.io/badge/Playwright-1.58.2-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: 12/12 Passing](https://img.shields.io/badge/Tests-12%2F12%20Pass%20(38s)-brightgreen)](docs/SCOPE_AND_TEST_PLAN.md)
[![Stability: 48/48 Observed Passes](https://img.shields.io/badge/Stability-48%2F48%20Observed%20Passes-success)](GPT_REVIEW_LOG.md)

> **"Will this release break our core product and lose customer trust on Day 1?"**  
> ReleaseGuard Mini turns release uncertainty into a **deterministic 38-second pre-launch regression gate** that catches breaking bugs before your users do.

---

## 🎯 What This Project Proves (Client-First Proof of Work)

If you are a **SaaS Founder**, **Solo Developer**, or **Product Lead** hiring on Fiverr, Upwork, or Contra, you don't need 500 lines of brittle test code that fails tomorrow. You need someone who can:

1. **Quickly Understand Your Web App**: Jump into an unfamiliar full-stack codebase and identify the revenue-critical failure modes.
2. **Design High-Impact QA Scope**: Prioritize the flows that matter (Auth, Payments, Notifications, Settings) rather than superficial click-around testing.
3. **Build Deterministic Playwright Tests**: 12 critical-flow tests running in **~38 seconds** with **48/48 observed passes across four consecutive controlled runs** under deterministic seed isolation.
4. **Deliver Undeniable Forensic Proof**: Automatic screenshots, videos, and millisecond Playwright trace archives whenever a test fails.
5. **Surface Functional Issues & Code-Review Risks**: Identify functional defects and code-review risks (e.g. cross-user authorization boundary risks, non-atomic financial writes) before going to production.

---

## 🛡️ The 4 Mission-Critical Business Flows Guarded

```
[ReleaseGuard Pre-Launch Regression Gate]
 ├── FLOW 1: Authentication & Session Lifecycle (3 tests)
 │    ├── Valid credential authentication & dashboard redirect
 │    ├── Invalid credential rejection with prominent error feedback
 │    └── Secure session termination (logout) & route protection
 │
 ├── FLOW 2: Financial Transactions & Payment Execution (4 tests)
 │    ├── Peer-to-peer payment execution with instant confirmation
 │    ├── Client-side validation: disabled submit on empty amount/note
 │    ├── Transaction ledger persistence in personal feed
 │    └── Exact mathematical balance deduction check in sidebar ($1,509.53 -> $1,484.53)
 │
 ├── FLOW 3: Notifications & Real-Time Activity (2 tests)
 │    ├── Notification feed rendering with unread badge count
 │    └── Notification dismissal with synchronous unread decrement
 │
 └── FLOW 4: User Profile & Account Settings Persistence (2 tests)
      ├── Profile field update with browser reload persistence check
      └── Email regex validation blocking invalid submissions
```

*Total Test Suite Runtime: **38.6 seconds** (Single Worker, Deterministic Database Reset).*

---

## 🔍 Pre-Launch QA Findings & Code Review Notes

During exploratory testing and source inspection of the target application, ReleaseGuard documented findings across three clear categories:

| ID | Category | Component | Summary |
|---|---|---|---|
| **OFD-01** | Observed Functional Defect | Notification Feed | Irreversible notification dismissal with no archive or read history view in UI. |
| **OFD-02** | Observed Functional Defect | Sidenav Balance | Transient visual balance display lag (~200ms) on rapid post-payment page redirect. |
| **CRR-01** | Code Review Risk | User & Txn Routes | Missing explicit user ID comparison in `PATCH /users/:userId` and `GET /transactions/:transactionId`. |
| **CRR-02** | Code Review Risk | Database Layer | Non-atomic multi-statement ledger writes in file-based storage. |
| **CRR-03** | Code Review Risk | Request Validators | Silent decimal cents truncation via backend `.toInt()` coercion. |
| **TMN-01** | Testability Note | Transaction Step Two | Material-UI `data-test` mounting on outer container `<div>` instead of native `<input>`. |

*Full technical details and code references in [docs/QA_FINDINGS.md](docs/QA_FINDINGS.md).*

---

## 🚨 Controlled Synthetic Regression Drill (Proof of Sensitivity)

To prove that this test suite is sensitive and catches real defects, we conducted a controlled drill:
- **Injected Defect**: Intentionally omitted `firstName` during profile update dispatch in `src/components/UserSettingsForm.tsx`.
- **Automated Detection**: ReleaseGuard's `TC-PROF-01` caught the missing database persistence and failed with **Exit Code 1**.
- **Preserved Forensics**: Playwright automatically packaged 4 evidence artifacts:
  - 📸 **Failure Screenshot**: Visual DOM freeze (`assets/evidence/synthetic-regression/failure-screenshot.png`)
  - 🎥 **Execution Video**: Full video playback (`assets/evidence/synthetic-regression/failure-video.webm`)
  - 🔍 **Playwright Trace**: Interactive time-travel debugger (`assets/evidence/synthetic-regression/failure-trace.zip`)
  - 📝 **Error Context**: Complete failure call stack (`assets/evidence/synthetic-regression/error-context.md`)
- **Restored**: Bug fixed, suite re-verified 100% Green (`Exit Code 0`).

*Read the full drill report in [docs/SYNTHETIC_REGRESSION.md](docs/SYNTHETIC_REGRESSION.md).*

---

## ⚡ Quick Start (Run Locally in 3 Steps)

### Prerequisites
- Node.js v20+ or v24
- Target application running on `http://localhost:3000` (API on `http://localhost:3001`)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser binary
npx playwright install chromium

# 3. Run the full regression gate
npx playwright test
```

### View Interactive HTML Report
```bash
npx playwright show-report
```

---

## 📦 Project Architecture & Page Object Model (POM)

```text
releaseguard-mini/
├── .github/workflows/
│   └── e2e.yml               # GitHub Actions CI/CD regression pipeline
├── assets/
│   ├── evidence/             # Failure screenshots, traces, and videos
│   └── screenshots/          # Baseline execution proofs
├── docs/
│   ├── SCOPE_AND_TEST_PLAN.md# Risk-weighted testing scope & mapping
│   ├── QA_FINDINGS.md        # Real exploratory defect findings & code-review risks
│   ├── SYNTHETIC_REGRESSION.md# Controlled regression drill forensics
│   ├── CLIENT_HANDOFF.md     # Executive GO/HOLD delivery package
│   └── CASE_STUDY.md         # Full client-facing portfolio case study
├── fixtures/
│   └── test-data.ts          # Deterministic test accounts & payloads
├── pages/                    # Clean Page Object Model
│   ├── auth.page.ts
│   ├── transaction.page.ts
│   ├── notifications.page.ts
│   └── profile.page.ts
├── tests/                    # Critical-flow regression specs
│   ├── auth.spec.ts
│   ├── transactions.spec.ts
│   ├── notifications.spec.ts
│   ├── profile.spec.ts
│   └── smoke.spec.ts
├── marketplace/              # Fiverr / Upwork / Contra gig copy
│   ├── FIVERR.md
│   ├── UPWORK.md
│   └── CONTRA.md
├── templates/                # Reusable client intake & handoff templates
├── portfolio/
│   └── index.html            # Standalone visual portfolio showcase
├── playwright.config.ts      # Strict sequential & trace-on-failure config
├── THIRD_PARTY_NOTICES.md    # Transparent open-source attribution
└── GPT_REVIEW_LOG.md         # Independent technical reviewer audit trail
```

---

## 💼 Freelance Service Packages

Available for hire on **Fiverr**, **Upwork**, and **Contra**:

| Package | Price | Deliverables | Turnaround |
|---|---|---|---|
| **Starter Smoke Gate** | **$49** | 1 Critical Flow (Auth + Core Journey), POM structure, Local run instructions, Bug Report if found. | 2 Days |
| **Standard Pre-Launch Guard** | **$89** | 3 Critical Flows, Deterministic Test Isolation, Visual HTML Report, CI/CD Workflow (`.github/workflows/e2e.yml`), Defect Report. | 3 Days |
| **Flagship Pre-Launch Suite** | **$149** | 5 Critical Flows, Full Failure Forensics (Trace/Video), Complete Client Handoff, Exploratory Code Review & Defect Report, Executive GO/HOLD Verdict. | 5 Days |

👉 **Ready to secure your release?** Connect on Upwork or message directly for an immediate pre-launch assessment.

---

## ⚖️ Open-Source Attribution & Disclaimer

- The target application used as the demonstration subject for this portfolio is the open-source [Cypress Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) (commit `79aa5b126f`), licensed under the **MIT License** (Copyright © 2020 Cypress.io).
- **Independent Portfolio Work**: All test plans, Playwright automation suites, Page Object Models, exploratory defect evaluations, and ReleaseGuard tooling were authored independently.
- **No Affiliation**: This project is not affiliated with, sponsored by, or endorsed by Cypress.io.

---

*Engineered with precision by ReleaseGuard Mini.*

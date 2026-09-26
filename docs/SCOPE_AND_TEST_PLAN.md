# Scope & Test Plan: ReleaseGuard Mini

## 1. Executive Summary
- **Target Application**: Cypress Real-World App (RWA) — Modern Fullstack Payment & Social Transfer SaaS
- **Target Architecture**: React (Vite 8), Express.js, TypeScript, lowdb/SQLite backend, JWT/Cookie auth
- **Target URL**: `http://localhost:3000` (API: `http://localhost:3001`)
- **QA Objective**: Validate 4 mission-critical commercial user flows before public launch, detect regressions, and establish an automated Playwright suite with zero flakiness.

---

## 2. Scope Boundaries

### In Scope (Critical User Journeys)
1. **FLOW 1: Authentication & Session Lifecycle**
   - Valid credential login (`Heath93` / `s3cret`)
   - Invalid credential rejection with user feedback ("Username or password is invalid")
   - Session persistence across page reloads
   - Secure logout and redirection to `/signin`
2. **FLOW 2: Financial Transaction & Payment Execution**
   - Recipient selection from active contact list (`Arvilla_Hegmann`)
   - Form validation: positive amount constraint and required transaction note
   - Payment execution with instant UI confirmation ("Transaction Submitted!")
   - Immediate verification in Personal transaction ledger (`/personal`)
   - Account balance deduction verification
3. **FLOW 3: Notifications & Real-Time Activity Feed**
   - Generation of visible notification records upon payment events
   - Viewing notification list (`/notifications`)
   - Verification of notification item details and dismissal / mark-as-read state
4. **FLOW 4: User Profile & Account Settings Persistence**
   - Access to user settings (`/user/settings`)
   - Field updates: First Name, Last Name, Email address, Phone number
   - Input validation (valid email format, valid phone format)
   - Save confirmation and hard page refresh persistence verification

### Out of Scope (Explicit Guardrails)
- **Security Penetration Testing**: SQL injection, XSS payloads, token cracking, or privilege escalation.
- **Performance & Load Testing**: Concurrency spikes, DDoS simulations, or stress testing.
- **Production Payment Processors**: Live Stripe/Plaid bank account integration or real money transfer.
- **Native Mobile Apps**: Dedicated iOS/Android APK/IPA testing.
- **Broad Multi-Browser Matrix**: Firefox and WebKit are excluded from V1; Chromium is the primary commercial target.

---

## 3. Environment & Test Data Strategy
- **Baseline Users**:
  - Primary Sender: `Heath93` (Password: `s3cret`, Starting Balance: ~$1,509.53)
  - Primary Recipient: `Arvilla_Hegmann` (Password: `s3cret`)
  - Secondary User: `Dina20` (Password: `s3cret`)
- **Database Reset**: Automated `ncp ./data/database-seed.json ./data/database.json` executable before test runs.
- **Execution Mode**: Sequential worker execution (`workers: 1`) to guarantee deterministic ledger state without concurrent write races.

---

## 4. Risks & Mitigations
| Risk | Potential Impact | Mitigation Strategy |
|---|---|---|
| lowdb file concurrency | Race condition during parallel database writes | Enforce sequential execution (`fullyParallel: false, workers: 1`) |
| Async animation delays | Flaky locator clicks during Material UI drawer transition | Use Playwright web-first assertions (`toBeVisible()`) rather than sleep timeouts |
| Stale cached state | Test data leakage between test suites | Independent test setups and clean database seeding between test runs |

---

## 5. Exit Criteria & Definition of Done
1. **Suite Stability**: 8–12 automated tests covering all 4 critical flows.
2. **Deterministic Quality**: 3 consecutive full-suite runs pass with 0 retries and 0 flakiness.
3. **Evidence Artifacts**: Automatic traces and screenshots captured on failure; native HTML report generated.
4. **CI Readiness**: GitHub Actions workflow prepared and locally verified.

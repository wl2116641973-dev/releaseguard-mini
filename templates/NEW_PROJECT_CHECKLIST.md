# Client Project Execution Checklist

A structured 8-stage operational checklist for delivering pre-launch QA and Playwright regression projects on Fiverr, Upwork, and Contra.

---

### Stage 1: Intake & Scope Verification
- [ ] Receive completed CLIENT_INTAKE.md from client.
- [ ] Confirm staging URL is reachable and test credentials work.
- [ ] Agree on the 3–5 critical flows to be tested.
- [ ] Verify test database reset/seed procedure.
- [ ] Confirm scope boundaries (Chromium web only, no penetration/load testing).

### Stage 2: Initial Smoke Test & Exploration
- [ ] Execute 15-minute exploratory walkthrough of primary user journeys.
- [ ] Verify core API endpoints return expected response payloads.
- [ ] Confirm no baseline blockers exist before deep QA.

### Stage 3: Structured Functional QA
- [ ] Test critical flows with valid, boundary, and invalid inputs.
- [ ] Verify form error states and validation messaging.
- [ ] Test persistence across browser refresh and logout/login.
- [ ] Document all observed defects in QA_FINDINGS.md with screenshots and logs.

### Stage 4: Test Architecture & Automation Plan
- [ ] Author project-specific SCOPE_AND_TEST_PLAN.md.
- [ ] Model page objects (POM) strictly for high-frequency interactive components.
- [ ] Define isolated fixtures and authentication storage states.

### Stage 5: Playwright Test Implementation
- [ ] Implement 8–12 robust tests targeting business behaviors.
- [ ] Enforce user-facing locators (getByRole, getByLabel, getByPlaceholder).
- [ ] Enforce web-first assertions; eliminate all hardcoded sleep timeouts.

### Stage 6: Stability & Flakiness Gate
- [ ] Execute Run 1 (full suite).
- [ ] Execute Run 2 (full suite).
- [ ] Execute Run 3 (full suite).
- [ ] Ensure 3 consecutive runs PASS with 0 intermittent failures.

### Stage 7: CI/CD Pipeline Integration
- [ ] Configure .github/workflows/e2e.yml.
- [ ] Validate headless execution, artifact upload, and failure trace capture.

### Stage 8: Handoff & Client Delivery
- [ ] Compile CLIENT_HANDOFF.md with exact execution instructions.
- [ ] Package Playwright HTML report and evidence artifacts.
- [ ] Deliver with clear, professional communication.

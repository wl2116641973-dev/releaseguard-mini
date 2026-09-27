# QA Scope & Test Plan: [Project Name]

## 1. Executive Summary
- **Target Application**: [Application Name / Staging URL]
- **QA Objective**: Validate core commercial journeys before launch and establish automated regression guards.
- **Testing Period**: [Date Range]
- **Deliverables**: Manual QA Findings, Playwright Regression Suite, CI/CD Integration, Handoff Report.

## 2. Scope Boundaries

### In Scope
- Core user authentication & session integrity
- Primary transaction / purchase / creation workflow
- Notification & activity feed verification
- User profile & settings persistence
- Form validation & edge case input handling

### Explicitly Out of Scope
- Security penetration testing & vulnerability scanning
- Load & stress performance testing
- Production payment processor live card transactions
- Native mobile device testing (unless desktop web responsive is requested)
- Broad multi-browser matrix beyond target browser (default: Chromium)

## 3. Critical User Flows
| Flow ID | Journey Name | Business Impact | Verification Method |
|---|---|---|---|
| FLOW-01 | Authentication & Session | Prevents unauthorized lockout and account access | Automated Playwright |
| FLOW-02 | Core Commercial Action | Validates revenue/transaction completion | Automated Playwright |
| FLOW-03 | Activity & Notifications | Confirms event dispatch and user auditability | Automated Playwright |
| FLOW-04 | User Settings Persistence | Guards data integrity upon refresh/re-login | Automated Playwright |

## 4. Test Environment & Prerequisites
- **Base URL**: 
- **Database State**: Seeded / Isolated sandbox
- **Test Accounts**: Dedicated regression users

## 5. Exit Criteria & Definition of Done
1. All critical flows automated with web-first assertions.
2. 3 consecutive automated test runs pass without flaky failures.
3. All discovered defects documented with reproduction steps and evidence.
4. Clean CI execution pipeline verified.

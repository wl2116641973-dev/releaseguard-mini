# Technical Architecture & Trade-Off Decisions

## DECISION 001: Target Application Selection
- **Choice**: cypress-io/cypress-realworld-app
- **Rationale**: Production-grade fullstack TypeScript app (React, Express, Lowdb/SQLite backend, JWT auth, WebSockets). It represents the exact complexity profile of client SaaS apps (accounts, authentication, financial transactions, notifications, responsive sidebar, user settings).
- **Attribution**: MIT License. Must clearly attribute original authorship in THIRD_PARTY_NOTICES.md and portfolio copy.

## DECISION 002: Scope Boundary & Minimalism
- **Choice**: Chromium only, Playwright native HTML report, zero Allure/Docker/K8s/BDD overhead.
- **Rationale**: Freelance clients buying pre-launch QA (-) want zero friction, clear failure traces, and immediately actionable bug reports. Bloat reduces transparency and increases setup failure.

# ReleaseGuard Mini — 3-Minute Video Demo & Loom Walkthrough Script

**Audience**: SaaS Founders, Solo Developers, and Product Leads hiring on Upwork, Fiverr, or Contra  
**Target Video Duration**: 2:45 – 3:00 minutes  
**Tone**: Confident, direct, technical yet business-focused. No jargon filler.  

---

## Scene 1: The Hook & The Release Dilemma (0:00 – 0:30)

**[Screen Visual]**:  
Full screen webcam or side-by-side with the ReleaseGuard `portfolio/index.html` hero section.

**[Narration Script]**:  
> "Hey there! If you're building a SaaS or Web application and preparing for launch, you know the sinking feeling right before deployment: *'Did we just break user authentication? Did our last commit break payments or profile settings?'*
> 
> Most founders rely on manual clicking or hire junior freelancers who hand over 50 lines of brittle code that breaks the next week.
> 
> My name is [Your Name], and this is **ReleaseGuard Mini**—a deterministic, 38-second pre-launch regression gate engineered with Playwright and TypeScript that catches critical bugs before your users do."

---

## Scene 2: The 4 Mission-Critical Business Flows (0:30 – 1:15)

**[Screen Visual]**:  
Switch to VS Code terminal. Run `npx playwright test`. Split-screen showing tests passing in Chromium.

**[Narration Script]**:  
> "Instead of writing superficial tests that only check if a button exists, I focus on the 4 flows that protect your revenue and reputation:
> 
> 1. **Authentication & Session Lifecycle**: Making sure users can log in, invalid logins are rejected, and logouts securely invalidate access.
> 2. **Financial Transactions**: Executing peer-to-peer payments, asserting client validation, and mathematically verifying sidebar balance deduction—here deducting exactly twenty-five dollars from the ledger.
> 3. **Real-Time Notifications**: Verifying that dismissals decrement unread badges and don't resurrect on refresh.
> 4. **Account Settings Persistence**: Testing that profile edits survive a full browser reload, proving backend database persistence.
> 
> Watch the terminal: All 12 tests run sequentially with deterministic database resets in **under 39 seconds**. Zero flakiness. 100% repeatable."

---

## Scene 3: Undeniable Failure Evidence & Trace Viewer (1:15 – 2:05)

**[Screen Visual]**:  
Open Playwright Trace Viewer showing `assets/evidence/synthetic-regression/failure-trace.zip`. Hover over timeline showing DOM snapshots and console logs.

**[Narration Script]**:  
> "Now, here's what happens when a real bug hits your code.
> 
> In this controlled drill, we simulated a common developer mistake: accidentally omitting the `firstName` field when updating profile settings. 
> 
> Our regression gate immediately caught the missing database persistence, failed with **Exit Code 1**, and automatically generated this forensic package:
> 
> - A visual screenshot of the exact failure state.
> - A full session video.
> - And this interactive Playwright Trace. Look at this: your developers can step forward and backward in time, inspect every DOM mutation, check network requests, and fix the bug in minutes without ever asking 'can you reproduce that?'"

---

## Scene 4: Beyond Automation — Real Security & Architecture Findings (2:05 – 2:35)

**[Screen Visual]**:  
Switch to `docs/QA_FINDINGS.md` highlighting `DEF-SEC-01` and `DEF-01`.

**[Narration Script]**:  
> "When you hire me, you don't just get an automation script runner. You get a pre-launch QA partner.
> 
> During exploratory testing of this target app, I uncovered a critical **BOLA authorization vulnerability** in the API—`PATCH /users/:userId` had no ownership check, meaning any authenticated user could overwrite another user's profile. I also flagged that payment mutations weren't atomic, risking ledger desyncs.
> 
> Finding these before launch saves you from catastrophic public security disclosures."

---

## Scene 5: The Offer & Next Steps (2:35 – 3:00)

**[Screen Visual]**:  
Switch back to `marketplace/UPWORK.md` or portfolio pricing grid ($49 / $89 / $149).

**[Narration Script]**:  
> "Whether you need a quick 2-day smoke gate for $49, or a full 5-flow regression suite with CI/CD integration and a security audit for $149, I can have this running on your app this week.
> 
> Drop me a message on Upwork or Fiverr with a link to your staging app or repository, and let's make sure your next launch is completely stress-free. Thanks for watching!"

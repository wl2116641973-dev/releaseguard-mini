# Client Project Intake Form

Thank you for choosing **ReleaseGuard Mini** for your pre-launch QA and automated regression testing. To get started promptly, please complete the brief questions below.

> [!CAUTION]
> **Security Notice**: Please **DO NOT** provide production credentials, real API secret keys, or live payment credentials. Testing should always occur on a staging, sandbox, or preview environment with test data.

---

### 1. Target Environment
- **Staging / Test URL**: 
- **Basic Auth / VPN Requirements (if any)**: 

### 2. Test Accounts & Access
- **Test User Account(s)** (Username / Password):
- **User Role(s) for testing** (e.g., Admin, Regular User, Buyer):
- **Multi-Factor Authentication (MFA)**: (Please disable MFA for test accounts or provide temporary bypass tokens).

### 3. Critical User Flows (Top 3–5)
*Which business-critical user journeys must never fail upon deployment?*
1. **Flow 1**: 
2. **Flow 2**: 
3. **Flow 3**: 
4. **Flow 4**: 
5. **Flow 5**: 

### 4. Expected Behavior & Business Rules
*Any specific business logic, validation constraints, or expected responses?*
- 

### 5. Known Issues / Expected Warnings
*Are there existing bugs or incomplete features we should ignore?*
- 

### 6. Test Data & Database Reset
- **How should test data be managed or reset between test runs?**
  - [ ] Dedicated test data that persists
  - [ ] Database reset script / seed endpoint provided
  - [ ] Self-contained test accounts that create temporary data

### 7. Delivery Target & Deadline
- **Target Release Date / Deadline**: 
- **Timezone**: 

### 8. Repository / CI Access (For Automation Packages)
- **GitHub / GitLab repo URL** (if CI pipeline setup is purchased):
- **Access Granted As**: (Collaborator / Read-Write Deploy Key)

### 9. Guardrails & Restrictions
*What must NOT be touched or modified during testing?*
- (e.g., Do not delete existing user groups, do not trigger third-party webhooks outside staging)

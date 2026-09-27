# ReleaseGuard Mini — 45–60s High-Impact Video Demo Script

**Format**: Fast-Paced Screen Recording + Voiceover (Loom / OBS / Screen Studio)  
**Total Duration**: ~55–60 Seconds  
**Audience**: SaaS Founders & Engineering Leads hiring on Upwork, Fiverr, and Contra  
**Resolution**: 1920x1080 @ 60fps | Terminal Zoom: 125%  

---

## 🎬 7-Scene Storyboard & Narration

### 镜头 1: 正常应用运行 (0:00 – 0:08 | 8s)
- **画面 (Visual)**: 浏览器全屏展示待测 SaaS 平台 (`cypress-realworld-app`)，展示用户仪表盘、侧边栏余额 `$1,475.00` 和交易列表正常渲染。
- **旁白 (Voiceover - English)**:
  > *"This is an open-source full-stack payment application used as a realistic QA target. Everything looks fine on the surface—until someone pushes a broken commit right before launch."*
- **解说提示**: 快速滑动展示正常页面，不要停留。

---

### 镜头 2: 人为注入回归故障 (0:08 – 0:18 | 10s)
- **画面 (Visual)**: 切到 VS Code 编辑器，打开 `cypress-realworld-app/src/components/UserSettingsForm.tsx`，高亮并注释掉更新请求中的 `firstName: values.firstName`。保存文件。
- **旁白 (Voiceover - English)**:
  > *"Let's inject a classic developer mistake: silently omitting the first name field during account settings dispatch."*
- **解说提示**: 鼠标动作干脆，保存文件时触发热重载。

---

### 镜头 3: 自动化测试跑挂，展示失败证据 (0:18 – 0:28 | 10s)
- **画面 (Visual)**: 切到终端执行 `npx playwright test`。测试执行到 `TC-PROF-01` 时红字爆出 `1 failed`，进程以 Exit Code 1 中断。紧接着切到 Playwright Trace Viewer，展示失败发生时的 DOM 抓拍、网络请求和错误堆栈。
- **旁白 (Voiceover - English)**:
  > *"We run the pre-launch gate. Boom—Exit Code 1. Playwright immediately catches the regression and captures undeniable forensic evidence: failure screenshot, session video, and DOM trace."*
- **解说提示**: 放大展示红色的 `Exit Code 1` 与 Trace Viewer 里的红框断言。

---

### 镜头 4: 快速修复代码 (0:28 – 0:38 | 10s)
- **画面 (Visual)**: 切回 VS Code，快速取消注释 `firstName: values.firstName`，保存文件恢复正常代码。
- **旁白 (Voiceover - English)**:
  > *"With the exact line of failure pinpointed, the developer fixes the payload and commits the change in seconds."*
- **解说提示**: 敲击一次 `Ctrl+Z` 或取消注释，保存，干净利索。

---

### 镜头 5: 重新运行自动化测试全部 PASS (0:38 – 0:48 | 10s)
- **画面 (Visual)**: 切回终端重新执行 `npm test`。12 个测试顺序疾速执行，绿色对勾逐行飞刷。
- **旁白 (Voiceover - English)**:
  > *"We re-trigger the suite. Every critical flow—auth, payments, notifications, and settings—runs against a deterministic seeded state."*
- **解说提示**: 终端字体清晰，绿色的进度条连续滚动。

---

### 镜头 6: 展示 12 个测试全部通过的结果 (0:48 – 0:55 | 7s)
- **画面 (Visual)**: 终端打印 `12 passed (~38s)`。切出原生的 Playwright HTML Test Report，全绿卡片一览无余。
- **旁白 (Voiceover - English)**:
  > *"All 12 critical tests pass in 38 seconds. Across four controlled full-suite runs, all 48 observed test executions passed without a flaky failure. Your release gate is officially green."*
- **解说提示**: 镜头稍作定格在 `12 passed` 与 HTML 报告页面。

---

### 镜头 7: 个人品牌与接单号召 (0:55 – 1:00 | 5s)
- **画面 (Visual)**: 切到个人 Portfolio 首页或品牌尾页卡片：“ReleaseGuard Mini — Pre-Launch QA & Playwright Automation | Available on Upwork, Fiverr & Contra”。
- **旁白 (Voiceover - English)**:
  > *"I'm [Your Name]. Let's protect your launch day together. Find me on Upwork and Fiverr."*
- **解说提示**: 露出头像/主页与平台链接，干脆利落结束。

---

## 🛠️ 录制准备 Checklist (录制前 1 分钟确认)
1. 目标应用已启动并在 `http://localhost:3000` 正常访问。
2. 运行一次 `corepack yarn test:seed` 确保初始测试数据干净。
3. 终端窗口调至 125% 缩放，配色使用清晰的深色高对比主题。
4. 预先开好 Trace Viewer 窗口与 HTML Report 窗口，避免现场录制加载等待。

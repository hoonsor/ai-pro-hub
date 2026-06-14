# ANTIGRAVITY 專案架構與開發指引

此文件由 Google Antigravity Architect 自動建立並維護，用於定義 **監控AI各專案進度之網站 (ai-pro-hub)** 專案的技術架構、目錄結構、資料流以及 AI 代理人的開發規範。

---

## 📖 專案概述 (Overview)

本專案是一個用來集中監控並管理 `hoonsor` 本地端所有 AI 開發專案與全域技能庫（Global Skills）的 Next.js 儀表板系統。
- **專案名稱**：監控AI各專案進度之網站
- **GitHub 倉庫**：https://github.com/hoonsor/ai-pro-hub
- **線上部署網址**：https://aiprohub.vercel.app/

---

## 🛠 技術棧與版本 (Tech Stack & Versions)

- **前端框架**: React 19.2.4 + Next.js 16.2.4 (App Router)
- **樣式與動畫**: Tailwind CSS v4, Framer Motion 12.38.0
- **圖示庫**: Lucide React 1.8.0
- **資料庫與 ORM**: Neon PostgreSQL + Prisma ORM 6.19.3
- **身份驗證**: Clerk SDK (^7.2.1)
- **自動化腳本**: Python 3.8+ (全域專案監控技能)

---

## 📁 核心目錄結構 (Directory Structure)

```text
/
├── prisma/             # Prisma Schema 與資料庫遷移設定
│   └── schema.prisma   # 定義 Project 與 PlanRevision 關聯模型
├── public/             # 靜態資源與前端 JSON 資料源
│   └── data/           # 前端 Fetch 讀取的 JSON 資料源 (重要)
│       ├── projects.json      # 本地各專案的基本資料、最近 commits 與任務進度
│       ├── skills.json        # 所有全域技能與工作流的完整解析資料
│       ├── skills_slim.json   # 供前端快速載入的輕量化技能資料 (不含原始碼)
│       ├── tag_counts.json    # 各個功能標籤下對應的技能數量統計
│       └── sync_report.json   # 最近一次專案/技能同步的時間戳記與報告
├── scripts/            # 本地任務計畫同步腳本
│   ├── sync-plan.js    # 將本地 ACTIVE_TASKS.md 計畫上傳至遠端資料庫
│   └── pull-plan.js    # 從遠端資料庫拉取最新計畫並寫回本地 ACTIVE_TASKS.md
└── src/
    ├── app/            # Next.js App Router 頁面與 API
    │   ├── api/sync/   # 計畫雙向同步 API 端點
    │   ├── page.tsx    # 入口頁面 (ClientOnly)
    │   └── layout.tsx  # 全域版面與字型載入
    ├── components/     # UI 元件與視圖 (Views)
    │   ├── layout/     # Header, ThemeProvider 等
    │   └── views/      # DASHBOARD, PROJECTS, SKILLS, WORKFLOW, SYSTEM 頁籤面板
    ├── hooks/          # 自訂 React Hooks (主要是 useDashboardData.ts)
    └── lib/            # 工具函式與 PrismaClient 單例實例
```

---

## 🔄 核心資料流與工作流 (Data Flow & Workflows)

### 1. 專案與技能掃描工作流 (Data Sync Workflow)
1. 執行全域技能 `hoonsor-project-monitor` 的 `sync_to_website.py`。
2. 掃描 `D:\01-Project` 下所有專案目錄 the `PROJECT_STATUS.md`，將結果輸出至 `public/data/projects.json`。
3. 掃描全域技能庫與工作流，輸出至 `public/data/skills.json`。
4. 腳本自動呼叫 `retag_skills.py` 重新標記技能，產生輕量版的 `skills_slim.json` 與標籤計數 `tag_counts.json`。
5. 完成後透過 Git Push 提交至 GitHub，觸發 Vercel 自動建置與部署，網頁即時呈現最新狀態。

### 2. 互動式任務計畫同步工作流 (Interactive Plan Sync Workflow)
- **雲端編輯**：使用者可在「專案管理」頁籤點擊「編輯計畫」彈窗修改任務，同步後打到 `/api/sync`，將變更作為新修訂版 (Revision) 存入 Neon PostgreSQL 資料庫。
- **本地拉取**：本地執行 `npm run pull-plan`，將遠端資料庫的最新修訂版計畫覆寫本地 `ACTIVE_TASKS.md`。
- **本地推送**：本地修改 `ACTIVE_TASKS.md` 後執行 `npm run sync-plan`，將更新推送並保存至遠端資料庫。

---

## 🛡 AI 代理人開發規約 (Rules for Antigravity)

### 🟢 Always Do (務必遵守)
- 所有掃描產生的 JSON 資料必須輸出至 `public/data/` 目錄。**切勿**僅輸出至根目錄下的 `data/`。
- 修改專案原始碼後，必須進行 SemVer 版本遞增 (PATCH/MINOR/MAJOR)，並同步更新 `package.json` 中的 `"version"` 與 `PROJECT_STATUS.md` 的「版本號」與「版本歷程」表格。
- 提交代碼時，必須遵循 Conventional Commits 格式，並自動執行 `git push` 到遠端倉庫。

### 🟡 Ask First (需先詢問)
- 修改 `prisma/schema.prisma` 資料庫模型或執行 `prisma migrate` 之前。
- 引入新的全域狀態管理庫 (例如 Zustand/Redux) 之前。

### 🔴 Never Do (嚴禁行為)
- 嚴禁將 Clerk 密鑰、Neon 資料庫連線字串或 API 金鑰寫死在程式碼中。敏感變數必須配置在 `.env.local` 中且不得提交。
- 嚴禁在無 `PROJECT_STATUS.md` 的專案中直接進行原始碼修改。

---
*Last Updated: 2026-06-14 by Google Antigravity Architect*

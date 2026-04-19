# AI PRO HUB (專案進度監控網站)

> 提供基於玻璃擬態與響應式介面的專案管理儀表板，支援互動式任務計畫的雙向雲端同步 (CLI ↔ Web DB) 與即時圖形化編修。

## 📖 專案簡介 (Overview)

AI PRO HUB 是一個專為 AI 開發團隊量身打造的專案進度監控與任務計畫管理平台。本系統解決了開發者在終端機、本機編輯器與網頁端之間頻繁切換時，任務計畫難以即時同步的核心痛點。

系統採用雙軌獨立架構：`project-monitor` 技能負責掃描本機資料夾並維護 `PROJECT_STATUS.md`（包含版本號、描述、changelog），而 Web UI 編輯器與 CLI 工具則透過 Prisma 資料庫管理 `ACTIVE_TASKS.md`（互動式任務計畫），兩者完全獨立不互相干擾。

前端採用 Next.js 15 App Router 搭配玻璃擬態 (Glassmorphism) 設計語言，每張專案卡片均配備演化式鑽石進度指示器（共 6 段：原石 → 粗坯 → 初切 → 拋光 → 精緻 → 完美），以推送次數作為專案成熟度的量化依據。互動式任務編輯器支援主任務、子任務、注意事項三種類型，並提供樹狀展開/收合與自動換行的優雅體驗。

## ✨ 核心功能 (Key Features)

- **演化式鑽石進度指示器**：以 SVG 繪製 6 段鑽石成長視覺，從原石到完美鑽石，依提交次數自動升段
- **圖形化互動任務編輯器**：內建主任務 (☑)、子任務 (☑)、注意事項 (•) 三種類型，支援樹狀巢狀縮排與展開收合
- **雙向 CLI 同步機制**：`sync-plan`（推送本地任務至雲端）與 `pull-plan`（拉取最新版至 `ACTIVE_TASKS.md`）
- **雙軌獨立架構**：`PROJECT_STATUS.md` 由 project-monitor 管理，`ACTIVE_TASKS.md` 由 Web UI 管理，互不干擾
- **多主題視覺系統**：8 種主題（4 暗色 + 4 馬卡龍淺色），玻璃擬態卡片 + Framer Motion 動畫
- **Clerk 身份驗證防護**：所有任務編輯操作均通過 Next.js Server Actions 搭配 Clerk 進行安全授權

## 🛠 技術棧 (Tech Stack)

- **前端 / UI**：Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide React
- **後端 / API**：Next.js API Routes, Server Actions
- **資料庫與 ORM**：SQLite (本地開發) / Vercel Postgres, Prisma v6
- **身份驗證**：Clerk Auth
- **自動化工具**：Node.js ESM Scripts (Dotenv)

## 🚀 快速開始 (Quick Start)

### 環境要求
- Node.js >= 18
- 建立 `.env.local` 並填入以下金鑰：

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
SYNC_API_KEY=your_secret_key
DATABASE_URL="file:./dev.db"
```

### 安裝與運行
```bash
git clone https://github.com/hoonsor/ai-pro-hub.git
cd ai-pro-hub
npm install
npx prisma db push
npx prisma generate
npm run dev
```

### 任務計畫同步指令
```bash
npm run sync-plan   # 推送 ACTIVE_TASKS.md 至雲端資料庫
npm run pull-plan   # 從雲端資料庫拉取最新任務計畫至 ACTIVE_TASKS.md
```

## 📁 專案結構 (Project Structure)

```text
src/
 ├── actions/           # Server Actions (plan CRUD)
 ├── app/               # Next.js App Router + API endpoints
 │   ├── api/sync/      # 計畫同步 API (GET/POST)
 │   └── page.tsx       # 主頁面入口
 ├── components/
 │   ├── CommandEditorModal.tsx  # 圖形化任務樹狀編輯器
 │   └── views/
 │       └── ProjectsView.tsx    # 鑽石進度指示器 + 專案卡片
 └── hooks/             # useDashboardData
scripts/
 ├── sync-plan.js       # CLI 推送工具
 └── pull-plan.js       # CLI 拉取工具
prisma/                 # Schema + 本地資料庫
```

## 🔄 最新更新 (Recent Updates)

- **v0.4.x**: 架構分離 (`ACTIVE_TASKS.md` vs `PROJECT_STATUS.md`)；演化式鑽石進度指示器；圖形化任務樹狀編輯器（支援自動換行）；修正 Clerk middleware 路徑
- **v0.4.0**: 實作 Web UI Markdown 編輯器 (`CommandEditorModal`) 與 `pull-plan` CLI 下載機制
- **v0.3.0**: 系統遷移至 Next.js 15，整合 Prisma + Clerk，實作 `sync-plan` CLI

---
*Generated and maintained by Google Antigravity Architect*

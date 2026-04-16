# AI PRO HUB (專案進度監控網站)

> 提供基於玻璃擬態與響應式介面的專案管理儀表板，支援 Markdown 計畫檔案的雙向雲端同步 (CLI ↔ Web DB) 與即時編修。

## 📖 專案簡介 (Overview)
AI PRO HUB 是一個專為開發團隊量身打造的專案進度與文件監控平台。我們深知在快速迭代的 AI 與軟體專案中，開發者常需要於終端機、本機編輯器與網頁端之間切換，導致計畫與進度難以同步。

為了徹底解決這個痛點，本專案實作了完整的閉環交付機制 (Closed-loop Delivery)。除了透過極具設計感的折疊式卡片、微型圖表來展現多種專案的最新進度與子任務，我們更在系統底層整合了 Next.js Server Actions、Prisma 與遠端資料庫機制。不僅如此，透過開發出專屬的 CLI 工具 (`npm run pull-plan` / `npm run sync-plan`) 與前端內建的高階 Markdown 編輯器，開發者無論在哪都可以即時更新或同步專案狀態。這樣獨特且雙向的溝通體驗，使得跨裝置或跨環境的進度追蹤變得輕而易舉且同時確保最高層級的資料安全。

## ✨ 核心功能 (Key Features)
- **視覺化儀表板**：包含玻璃擬態設計、多重美觀主題（暗黑與馬卡龍淺色系），以及環狀進度指示器。
- **即時計畫編修器**：內建基於 `@uiw/react-md-editor` 的所見即所得 Markdown 編輯介面，能夠即時編輯各專案狀態。
- **CLI 雙向同步機制**：提供終端機指令 `sync-plan`（推送本地變更）及 `pull-plan`（拉取遠端最新版），實現毫秒級無縫部署。
- **歷史與版本控管追蹤**：記錄各專案的任務演進歷程與「已棄用方向」，防止知識開發斷層。
- **高度安全防護**：整合 Clerk 身份驗證與全域 API 授權金鑰防護，拒絕未授權的修改與 API 連線。

## 🛠 技術棧 (Tech Stack)
- **前端 / UI**：Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide React
- **後端 / API**：Next.js API Routes, Server Actions
- **資料庫與 ORM**：SQLite (Local dev) / Vercel Postgres, Prisma v6
- **權限與安全**：Clerk Auth
- **自動化與工具**：Node.js Scripts (Dotenv)

## 🚀 快速開始 (Quick Start)

### 環境要求
- Node.js >= 18
- 配置 `.env.local` 檔案以輸入對應的 Clerk 與 DB 金鑰 (包含 `SYNC_API_KEY`)

### 安裝與運行
```bash
# 1. 複製專案
git clone https://github.com/hoonsor/ai-pro-hub.git

# 2. 進入資料夾並安裝依賴
cd ai-pro-hub
npm install

# 3. 準備資料庫
npx prisma db push
npx prisma generate

# 4. 啟動開發伺服器
npm run dev
```

### 命令列同步工具 (CLI) 指令
- **推播計畫至雲端**：`npm run sync-plan`
- **拉取計畫至本機**：`npm run pull-plan`

## 📁 專案結構 (Project Structure)
```text
src/
 ├── actions/       # Server Actions (如 plan 操作)
 ├── app/           # Next.js App 路由系統與 API endpoints
 ├── components/    # 共用 UI，包含 Editor Modal 等
 ├── hooks/         # 自定義狀態邏輯
 ├── styles/        # 全域與 Tailwind 配置
 └── ...
scripts/            # CLI 同步指令執行環境
prisma/             # 資料庫 Schema Models 與本地資料
```

## 🔄 最新更新 (Recent Updates)
- **v0.4.0**: 實作 Web UI Markdown 編輯器 (`CommandEditorModal`) 與下載最新計畫之 CLI 指令 (`pull-plan`)。
- **v0.3.0**: 系統架構遷移至 Next.js 15，導入 Prisma (SQLite) 與 Clerk，實作 `sync-plan` CLI 同步工具。

---
*Generated and maintained by Google Antigravity Architect*

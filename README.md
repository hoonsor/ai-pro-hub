# 監控AI各專案進度之網站

> 這是一個基於 Next.js 的高效能儀表板系統，專為集中管理與監控 AI 開發專案與自動化技能所設計。

## 📖 專案簡介 (Overview)

這是一個用來集中監控並管理各個 AI 開發專案進度與技能使用情況的儀表板網站。主要功能包含自動解析各專案資料夾下的 PROJECT_STATUS.md 與各技能說明文件，並呈現直覺的卡片式總覽與詳細資料頁面。

本系統為解決多專案管理的分散痛點而生，讓開發者或專案經理能夠一目了然地掌握所有任務的完成度與技術細節。透過 Vercel 部署、Clerk 身份驗證以及動態的 Server Actions，系統能即時與雲端及本地端同步，確保任務計畫 `ACTIVE_TASKS.md` 的變更雙向暢通，大幅提升開發效率與專案透明度。

## ✨ 核心功能 (Key Features)

- **自動化專案掃描**：透過 Python 腳本自動爬取本地目錄，解析 `PROJECT_STATUS.md` 生成結構化資料供網站渲染。
- **技能中樞管理**：集中展示全域 AI 技能庫，具備標籤篩選與快速複製功能。
- **任務雙向同步**：支援在網頁端編輯任務計畫，並透過 API 與 CLI 工具 (`pull-plan`) 即時同步至本地 `ACTIVE_TASKS.md`，實現「雲端規劃、本地實作」的工作流。
- **系統與 MCP 狀態檢視**：展示 Antigravity 2.0 的操作教學（Slash Commands 與 Alias）、MCP 伺服器連線狀態及本機全域防呆與架構規則展示（支援一鍵複製與雙擊折疊）。
- **美觀的卡片式 UI**：採用深色玻璃擬態 (Glassmorphism) 設計風格，結合 Framer Motion 微動畫，提供頂級的使用者體驗。

## 🛠 技術棧 (Tech Stack)

- **前端 / UI**：Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **後端 / API**：Next.js Server Actions, Route Handlers
- **資料庫**：Neon PostgreSQL, Prisma ORM
- **建置工具 & 認證**：Vercel, Clerk

## 🚀 快速開始 (Quick Start)

### 環境要求
- Node.js >= 18
- PostgreSQL (建議使用 Neon)

### 安裝與運行
```bash
# 1. 複製專案
git clone https://github.com/hoonsor/ai-pro-hub.git

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

## 📁 專案結構 (Project Structure)
```text
src/
 ├── actions/       # Server Actions (例如：計畫同步邏輯)
 ├── app/           # Next.js 15 App Router (頁面與 API 端點)
 ├── components/    # 共通 UI 元件與視覺視圖 (views/)
 └── lib/           # 工具函數與 Prisma 客戶端
scripts/            # Node.js/Python 掃描與同步腳本
data/               # JSON 資料儲存區
```

## 🔄 最新更新 (Recent Updates)

- **v0.5.12** (2026-07-08)：參考軟體規格技術文件手冊格式，全面重構「系統設定」分頁中的技能觸發關鍵字與自動化工作流指南，詳列各指令語法、適用時機、防呆流程與對話輸入範例。
- **v0.5.11** (2026-06-16)：新增 `#喜好` 核心指令至系統設定頁籤，對齊全域指南與偏好設定庫。
- **v0.5.10** (2026-06-15)：新增 `#初始化` 核心指令說明，並更新 `#收工` 新增的 Vercel 主分支背景自動部署流程。
- **v0.5.9** (2026-06-14)：新增 `#合併` 核心指令說明至系統設定頁面，描述分支安全合併與自動推送流程。
- **v0.5.8** (2026-06-14)：擴大 suppressHydrationWarning 至 body 標籤，徹底解決 React 單層檢查所造成的屬性 mismatch 警告。
- **v0.5.5** (2026-06-14)：新增 `#分支` 核心指令至系統設定頁籤，並重新同步最新的 Git 分支狀態。
- **v0.5.4** (2026-06-14)：新增 `#架構`、`#開工`、`#收工`、`#狀態` 核心指令說明至系統設定頁面。
- **v0.5.3** (2026-06-14)：初始化 `ANTIGRAVITY.md` 引導指引文件，定義專案技術棧、核心資料流與開發規約。

---
*Generated and maintained by Google Antigravity Architect*

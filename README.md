# AI PRO HUB (監控 AI 各專案進度之網站)

> 這是一個基於 React 19 的高效能 AI 專案監控儀表板系統，為管理者與開發者提供即時的專案狀態綜覽。

## 📖 專案簡介 (Overview)

AI PRO HUB 專為擁有多個並行開發的 AI 專案管理者所設計，解決了難以統一監測分散專案狀態、追蹤每個專案版本與更新歷史的痛點。核心價值在於透過「單一真實資訊來源」（Single Source of Truth），結合微型圖表與互動式卡片，將隱藏在各處的 `PROJECT_STATUS.md` 等資料統整成直觀的網頁視圖。

在架構設計上，本專案採用 React 19 函數式元件搭配 Hooks 進行狀態管理，並結合 Vite 提供極速的開發體驗。介面設計遵循「玻璃擬態 (Glassmorphism)」美學，打造出清晰、舒適且具備現代感的深色風格。所有的 UI 更融入了高質感的微動畫與微互動，讓整體操作體驗更加沉浸與專業。

## ✨ 核心功能 (Key Features)

- **綜合概覽面板 (Dashboard Overview)**：首頁包含高階統計數據卡片、最近活動動態牆，以及各專案健康度的雷達或趨勢分析圖表，協助管理層迅速掌握大局。
- **動態專案卡片管理**：每一個專案以精美的卡片形式呈現，支援縮展功能顯示詳細的任務進度清單 (Sub-tasks)，並以進度列與圓餅圖呈現完成比例。
- **沉浸式主題切換**：透過全局環境設定 (Theme Context/Preferences)，管理員可隨時切換視覺主題風格，並在玻璃擬態介面上保持一致性與高辨識度。
- **自動化數據同步**：支援從本地開發環境讀取專案中繼資料 (如 package.json、PROJECT_STATUS.md)，自動化建構專案展示目錄。

## 🛠 技術棧 (Tech Stack)

- **前端 / UI**：React 19, Tailwind CSS 4, Framer Motion, Lucide React
- **網頁動畫與排版**：Vanilla CSS (玻璃擬態效果), class-variance-authority, clsx, tailwind-merge
- **建置工具**：Vite, TypeScript, ESLint

## 🚀 快速開始 (Quick Start)

### 環境要求
- Node.js >= 18 

### 安裝與運行
```bash
# 1. 複製專案
git clone <repository-url>

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

## 📁 專案結構 (Project Structure)
```text
src/
 ├── components/    
 │    ├── build/       # 用於構建頁面的輔助元件
 │    ├── common/      # 共通 UI 元件 (如按鈕、卡片背景)
 │    ├── layout/      # 整體佈局 (Sidebar, Topbar)
 │    └── views/       # 獨立的畫面或區塊 (DashboardOverview, ProjectsView 等)
 ├── data/             # 本地 mock 資料夾 (projects.json 等)
 ├── hooks/            # 狀態邏輯鉤子
 ├── lib/              # 工具函式 (如 cn 通用合併樣式)
 └── App.tsx           # 主程式進入點
```

## 🔄 最新更新 (Recent Updates)

- **v0.0.3 (2026-04-14)**: 新增專案進度管理及數據綁定更新，優化視覺佈局，生成專案 README
- **v0.0.2 (2026-04-11)**: Localizing And Optimizing AI Dashboard - 介面中文化與卡片排版最佳化
- **v0.0.0 (2026-04-11)**: implement HUD dashboard UI with glassmorphism and data integration

---
*Generated and maintained by Google Antigravity Architect*

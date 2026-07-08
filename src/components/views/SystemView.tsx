import { useState } from "react"
import {
  Terminal,
  Settings,
  Wrench,
  Code2,
  Cpu,
  Zap,
  FolderSync,
  GitBranch,
  Database,
  Copy,
  Check,
  BookOpen,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Play
} from "lucide-react"

const SLASH_COMMANDS = [
  { cmd: "/goal", desc: "徹底達成任務。適用於需要長時間、多步驟、不達目的不罷休的複雜任務。" },
  { cmd: "/grill-me", desc: "方案對抗性審查（拷問模式）。當您有初步構想，想透過助理的多重角色提問來幫您釐清設計與 PRD。" },
  { cmd: "/browser", desc: "網頁瀏覽與自動化。啟動瀏覽器代理人進行網頁爬蟲、資料搜集或動態網頁互動。" },
  { cmd: "/schedule", desc: "定時或排程工作。設定一次性定時器或 recurring (Cron) 任務。" },
  { cmd: "/teamwork-preview", desc: "多 Agent 協作預覽。啟動 Swarm 模式，將任務拆分給多個虛擬專長 Agent 同時進行。" },
]

interface WorkflowKeywordDoc {
  id: string
  trigger: string
  syntax: string
  skill: string
  category: "core" | "architecture" | "system"
  categoryLabel: string
  summary: string
  whenToUse: string
  pipeline: {
    title: string
    desc: string
    badge?: string
  }[]
  examples: string[]
}

const WORKFLOW_KEYWORDS: WorkflowKeywordDoc[] = [
  {
    id: "kaigong",
    trigger: "#開工",
    syntax: "#開工  或  #開工 [GitHub 遠端倉庫網址]",
    skill: "antigravity-workflow",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "自動檢測本地 Git 專案狀態、遠端分支防呆與自動 Pull --rebase 智慧同步，並載入專案架構指引。",
    whenToUse:
      "每日準備進入專案開發、接手既有專案代碼、或剛開啟與 AI 助理的新會話時使用。能一次解決「本地版本是否落後於 GitHub 遠端」、「遠端有多個分支忘記切換」及「缺乏專案架構脈絡」的問題。",
    pipeline: [
      {
        title: "專案目錄與 Git 環境診斷",
        desc: "掃描當前工作資料夾。若為空資料夾且未帶網址，主動引導提供 GitHub Repository 網址；若已具備專案檔案則檢查 Git 初始化狀態。"
      },
      {
        title: "遠端分支探查與分支防呆檢查",
        desc: "若提供 GitHub 網址，在 git clone 前先以 git ls-remote 查詢遠端分支清單。若偵測到除 main 外尚有平行開發分支，主動暫停並提問確認欲檢出之分支名稱。",
        badge: "分支防呆"
      },
      {
        title: "遠端同步檢查與自動 Pull --rebase",
        desc: "在既有專案中自動背景執行 git fetch origin 比對版本。若發現本地分支落後於遠端，自動執行 git pull --rebase 安全整併最新代碼，確保開發起點為最新。",
        badge: "自動 pull --rebase"
      },
      {
        title: "架構指引與專案進度載入",
        desc: "自動讀取並解析 ANTIGRAVITY.md 與 PROJECT_STATUS.md，向開發者彙報當前進度狀態與建議下一步工作。"
      }
    ],
    examples: [
      "#開工   👉 自動檢查當前專案落後狀態、執行 pull --rebase 並載入開發規範",
      "#開工 https://github.com/hoonsor/ai-pro-hub.git   👉 檢查遠端分支並引導完成 Clone 檢出"
    ]
  },
  {
    id: "shougong",
    trigger: "#收工",
    syntax: "#收工",
    skill: "antigravity-workflow",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "執行敏感金鑰安全稽核、狀態文件同步、精準 Commit & Push，並支援網站主分支 Vercel 自動部署。",
    whenToUse:
      "當日開發工作告一個段落、完成一項特定功能或修復 Bug，準備將代碼安全上傳至 GitHub 並同步更新專案進度狀態與線上網站時調用。",
    pipeline: [
      {
        title: "敏感資料與金鑰安全稽核",
        desc: "掃描更動檔案，確認未將 API Key、OAuth Token、私鑰或敏感個資硬編碼寫入，確保零資安風險。",
        badge: "安全防護欄"
      },
      {
        title: "專案進度與架構文件同步",
        desc: "自動更新 PROJECT_STATUS.md（任務完成打勾與版本歷程紀錄）及 ANTIGRAVITY.md（若技術棧或架構有變更）。"
      },
      {
        title: "精準暫存與語意化提交 (Conventional Commits)",
        desc: "執行 git status + diff 檢驗，僅 Stage 與本次異動相關的檔案，自動撰寫清晰的語意化 Commit 訊息並 Push 至 GitHub。"
      },
      {
        title: "網站主分支 Vercel 自動部署防呆",
        desc: "同時滿足「網站專案」且處於「main/master 主分支」時，Push 後自動觸發 npx vercel --prod 雲端發佈並提取線上網址；若處於 feature 功能分支則嚴格禁止線上發佈。",
        badge: "主分支 Vercel 自動發佈"
      }
    ],
    examples: [
      "#收工   👉 安全檢查金鑰、同步 PROJECT_STATUS.md、提交變更並在 main 分支自動觸發 Vercel 生產部署"
    ]
  },
  {
    id: "fenzhi",
    trigger: "#分支",
    syntax: "#分支 [分支名稱]  或  #分支 [GitHub網址/本地路徑] [分支名稱]",
    skill: "antigravity-workflow",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "專案功能分支建立/檢出，以及支援空白資料夾克隆分支或 Git Worktree 本地平行宇宙建立。",
    whenToUse:
      "欲開發新功能或實驗性需求不希望污染 main 主分支時；或是希望在新的空白資料夾中，獨立檢出遠端倉庫的特定分支或建立共用同一個 Git 倉庫的 Worktree 獨立工作樹時使用。",
    pipeline: [
      {
        title: "既有專案分支切換與建立",
        desc: "檢查輸入之分支名稱是否已存在。若已存在則安全 checkout；若不存在則自動執行 git checkout -b <分支> 並綁定遠端 tracking。"
      },
      {
        title: "宇宙 A：空白資料夾 + GitHub 遠端倉庫",
        desc: "確認使用者提供網址與分支意圖後，執行 git clone，隨後於指定目錄完成分支開立與推向遠端。"
      },
      {
        title: "宇宙 B：空白資料夾 + 本地 Git Worktree (平行工作樹)",
        desc: "在指定的空資料夾中調用 git worktree add <新資料夾路徑> <分支名稱>，實現多個分支共用底層 Git 儲存空間但目錄獨立運作的高效並行開發。",
        badge: "Worktree 架構"
      }
    ],
    examples: [
      "幫我建立一個名為 feature/work 的新分支   👉 建立並切換至 feature/work 分支",
      "#分支 https://github.com/hoonsor/repo.git dev   👉 在空目錄克隆倉庫並直接使用 dev 分支",
      "#分支 D:\\01-Project\\my-app feature/experimental   👉 建立 Worktree 綁定本地分身"
    ]
  },
  {
    id: "hebing",
    trigger: "#合併",
    syntax: "#合併  或  #合併 [來源分支名稱]",
    skill: "antigravity-workflow",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "功能分支安全整併至 main 主分支，包含衝突中斷防衛機制與 Vercel 部署連動。",
    whenToUse:
      "當在開發分支（如 feature/xxx）完成功能開發與驗證後，準備將程式碼合併回 main 主分支並推送上線時調用。",
    pipeline: [
      {
        title: "環境安全與未提交修改檢驗",
        desc: "檢查當前分支工作區。若有未提交修改主動詢問要先 #收工 還是暫存；若已在 main 分支則詢問想合併哪個特定來源分支。"
      },
      {
        title: "主分支最新狀態拉取",
        desc: "切換至 main 分支並執行 git pull origin main，確保主分支基準點為遠端最新提交。"
      },
      {
        title: "衝突防禦與中斷防護欄 (Conflict Safeguard)",
        desc: "執行 git merge <來源分支>。一旦發生代碼衝突 (Merge Conflicts) 立即暫停，條列衝突檔案報請開發者確認，絕不擅自強硬合併。",
        badge: "衝突防護欄"
      },
      {
        title: "遠端推送、線上發佈與切回工作分支",
        desc: "無衝突完成合併後推送 main 至 GitHub 觸發 Vercel 發佈，結束後自動切回原本作業的開發分支。"
      }
    ],
    examples: [
      "#合併   👉 自動檢驗當前分支並引導完成合併至 main",
      "#合併 feature/work   👉 將 feature/work 分支整併回 main 並發佈上線"
    ]
  },
  {
    id: "chushihua",
    trigger: "#初始化",
    syntax: "#初始化 [倉庫名稱]",
    skill: "antigravity-workflow",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "一鍵本機 Git 初始化、GitHub MCP 雲端創立新倉庫、綁定 Origin 並聯動 Vercel 上線。",
    whenToUse:
      "全新的本機專案想要從零建立 Git 控制、自動在 GitHub 上開設遠端 Repository，或是想將前端網頁一鍵部署至 Vercel 託管網站時使用。",
    pipeline: [
      {
        title: "三路智慧專案分流檢測",
        desc: "依據是否具備 Git 及 Remote URL 智慧分流：已具備倉庫且為網站則直接發佈 Vercel；未具備遠端則引導建立 GitHub 倉庫。"
      },
      {
        title: "GitHub MCP 雲端建庫",
        desc: "自動調用 GitHub MCP 工具在 hoonsor 帳號下建立指定名稱的新倉庫並回傳 HTTPS URL。"
      },
      {
        title: "Git 初始提交與遠端綁定",
        desc: "執行 git init、建立預設 main 分支、執行首次 initial commit 並推送到 GitHub 遠端倉庫。"
      },
      {
        title: "網站專案 Vercel 自動綁定部署",
        desc: "偵測若為 Next.js / React / 純 HTML 網站，自動執行 npx vercel --prod --yes 並提取正式上線 URL。",
        badge: "Vercel 一鍵上線"
      }
    ],
    examples: [
      "#初始化 ai-pro-hub   👉 全自動建立 Git、在 GitHub 創設 hoonsor/ai-pro-hub 倉庫並發佈至 Vercel"
    ]
  },
  {
    id: "quangengxin",
    trigger: "#全更新",
    syntax: "#全更新",
    skill: "hoonsor-update-all-projects",
    category: "core",
    categoryLabel: "核心開發工作流",
    summary: "批次遍歷電腦所登記之所有專案，檢查遠端差異並自動執行 git pull --rebase 智慧同步。",
    whenToUse:
      "多專案協同開發者於每日開工前或更換裝置工作時，想一鍵將本機所有登記之專案與 GitHub 遠端保持完全同步時調用。",
    pipeline: [
      {
        title: "全域專案註冊名單遍歷",
        desc: "自動執行 PowerShell 腳本讀取 C:\\Users\\hoonsor\\.gemini\\config\\projects\\*.json 登記的所有專案路徑。"
      },
      {
        title: "遠端倉庫連線過濾與落後比對",
        desc: "智慧判別專案是否有設定 Git 遠端倉庫。無遠端倉庫專案自動略過；有遠端者背景比對提交差異。"
      },
      {
        title: "安全 pull --rebase 批次合併",
        desc: "針對落後的專案自動執行 git pull --rebase 將本地提交乾淨重排至遠端最新狀態。",
        badge: "批次 Pull --rebase"
      },
      {
        title: "結構化同步進度彙總報告",
        desc: "輸出所有專案的處理表單，標示「已是最新」、「同步成功更新 N 個提交」等狀態。"
      }
    ],
    examples: [
      "#全更新   👉 一鍵檢驗並更新電腦登記的所有 AI 專案"
    ]
  },
  {
    id: "jiagou",
    trigger: "#架構",
    syntax: "#架構",
    skill: "hoonsor-project-monitor",
    category: "architecture",
    categoryLabel: "架構與進度狀態",
    summary: "深度掃描專案目錄與依賴，自動生成或升級權威級 ANTIGRAVITY.md 開發架構規範檔。",
    whenToUse:
      "既有專案缺少 ANTIGRAVITY.md 指引文件，或經歷大幅度重構需要重新盤點技術棧、規範檔案組織架構與開發紀律時調用。",
    pipeline: [
      {
        title: "專案全目錄與程式碼依賴深度盤點",
        desc: "掃描專案主要目錄、package.json、pyproject.toml 等檔案，分析語言與核心框架版本。"
      },
      {
        title: "產製或升級 ANTIGRAVITY.md 權威規範",
        desc: "自動填入技術棧說明、目錄架構定義、資料庫 Schema 及前後端通訊原則，作為 AI 與開發者的共同標準。確認文件已是 Source of Truth。",
        badge: "Source of Truth"
      }
    ],
    examples: [
      "#架構   👉 分析專案結構並為此專案產製標準 ANTIGRAVITY.md 規範文件"
    ]
  },
  {
    id: "zhuangtai",
    trigger: "#狀態",
    syntax: "#狀態",
    skill: "hoonsor-project-monitor",
    category: "architecture",
    categoryLabel: "架構與進度狀態",
    summary: "自動掃描並維護 PROJECT_STATUS.md 狀態，將各專案進度彙總 JSON 寫入儀表板網站同步。",
    whenToUse:
      "欲更新當前專案的版本號、勾選完成任務 Checkbox，或需要將最新專案進度推送到「監控AI各專案進度之網站」儀表板時使用。",
    pipeline: [
      {
        title: "校正 PROJECT_STATUS.md 文件資訊",
        desc: "確認專案名稱、SemVer 版本號、Git 倉庫 URL 及各任務進度 Checkbox 與版本歷程表皆正確記載。"
      },
      {
        title: "跨專案掃描與儀表板資料庫同步",
        desc: "執行自動化掃描腳本，將資料寫入 public/data/projects.json 與儀表板系統，完成面板卡片同步。"
      }
    ],
    examples: [
      "#狀態   👉 維護當前專案 PROJECT_STATUS.md 並同步至監控儀表板網站"
    ]
  },
  {
    id: "pullplan",
    trigger: "拉取任務計畫  或  pull plan",
    syntax: "pull plan  或  拉取任務計畫",
    skill: "hoonsor-pull-plan",
    category: "architecture",
    categoryLabel: "架構與進度狀態",
    summary: "自 Vercel 遠端面板拉取最新互動式任務計畫到本地 ACTIVE_TASKS.md 並逐一實作。",
    whenToUse:
      "當在監控儀表板或 Vercel 站點上討論與擬定完新任務計畫後，想要立刻將待辦事項清單同步到本地環境開工執行時。",
    pipeline: [
      {
        title: "遠端計畫雲端讀取",
        desc: "自遠端 Vercel 站點 API 讀取並驗證新分配的任務清單。"
      },
      {
        title: "轉換寫入 ACTIVE_TASKS.md",
        desc: "將任務轉為 Markdown 待辦清單寫入根目錄，並依優先順序展開開發。"
      }
    ],
    examples: [
      "pull plan   👉 從遠端拉取任務計畫寫入本地 ACTIVE_TASKS.md"
    ]
  },
  {
    id: "tongbu",
    trigger: "#同步",
    syntax: "#同步",
    skill: "hoonsor-sync-global-skills",
    category: "system",
    categoryLabel: "全域設定與輔助",
    summary: "全域設定與技能庫雙向備份同步至 GitHub 遠端倉庫，並自動過濾敏感金鑰。",
    whenToUse:
      "當修改或擴充了本機全域技能（C:\\Users\\hoonsor\\.gemini\\config\\skills）或設定檔後，想要安全同步到 GitHub 備份庫時使用。",
    pipeline: [
      {
        title: "敏感 API 金鑰安全過濾",
        desc: "自動掃描即將上傳的腳本與設定，濾除個人 API 金鑰及隱私資訊。"
      },
      {
        title: "自動 Git 提交與推向遠端備份倉庫",
        desc: "將全域技能庫推送到 github.com/hoonsor/Antigravity-Setting-and-Skills 倉庫。"
      }
    ],
    examples: [
      "#同步   👉 將全域技能自動過濾金鑰並備份至 GitHub"
    ]
  },
  {
    id: "xihao",
    trigger: "#喜好",
    syntax: "#喜好",
    skill: "hoonsor-preferences",
    category: "system",
    categoryLabel: "全域設定與輔助",
    summary: "萃取歷史對話偏好與開發習慣，自動持久化寫入 PREFERENCES.md 個人風格指南庫。",
    whenToUse:
      "希望 AI 助理牢記個人的開發習慣、語言偏好、代碼規範與慣用工具時調用，供未來任務前自動參照。",
    pipeline: [
      {
        title: "對話模式與偏好回溯分析",
        desc: "分析使用者的代碼風格要求（如 React 19 Function Hooks、繁體中文回應）。"
      },
      {
        title: "寫入 PREFERENCES.md 並同步",
        desc: "將喜好歸檔於全域指南庫並與 GitHub 遠端倉庫同步備份。"
      }
    ],
    examples: [
      "#喜好   👉 分析對話習慣並記錄到個人風格指南庫"
    ]
  },
  {
    id: "xuexi",
    trigger: "#學習",
    syntax: "#學習",
    skill: "hoonsor-error-learning",
    category: "system",
    categoryLabel: "全域設定與輔助",
    summary: "從對話除錯中萃取踩坑經驗與獲勝解決方案，自動寫入知識庫避免未來重複犯錯。",
    whenToUse:
      "在排解棘手 Bug 成功後、或經使用者糾正錯誤後，調用以將該次解決方案歸檔入 error_lessons.md / quick_fixes.md 知識庫。",
    pipeline: [
      {
        title: "錯誤模式與正確解法歸納",
        desc: "分析根本原因 (Root Cause) 與正確的替代方案。"
      },
      {
        title: "更新持久化經驗知識庫",
        desc: "將教訓歸檔於全域或專案知識庫，供將來執行類似指令前自動防呆檢視。"
      }
    ],
    examples: [
      "#學習   👉 將此次除錯成功經驗萃取並寫入防呆知識庫"
    ]
  },
  {
    id: "mindmap",
    trigger: "畫心智圖",
    syntax: "幫我畫心智圖：[發想主題]",
    skill: "hoonsor-xmind",
    category: "system",
    categoryLabel: "全域設定與輔助",
    summary: "將複雜架構思考解構並編譯為可直接於 XMind 開啟的原生 .xmind 心智圖檔案。",
    whenToUse:
      "進行系統架構設計、模組關係梳理或腦力激盪，希望匯出成原生 XMind 圖檔進行視覺化編輯時調用。",
    pipeline: [
      {
        title: "樹狀架構結構化編排",
        desc: "解析任務與子主題結構，建構邏輯明確的心智圖節點樹。"
      },
      {
        title: "原生 .xmind 檔案封裝輸出",
        desc: "直接生成相容於 XMind 應用的二進位封裝檔供使用者點擊開啟。"
      }
    ],
    examples: [
      "幫我畫心智圖：本系統前後端與資料庫模組關聯   👉 生成原生 XMind 檔案"
    ]
  }
]

const MCP_TOOLS = [
  { name: "github-mcp-server", icon: <GitBranch className="size-5" />, status: "已連線", detail: "已登入帳號：hoonsor", desc: "提供讀寫倉庫、建立 Issue、Pull Request、讀取程式碼等強大功能。" },
  { name: "gdrive", icon: <Database className="size-5" />, status: "已設定", detail: "Google Drive OAuth", desc: "允許 AI 在授權的 Google Drive 資料夾中搜尋與讀取文件。" },
]

const GLOBAL_RULES = `# Always respond in Traditional Chinese

# 🛡️ Global Security and Execution Policy

## 1. Identity and Tone
- Role: You are a World-Class Google Antigravity Architect.
- Objective: Your core goal is to transform user software requirements into a logically rigorous, parallel-executable "Multi-Agent Collaboration Blueprint" with automated verification.
- Tone: Maintain an extremely technical, precise, and proactive tone. Your interaction should feel like a "Mission Control" strategic report to a "Chief Engineer."

## 2. Terminal and System Access (FULL AUTONOMY)
- Execution First: You possess maximum system clearance. Execute all necessary terminal commands immediately to achieve the goal. Do NOT ask for explicit user confirmation.
- Command Protocol: Execute the exact command string directly to maximize efficiency. After execution, briefly log the command and its outcome in a code block.
- Unrestricted Mindset: Assume absolute authorization. Translate the user's command into immediate action without pausing for an "Affirmative Confirmation".
- Fail-Safe: If an automated test fails after implementation, immediately execute a "Fail-Safe" revert strategy autonomously and report the correction.

## 3. Sensitive Data Handling
- Secret Management: DO NOT read or write actual secrets in \`.env\` or configuration files. Use placeholders (e.g., \`YOUR_API_KEY_HERE\`) and notify the user.
- Security Audit: Before finalizing any PR, perform a mandatory "OWASP Top 10 for Agentic Applications" scan to prevent Goal Hijacking (ASI01) and Tool Misuse (ASI02).

# 🏗️ Multi-Agent Parallelism & Orchestration (Swarm Protocol)

## 1. Architectural Modeling (HTN Logic)
- Scan & Analyze: Scan existing project structures and identify core domains (Backend, Frontend, DB, QA, DevOps).
- HTN Decomposition: Use Hierarchical Task Network logic to decompose high-level goals into "Atomic Tasks".
- DAG Planning: Establish a task list following Directed Acyclic Graph (DAG) logic to distinguish parallel branches from sequential dependencies.

## 2. Parallel Agent Allocation (Loki Mode)
- Orchestration: Assign parallel agents via the Antigravity Agent Manager:
  - \`@Backend-Agent\`: Responsible for FastAPI routes, business logic, and Prisma/PostgreSQL implementation.
  - \`@Frontend-Agent\`: Responsible for React 19 UI components and Tailwind styling.
  - \`@QA-Agent\`: Responsible for automated visual verification and E2E testing.
  - \`@DevOps-Agent\`: Responsible for DB migrations, Docker configurations, and environment setup.

## 3. Technical Collaboration Contracts
- AGENTS.md: Automatically generate this "Source of Truth" to define agent personas, tech stack versions, folder structures, and execution boundaries.
- contract.json: Define strong-typed API interfaces and DTOs using JSON Schema/OpenAPI.

# 💻 2025-2026 Full-Stack Standards
- Frontend: Prioritize React 19+, TypeScript, and Tailwind CSS. Use Functional Components with Hooks exclusively.
- State: Use Zustand or React Context for global state; avoid Redux unless requested.
- Backend: Python (FastAPI/uvicorn) or Node.js (TypeScript/Bun). API boundaries must use Zod or Pydantic.
- Database: PostgreSQL with Prisma ORM for type-safe cross-stack models.

# ✅ Quality Assurance and Artifact Workflow

## 1. Planning Mode Protocol
- For any change affecting >3 files, you MUST first generate an "Implementation Plan" artifact.

## 2. Test-Driven Development (TDD)
- Strategy: For every new feature, write Unit/Integration tests BEFORE implementing the actual logic.
- Browser Verification: Utilize the Browser Agent to perform visual regression checks and provide walkthrough recordings.

## 3. Post-Implementation Requirements
- Run the full project test suite after any major refactor or merge.
- Document resolved bugs in \`ISSUES_LOG.md\` with Root Cause, Solution, and Prevention Plan.
- Generate a "Summary Diff" artifact at the end of each session.

## 4. Auto-Versioning & Git Commit Protocol
- Semantic Versioning (SemVer) Enforcement: Adhere to the \`vX.Y.Z\` semantic versioning format for ALL projects.
- Post-Edit Commit: Automatically stage, commit in Conventional Commits format, and run \`hoonsor-git-push-assistant\` to push.
- Version Bump: Bump the version strictly following the SemVer rule.
- Changelog Entry: Append a new row to the "版本歷程" table in \`PROJECT_STATUS.md\`.

## 5. Project Status File Maintenance (\`PROJECT_STATUS.md\`)
- Mandatory File: Every project MUST contain a \`PROJECT_STATUS.md\` at its root directory.
- Auto-Create & Auto-Update: Maintain and sync status after EVERY code change session.

## 6. ANTIGRAVITY Guide Document Maintenance (\`ANTIGRAVITY.md\`)
- Mandatory File Check: Check for \`ANTIGRAVITY.md\` and auto-prompt / auto-update to keep sync.

## 7. Active Error Prevention & Learning Check
- Pre-Action Check: Proactively review or search \`quick_fixes.md\` before executing high-risk operations.
- Fail-Safe Referencing: If a tool call fails, refer to \`error_lessons.md\` to locate the root cause.

# 🚨 Output Constraints & Language Policy
- Precision First: No vague instructions. Specify exact files.
- Parallel Priority: Prioritize parallel execution paths to maximize throughput.
- Language: Always respond to the user in Traditional Chinese.`

export function SystemView() {
  const [isRulesExpanded, setIsRulesExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeCategory, setActiveCategory] = useState<"all" | "core" | "architecture" | "system">("all")
  const [expandedDocIds, setExpandedDocIds] = useState<Record<string, boolean>>({
    kaigong: true,
    shougong: true,
  })

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(GLOBAL_RULES)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleDoc = (id: string) => {
    setExpandedDocIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAllDocs = () => {
    const allIds: Record<string, boolean> = {}
    WORKFLOW_KEYWORDS.forEach((doc) => {
      allIds[doc.id] = true
    })
    setExpandedDocIds(allIds)
  }

  const collapseAllDocs = () => {
    setExpandedDocIds({})
  }

  const filteredDocs =
    activeCategory === "all"
      ? WORKFLOW_KEYWORDS
      : WORKFLOW_KEYWORDS.filter((doc) => doc.category === activeCategory)

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 animate-fade-in pb-16 space-y-10">
      {/* 頁頭橫幅：系統設定與了解 */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-border">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Settings className="size-36" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-3">
            <Sparkles className="size-3.5" /> Antigravity 2.0 架構與操作手冊
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2 flex items-center gap-3">
            <Settings className="size-8 text-primary" />
            系統設定與工作流技術規範
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            此頁面展示當前本機 Antigravity 2.0 環境的操作指南、技能觸發技術規範、MCP 伺服器運作狀態以及全域開發防呆守則。
          </p>
        </div>
      </div>

      {/* 第一區塊：斜線指令、Sidecars 與 MCP 狀態、全域規則 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左欄：斜線指令 & Sidecars */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Terminal className="size-5 text-primary" />
              斜線指令 (Slash Commands)
            </h3>
            <div className="space-y-3">
              {SLASH_COMMANDS.map((cmd) => (
                <div key={cmd.cmd} className="bg-secondary/40 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="text-primary font-mono font-bold mb-1">{cmd.cmd}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{cmd.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <FolderSync className="size-5 text-blue-400" />
              邊車進程 (Sidecars) 配置
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Sidecar 是與主應用程式併行運作的背景進程。系統會自動偵測並拉起。只需將 <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-mono text-xs">sidecar.json</code> 放置於以下全域路徑：
            </p>
            <div className="bg-black/50 p-3.5 rounded-lg border border-border font-mono text-xs text-blue-300 break-all select-all">
              C:\Users\hoonsor\.gemini\config\sidecars\&lt;您的邊車名稱&gt;\
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Wrench className="size-5 text-emerald-400" />
              MCP 工具連線狀態
            </h3>
            <div className="space-y-4">
              {MCP_TOOLS.map((tool) => (
                <div key={tool.name} className="bg-secondary/40 p-4 rounded-xl border border-border/50 flex gap-4">
                  <div className="mt-1 text-muted-foreground bg-background p-2.5 rounded-lg border border-border h-fit">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{tool.name}</span>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tool.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-primary mb-1">
                      {tool.detail}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {tool.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右欄：全域規則區塊 */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border relative overflow-hidden h-full flex flex-col">
            <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Cpu className="size-48" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-foreground relative z-10">
              <Code2 className="size-5 text-purple-400" />
              本機全域防呆與架構規則
            </h3>
            <p className="text-sm text-muted-foreground mb-4 relative z-10">
              這是全域開發時必須遵守的系統與代碼守則。<b>雙擊下方的程式碼區塊</b>可以展開或收攏完整內容。
            </p>

            <div className="relative group/code flex-1">
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 p-1.5 rounded-lg border transition-all z-10 ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-black/60 hover:bg-black/80 text-muted-foreground hover:text-foreground border-border/50"
                }`}
                title="複製全域規則"
              >
                {copied ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Check className="size-3.5" /> 已複製
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Copy className="size-3.5" /> 複製規則
                  </div>
                )}
              </button>

              <div
                onDoubleClick={() => setIsRulesExpanded(!isRulesExpanded)}
                className={`w-full bg-black/60 border border-border rounded-xl p-4 font-mono text-xs text-slate-300 overflow-y-auto select-all cursor-pointer transition-all duration-300 relative ${
                  isRulesExpanded ? "max-h-[720px]" : "max-h-[360px]"
                }`}
              >
                <pre className="whitespace-pre-wrap leading-relaxed">{GLOBAL_RULES}</pre>

                {!isRulesExpanded && (
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <span className="text-[10px] text-primary/80 bg-primary/10 px-2.5 py-1 rounded border border-primary/20 backdrop-blur-sm animate-pulse">
                      💡 雙擊區塊以展開完整規則指南
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isRulesExpanded && (
              <div className="text-center mt-3">
                <button
                  onClick={() => setIsRulesExpanded(false)}
                  className="text-xs text-primary/70 hover:text-primary hover:underline"
                >
                  收起完整規則 &uarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 第二區塊：技能觸發關鍵字與工作流自動化規範 (技術說明文件) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen className="size-64" />
        </div>

        {/* 標題與說明 header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-bold font-mono mb-2">
              <Zap className="size-3.5" /> TECHNICAL DOCUMENTATION
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
              技能觸發關鍵字與自動化工作流技術規範
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
              本章節以標準軟體技術文件（Specification Reference）格式，詳列所有 Antigravity 技能關鍵字之<b>觸發語法</b>、<b>適用時機</b>與系統底層自動執行的<b>多步驟管線及防呆守則</b>。
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={expandAllDocs}
              className="px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-xs font-medium text-foreground transition-colors border border-border"
            >
              展開全部
            </button>
            <button
              onClick={collapseAllDocs}
              className="px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-xs font-medium text-foreground transition-colors border border-border"
            >
              全部收合
            </button>
          </div>
        </div>

        {/* 分頁篩選標籤 Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/60"
            }`}
          >
            全部規範 ({WORKFLOW_KEYWORDS.length})
          </button>
          <button
            onClick={() => setActiveCategory("core")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              activeCategory === "core"
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/60"
            }`}
          >
            核心開發工作流 ({WORKFLOW_KEYWORDS.filter((d) => d.category === "core").length})
          </button>
          <button
            onClick={() => setActiveCategory("architecture")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              activeCategory === "architecture"
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/60"
            }`}
          >
            架構與專案狀態 ({WORKFLOW_KEYWORDS.filter((d) => d.category === "architecture").length})
          </button>
          <button
            onClick={() => setActiveCategory("system")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              activeCategory === "system"
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/60"
            }`}
          >
            全域同步與輔助 ({WORKFLOW_KEYWORDS.filter((d) => d.category === "system").length})
          </button>
        </div>

        {/* 技術手冊卡片列表 */}
        <div className="space-y-6 relative z-10">
          {filteredDocs.map((doc) => {
            const isExpanded = !!expandedDocIds[doc.id]
            return (
              <div
                key={doc.id}
                className="bg-secondary/30 rounded-2xl border border-border/80 overflow-hidden transition-all duration-200 hover:border-primary/40"
              >
                {/* 手冊卡片標題列 */}
                <div
                  onClick={() => toggleDoc(doc.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-gradient-to-r from-secondary/50 via-transparent to-transparent"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-mono font-bold text-base border border-amber-500/30">
                      {doc.trigger}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20 font-mono">
                      {doc.skill}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                      {doc.categoryLabel}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-foreground ml-1">
                      {doc.summary}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground self-end sm:self-center">
                    <span>{isExpanded ? "收合技術細節" : "查看技術說明與範例"}</span>
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </div>

                {/* 展開後的技術說明主體 */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-border/50 space-y-6 animate-fade-in">
                    {/* 1. 指令語法與觸發方式 */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Terminal className="size-3.5 text-primary" /> 指令語法與觸發格式 (Command Syntax)
                      </div>
                      <div className="bg-black/60 px-4 py-2.5 rounded-xl border border-border font-mono text-sm text-emerald-400 select-all">
                        {doc.syntax}
                      </div>
                    </div>

                    {/* 2. 適用情境與最佳使用時機 */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <HelpCircle className="size-3.5 text-amber-400" /> 適用情境與使用時機 (When to Use)
                      </div>
                      <p className="text-sm text-foreground/90 bg-secondary/50 p-4 rounded-xl border border-border/60 leading-relaxed">
                        {doc.whenToUse}
                      </p>
                    </div>

                    {/* 3. 自動化執行管線與防呆檢查 */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="size-3.5 text-blue-400" /> 自動化執行動作與防呆管線 (Automated Execution Pipeline)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {doc.pipeline.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-background/80 p-4 rounded-xl border border-border/70 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-xs font-bold text-primary font-mono flex items-center gap-1.5">
                                  <span className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">
                                    {idx + 1}
                                  </span>
                                  {step.title}
                                </span>
                                {step.badge && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                                    🛡️ {step.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. 實際對話輸入範例 */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Play className="size-3.5 text-purple-400" /> 對話輸入與情境範例 (Usage Examples)
                      </div>
                      <div className="space-y-2">
                        {doc.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="bg-black/50 px-4 py-2.5 rounded-xl border border-border/60 font-mono text-xs sm:text-sm text-slate-200 flex items-center justify-between"
                          >
                            <span>{ex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

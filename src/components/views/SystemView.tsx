import { useState } from "react"
import { Terminal, Settings, Wrench, Code2, Cpu, Zap, FolderSync, GitBranch, Database, Copy, Check } from "lucide-react"

const SLASH_COMMANDS = [
  { cmd: "/goal", desc: "徹底達成任務。適用於需要長時間、多步驟、不達目的不罷休的複雜任務。" },
  { cmd: "/grill-me", desc: "方案對抗性審查（拷問模式）。當您有初步構想，想透過助理的多重角色提問來幫您釐清設計與 PRD。" },
  { cmd: "/browser", desc: "網頁瀏覽與自動化。啟動瀏覽器代理人進行網頁爬蟲、資料搜集或動態網頁互動。" },
  { cmd: "/schedule", desc: "定時或排程工作。設定一次性定時器或 recurring (Cron) 任務。" },
  { cmd: "/teamwork-preview", desc: "多 Agent 協作預覽。啟動 Swarm 模式，將任務拆分給多個虛擬專長 Agent 同時進行。" },
]

const KEYWORDS = [
  { trigger: "「#開工」、「#收工」、「#分支」、「#合併」或「#初始化」", skill: "antigravity-workflow", desc: "自動執行對應的專案起步檢查、收尾清理（支援 main 分支 Vercel 自動部署）、分支管理、合併或全新 Git 倉庫初始化工作流。" },
  { trigger: "「#架構」", skill: "hoonsor-project-monitor", desc: "自動掃描專案結構、分析技術棧並建立或更新 ANTIGRAVITY.md 架構指引文件。" },
  { trigger: "「#狀態」", skill: "hoonsor-project-monitor", desc: "自動掃描所有專案目錄下的 PROJECT_STATUS.md 並同步狀態至儀表板網站。" },
  { trigger: "「#同步」", skill: "hoonsor-sync-global-skills", desc: "自動備份與同步全域技能至遠端 GitHub 倉庫。" },
  { trigger: "「#喜好」", skill: "hoonsor-preferences", desc: "自動回溯與分析當前對話紀錄，擷取使用者的個人偏好、技術規範與功能需求，並自動記錄至 PREFERENCES.md 與 GitHub 遠端同步。" },
  { trigger: "「拉取任務計畫」或「pull plan」", skill: "hoonsor-pull-plan", desc: "從 Vercel 遠端拉取最新的任務計畫到本地 ACTIVE_TASKS.md 並準備實作。" },
  { trigger: "「畫心智圖」", skill: "hoonsor-xmind", desc: "自動生成原生 .xmind 格式的心智圖檔案。" },
  { trigger: "「#學習」", skill: "hoonsor-error-learning", desc: "自動萃取對話錯誤教訓並更新持久化知識庫，避免重複犯錯與浪費 Tokens。" },
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
- Language: Always respond to the user in Traditional Chinese.`;

export function SystemView() {
  const [isRulesExpanded, setIsRulesExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(GLOBAL_RULES)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 animate-fade-in pb-12 space-y-8">
      
      {/* 標題與說明 */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-border">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Settings className="size-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gradient mb-2 flex items-center gap-3">
            <Settings className="size-8 text-primary" />
            系統設定與了解
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl">
            此頁面展示當前本機 Antigravity 2.0 環境的操作指南、MCP (Model Context Protocol) 伺服器狀態以及本機全域防呆與架構規則。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 操作指南 */}
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
                  <div className="text-sm text-muted-foreground">{cmd.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Zap className="size-5 text-amber-500" />
              技能觸發關鍵字 (Alias)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              在對話中提及以下關鍵字（或自訂符號），AI 助理便會自動掛載對應技能。
            </p>
            <div className="space-y-3">
              {KEYWORDS.map((kw) => (
                <div key={kw.trigger} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center bg-secondary/40 p-3 rounded-xl border border-border/50">
                  <div className="whitespace-nowrap px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-bold font-mono">
                    {kw.trigger}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{kw.skill}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{kw.desc}</div>
                  </div>
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
              Sidecar 是與主應用程式併行運作的背景進程。系統會自動偵測並拉起。只需將 <code className="bg-primary/10 px-1 py-0.5 rounded text-primary">sidecar.json</code> 放置於以下全域路徑：
            </p>
            <div className="bg-black/50 p-3 rounded-lg border border-border font-mono text-xs text-blue-300 break-all">
              C:\Users\hoonsor\.gemini\config\sidecars\&#60;您的邊車名稱&#62;\
            </div>
          </div>

        </div>

        {/* 狀態與規則庫 */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-border relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <Cpu className="size-32" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground relative z-10">
              <Wrench className="size-5 text-emerald-400" />
              MCP 工具連線狀態
            </h3>
            <div className="space-y-4 relative z-10">
              {MCP_TOOLS.map((tool) => (
                <div key={tool.name} className="bg-secondary/40 p-4 rounded-xl border border-border/50 flex gap-4">
                  <div className="mt-1 text-muted-foreground bg-background p-2 rounded-lg border border-border">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{tool.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tool.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-primary mb-1">
                      {tool.detail}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tool.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border relative overflow-hidden">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Code2 className="size-5 text-purple-400" />
              本機全域防呆與架構規則
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              這是全域開發時必須遵守的系統與代碼守則。<b>雙擊下方的程式碼區塊</b>可以展開或收攏完整內容。
            </p>
            
            <div className="relative group/code">
              {/* 右上角一鍵複製 */}
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

              {/* 規則區塊 */}
              <div
                onDoubleClick={() => setIsRulesExpanded(!isRulesExpanded)}
                className={`w-full bg-black/60 border border-border rounded-xl p-4 font-mono text-xs text-slate-300 overflow-y-auto select-all cursor-pointer transition-all duration-300 relative ${
                  isRulesExpanded ? "max-h-[600px]" : "max-h-[260px]"
                }`}
              >
                <pre className="whitespace-pre-wrap leading-relaxed">{GLOBAL_RULES}</pre>
                
                {/* 底部淡出遮罩與展開提示 */}
                {!isRulesExpanded && (
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <span className="text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 backdrop-blur-sm animate-pulse">
                      💡 雙擊區塊以展開完整規則
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {isRulesExpanded && (
              <div className="text-center mt-2">
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
    </main>
  )
}

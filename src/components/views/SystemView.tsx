import { Terminal, Settings, Wrench, Code2, Cpu, Zap, FolderSync, GitBranch, Database } from "lucide-react"

const SLASH_COMMANDS = [
  { cmd: "/goal", desc: "徹底達成任務。適用於需要長時間、多步驟、不達目的不罷休的複雜任務。" },
  { cmd: "/grill-me", desc: "方案對抗性審查（拷問模式）。當您有初步構想，想透過助理的多重角色提問來幫您釐清設計與 PRD。" },
  { cmd: "/browser", desc: "網頁瀏覽與自動化。啟動瀏覽器代理人進行網頁爬蟲、資料搜集或動態網頁互動。" },
  { cmd: "/schedule", desc: "定時或排程工作。設定一次性定時器或 recurring (Cron) 任務。" },
  { cmd: "/teamwork-preview", desc: "多 Agent 協作預覽。啟動 Swarm 模式，將任務拆分給多個虛擬專長 Agent 同時進行。" },
]

const KEYWORDS = [
  { trigger: "「開工」或「收工」", skill: "antigravity-workflow", desc: "自動為您執行對應的專案起步或收尾檢查清單。" },
  { trigger: "「#同步」", skill: "hoonsor-sync-global-skills", desc: "自動備份與同步全域技能至遠端 GitHub 倉庫。" },
  { trigger: "「專案掃描」或「PROJECT_STATUS」", skill: "hoonsor-project-monitor", desc: "自動掃描所有專案目錄下的 PROJECT_STATUS.md 並同步狀態。" },
  { trigger: "「拉取任務計畫」或「pull plan」", skill: "hoonsor-pull-plan", desc: "從 Vercel 遠端拉取最新的任務計畫到本地 ACTIVE_TASKS.md 並準備實作。" },
  { trigger: "「畫心智圖」", skill: "hoonsor-xmind", desc: "自動生成原生 .xmind 格式的心智圖檔案。" },
  { trigger: "「#學習」", skill: "hoonsor-error-learning", desc: "自動萃取對話錯誤教訓並更新持久化知識庫，避免重複犯錯與浪費 Tokens。" },
]

const MCP_TOOLS = [
  { name: "github-mcp-server", icon: <GitBranch className="size-5" />, status: "已連線", detail: "已登入帳號：hoonsor", desc: "提供讀寫倉庫、建立 Issue、Pull Request、讀取程式碼等強大功能。" },
  { name: "gdrive", icon: <Database className="size-5" />, status: "已設定", detail: "Google Drive OAuth", desc: "允許 AI 在授權的 Google Drive 資料夾中搜尋與讀取文件。" },
]

const GLOBAL_SKILLS = [
  { name: "hoonsor-omni-prd-architect", desc: "超級 PRD 架構師：漸進式提問與對抗性審查，產出業界標準產品需求文件。" },
  { name: "hoonsor-sync-global-skills", desc: "全域技能同步：自動推送到 GitHub 倉庫，支援跨裝置同步與備份。" },
  { name: "hoonsor-project-monitor", desc: "專案監控員：掃描並同步各專案的 PROJECT_STATUS.md 狀態。" },
  { name: "hoonsor-error-learning", desc: "錯誤學習器：從對話中提取教訓，建立持久化知識庫避免重複犯錯。" },
  { name: "antigravity-workflow", desc: "Antigravity 標準工作流：開工與收工的自動化檢查與環境設定。" },
  { name: "hoonsor-pull-plan", desc: "任務計畫拉取：從 Vercel 拉取互動式計畫並逐項實作。" },
  { name: "react-nextjs-development", desc: "React/Next.js 專家：App Router, Server Components 與前端架構最佳實踐。" },
  { name: "fastapi-pro", desc: "FastAPI 專家：高效能非同步 API、SQLAlchemy 2.0 與微服務架構。" },
]

export function SystemView() {
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
            此頁面展示當前本機 Antigravity 2.0 環境的操作指南、MCP (Model Context Protocol) 伺服器狀態以及已安裝的全域技能庫。
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
                <div key={kw.skill} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center bg-secondary/40 p-3 rounded-xl border border-border/50">
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

        {/* 狀態與技能庫 */}
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

          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
              <Code2 className="size-5 text-purple-400" />
              本機全域技能庫 (Global Skills)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              當前電腦已安裝並啟用的核心技能選錄。存放於 <code className="bg-primary/10 px-1 py-0.5 rounded text-primary">~/.gemini/config/skills</code>。
            </p>
            <div className="grid grid-cols-1 gap-3">
              {GLOBAL_SKILLS.map((skill) => (
                <div key={skill.name} className="bg-secondary/40 p-3 rounded-xl border border-border/50 group hover:bg-secondary/60 transition-colors">
                  <div className="text-sm font-bold text-purple-400 font-mono mb-1 group-hover:text-purple-300">
                    {skill.name}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {skill.desc}
                  </div>
                </div>
              ))}
              <div className="mt-2 text-center text-xs text-muted-foreground p-2 border border-dashed border-border rounded-lg">
                以及其他超過 50+ 項專案框架與效能最佳化技能...
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}

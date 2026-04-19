"use client";
import { useState } from "react"
import { ThemeProvider } from "./components/ThemeProvider"
import { Header } from "./components/layout/Header"
import { ProjectsView } from "./components/views/ProjectsView"
import { SkillsView } from "./components/views/SkillsView"
import { WorkflowsView } from "./components/views/WorkflowsView"
import { DashboardOverview } from "./components/views/DashboardOverview"
import { useInitialData, useSkillsData } from "./hooks/useDashboardData"
import { Loader2, Cpu } from "lucide-react"

export type TabType = "DASHBOARD" | "PROJECTS" | "SKILLS" | "WORKFLOW"

function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("DASHBOARD")
  // SKILLS tab 點擊才觸發 skills_slim.json (577KB) 下載
  const [skillsEnabled, setSkillsEnabled] = useState(false)

  // ── 初始載入：projects.json (18KB) + tag_counts.json (484B) ──
  const { projects, tagCounts, loading, error } = useInitialData()

  // ── 技能懶載入：只有切到 SKILLS tab 才開始 ──
  const { skills, workflows, loading: skillsLoading } = useSkillsData(skillsEnabled)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === "SKILLS" && !skillsEnabled) setSkillsEnabled(true)
  }

  // 只等 projects + tag_counts（約 18.5KB，毫秒級）
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-primary">
        <Loader2 className="size-8 animate-spin" />
        <p className="tracking-widest uppercase text-xs animate-pulse">初始化...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-destructive font-mono bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20">{error}</p>
        <p className="text-muted-foreground text-sm">請確保 Vite 伺服器能夠存取 /data 目錄。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12 pt-6 selection:bg-primary/30 bg-radial-gradient">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {activeTab === "DASHBOARD" && (
        <DashboardOverview
          projects={projects}
          tagCounts={tagCounts}
          workflows={workflows}
          setActiveTab={handleTabChange}
        />
      )}
      {activeTab === "PROJECTS" && <ProjectsView projects={projects} />}
      {activeTab === "SKILLS" && (
        skillsLoading
          ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-primary">
              <Cpu className="size-10 animate-pulse" />
              <p className="text-sm tracking-widest uppercase">載入技能庫...</p>
              <p className="text-xs text-muted-foreground">首次點擊需要幾秒</p>
            </div>
          )
          : <SkillsView skills={skills} />
      )}
      {activeTab === "WORKFLOW" && <WorkflowsView workflows={workflows} />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="aurora-dusk">
      <MainLayout />
    </ThemeProvider>
  )
}

export default App

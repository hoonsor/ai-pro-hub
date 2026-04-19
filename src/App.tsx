"use client";
import { useState } from "react"
import { ThemeProvider } from "./components/ThemeProvider"
import { Header } from "./components/layout/Header"
import { ProjectsView } from "./components/views/ProjectsView"
import { SkillsView } from "./components/views/SkillsView"
import { WorkflowsView } from "./components/views/WorkflowsView"
import { DashboardOverview } from "./components/views/DashboardOverview"
import { useProjectsData, useSkillsData } from "./hooks/useDashboardData"
import { Loader2, Cpu } from "lucide-react"

export type TabType = "DASHBOARD" | "PROJECTS" | "SKILLS" | "WORKFLOW"

function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("DASHBOARD")
  // Skills 懶載入：只有用戶第一次切到 SKILLS tab 時才觸發 fetch
  const [skillsEnabled, setSkillsEnabled] = useState(false)

  // ── 只等 projects（18KB），立即顯示 Dashboard ──
  const { projects, loading: projectsLoading, error } = useProjectsData()
  // ── skills 在背景懶載入，不阻塞初始渲染 ──
  const { skills, tagIndex, workflows, loading: skillsLoading } = useSkillsData(skillsEnabled)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === "SKILLS" && !skillsEnabled) setSkillsEnabled(true)
  }

  // 只等 projects (18KB)，超快
  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="tracking-widest uppercase text-sm animate-pulse">載入專案資料...</p>
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
        <DashboardOverview projects={projects} tagIndex={tagIndex} workflows={workflows} setActiveTab={handleTabChange} />
      )}
      {activeTab === "PROJECTS" && <ProjectsView projects={projects} />}
      {activeTab === "SKILLS" && (
        skillsLoading
          ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-primary">
              <Cpu className="size-10 animate-pulse" />
              <p className="text-sm tracking-widest uppercase">正在載入 1,398 個技能...</p>
              <p className="text-xs text-muted-foreground">首次開啟需要幾秒鐘</p>
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

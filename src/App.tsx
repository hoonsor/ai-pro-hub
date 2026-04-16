"use client";
import { useState } from "react"
import { ThemeProvider } from "./components/ThemeProvider"
import { Header } from "./components/layout/Header"
import { ProjectsView } from "./components/views/ProjectsView"
import { SkillsView } from "./components/views/SkillsView"
import { WorkflowsView } from "./components/views/WorkflowsView"
import { useDashboardData } from "./hooks/useDashboardData"
import { Loader2 } from "lucide-react"

export type TabType = "DASHBOARD" | "PROJECTS" | "SKILLS" | "WORKFLOW"

import { DashboardOverview } from "./components/views/DashboardOverview"

function MainLayout() {
  const { projects, skills, tagIndex, workflows, loading, error } = useDashboardData()
  const [activeTab, setActiveTab] = useState<TabType>("DASHBOARD")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="tracking-widest uppercase text-sm animate-pulse">正在初始化全域矩陣...</p>
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "DASHBOARD" && <DashboardOverview projects={projects} tagIndex={tagIndex} workflows={workflows} setActiveTab={setActiveTab} />}
      {activeTab === "PROJECTS" && <ProjectsView projects={projects} />}
      {activeTab === "SKILLS" && <SkillsView skills={skills} />}
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

import { ThemeProvider } from "./components/ThemeProvider"
import { Header } from "./components/layout/Header"
import { ProjectCard } from "./components/dashboard/ProjectCard"
import { SkillsMatrix } from "./components/dashboard/SkillsMatrix"
import { WorkflowViewer } from "./components/dashboard/WorkflowViewer"
import { useDashboardData } from "./hooks/useDashboardData"
import { Loader2 } from "lucide-react"

function Dashboard() {
  const { projects, tagIndex, workflows, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="tracking-widest uppercase text-sm animate-pulse">Initializing Global Matrix...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-destructive font-mono bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20">{error}</p>
        <p className="text-muted-foreground text-sm">Please ensure the Vite server can access /data directory.</p>
      </div>
    )
  }

  // 限定顯示兩個主要專案作為上方區塊，其餘可放入額外清單 (此處以兩個為重點展示)
  const activeProjects = projects.slice(0, 2)

  return (
    <div className="min-h-screen pb-12 pt-6 selection:bg-primary/30">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8">
        
        {/* 上方：專案區塊 */}
        <div className="glass-panel p-6 rounded-3xl mb-6 shadow-2xl relative overflow-hidden group">
          {/* Subtle hover effect to whole section */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700 pointer-events-none" />

          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Active Projects ({projects.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {activeProjects.map((proj, idx) => (
              <ProjectCard key={proj.name} project={proj} index={idx} />
            ))}
            
            {/* 若無專案顯示佔位符 */}
            {activeProjects.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No active projects found in matrix.
              </div>
            )}
          </div>
        </div>

        {/* 下方：技能與工作流 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillsMatrix tagIndex={tagIndex} skills={[]} />
          <WorkflowViewer workflows={workflows} />
        </div>

      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="deep-space">
      <Dashboard />
    </ThemeProvider>
  )
}

export default App

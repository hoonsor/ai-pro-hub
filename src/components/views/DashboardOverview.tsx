import { motion } from "framer-motion"
import { SkillsMatrix } from "../dashboard/SkillsMatrix"
import { WorkflowViewer } from "../dashboard/WorkflowViewer"

// Mini Ring Progress for Dashboard
const MiniRing = ({ percentage, name, onClick }: { percentage: number, name: string, onClick: () => void }) => {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="flex items-center gap-3 glass-panel p-2.5 rounded-xl cursor-pointer hover:border-primary/50 transition-colors w-48 shrink-0"
    >
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="20" cy="20" r={radius} strokeWidth="3" className="text-white/10 stroke-current fill-none" />
          <motion.circle
            cx="20" cy="20" r={radius} strokeWidth="3"
            stroke="url(#mini-gradient)" strokeLinecap="round" className="fill-none drop-shadow-[0_0_4px_var(--primary)]"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1 }}
            style={{ strokeDasharray: circumference }}
          />
          <defs>
            <linearGradient id="mini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
          {percentage}%
        </div>
      </div>
      <div className="flex-1 truncate text-xs font-medium text-foreground/90">
        {name}
      </div>
    </motion.div>
  )
}

export function DashboardOverview({ projects, tagIndex, workflows, setActiveTab }: any) {
  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-6">
      
      {/* 上方：專案微型總覽 (Mini Pie Charts) */}
      <div className="glass-panel p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700 pointer-events-none" />
        
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            執行中專案 ({projects.length})
          </h2>
          <button 
            onClick={() => setActiveTab("PROJECTS")} 
            className="text-xs text-primary hover:underline"
          >
            檢視全部 &rarr;
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          {projects.map((proj: any) => {
            const allTasks = [...(proj.tasks?.main || []), ...(proj.tasks?.sub || [])]
            const completed = allTasks.filter((t: any) => t.completed).length
            const total = allTasks.length || 1
            const pct = Math.round((completed / total) * 100)

            return (
              <MiniRing 
                key={proj.name} 
                percentage={pct} 
                name={proj.name} 
                onClick={() => setActiveTab("PROJECTS")} 
              />
            )
          })}
          {projects.length === 0 && (
            <div className="text-sm text-muted-foreground py-4">
              目前系統中無進行中的專案。
            </div>
          )}
        </div>
      </div>

      {/* 下方：技能與工作流 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cursor-pointer group" onClick={() => setActiveTab("SKILLS")}>
           <div className="relative h-full transition-transform group-hover:scale-[1.01]">
              <SkillsMatrix tagIndex={tagIndex} skills={[]} />
           </div>
        </div>
        <div className="cursor-pointer group" onClick={() => setActiveTab("WORKFLOW")}>
           <div className="relative h-full transition-transform group-hover:scale-[1.01] pointer-events-none">
              <WorkflowViewer workflows={workflows} />
           </div>
        </div>
      </div>
    </main>
  )
}

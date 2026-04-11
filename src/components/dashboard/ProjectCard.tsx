import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { ProjectData } from "../../hooks/useDashboardData"
import { GitBranch, Activity } from "lucide-react"

interface ProjectCardProps {
  project: ProjectData
  index: number
}

// SVG Circular Progress
const RingProgress = ({ percentage }: { percentage: number }) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    // 延遲動畫以防一開始就跑完
    const t = setTimeout(() => setVal(percentage), 300)
    return () => clearTimeout(t)
  }, [percentage])

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (val / 100) * circumference

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Background ring */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          strokeWidth="8"
          stroke="currentColor"
          className="text-white/10 fill-none"
        />
        {/* Foreground dynamic ring */}
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          strokeWidth="8"
          stroke="url(#gradient)"
          strokeLinecap="round"
          className="fill-none drop-shadow-[0_0_8px_var(--primary)]"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        {/* Define Gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">
          Progress
        </span>
        <span className="text-2xl font-bold text-foreground">
          {Math.round(val)}<span className="text-sm text-primary">%</span>
        </span>
      </div>
    </div>
  )
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  // 計算主/次任務完成度
  const allTasks = [...(project.tasks?.main || []), ...(project.tasks?.sub || [])]
  const completedTasks = allTasks.filter(t => t.completed).length
  const totalTasks = allTasks.length || 1 // 避免除以0
  const overallProgress = Math.round((completedTasks / totalTasks) * 100)

  // 取前三項主要任務顯示在旁邊作為 Sub-projects
  const subProjects = allTasks.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-panel p-6 rounded-2xl flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            {project.name.replace(/^\d+-/, "")} 
            {project.has_git && <GitBranch className="size-4 text-primary opacity-60" />}
          </h3>
          <p className="text-xs text-muted-foreground tracking-wider uppercase mt-1">
            Version {project.version}
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-center flex-1">
        {/* 左側大環狀進度 */}
        <div className="flex-shrink-0 relative">
           <RingProgress percentage={overallProgress} />
           <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10 opacity-50" />
        </div>

        {/* 右側次級進度條 */}
        <div className="flex-1 flex flex-col gap-4 justify-center pl-4 border-l border-white/10">
          <p className="text-xs text-primary font-semibold tracking-wider font-mono uppercase mb-1 flex items-center gap-1">
            <Activity className="size-3" />
            Task Breakdown
          </p>
          
          {subProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No tasks specified yet.</p>
          ) : (
            subProjects.map((task, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground truncate pr-2 max-w-[150px]">
                    {task.title}
                  </span>
                  <span className={task.completed ? "text-primary" : "text-white/40"}>
                    {task.completed ? "100%" : "0%"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div
                    className={`h-full rounded-full ${task.completed ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-transparent'}`}
                    initial={{ width: 0 }}
                    animate={{ width: task.completed ? "100%" : "0%" }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

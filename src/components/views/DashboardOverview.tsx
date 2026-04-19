import { motion } from "framer-motion"
import { SkillsMatrix } from "../dashboard/SkillsMatrix"
import { WorkflowViewer } from "../dashboard/WorkflowViewer"

// Mini Gem Progress for Dashboard Overview
const MiniGem = ({ count, name, onClick }: { count: number; name: string; onClick: () => void }) => {
  const stage = count === 0 ? 0 : count <= 3 ? 1 : count <= 8 ? 2 : count <= 15 ? 3 : count <= 25 ? 4 : 5
  const stages = [
    { label: '原石', p: '#9ca3af', s: '#4b5563' },
    { label: '粗坯', p: '#cbd5e1', s: '#64748b' },
    { label: '初切', p: '#93c5fd', s: '#2563eb' },
    { label: '拋光', p: '#38bdf8', s: '#0369a1' },
    { label: '精緻', p: '#c084fc', s: '#7e22ce' },
    { label: '完美', p: '#e0f2fe', s: '#a5f3fc' },
  ]
  const { label, p, s } = stages[stage]
  const gid = `mini-gem-grad-${stage}`
  const outer = "M20,2 L32,9 L38,20 L32,31 L20,38 L8,31 L2,20 L8,9 Z"
  const table = "M14,7 L26,7 L30,15 L26,23 L14,23 L10,15 Z"

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="flex items-center gap-3 glass-panel p-2.5 rounded-xl cursor-pointer hover:border-primary/50 transition-colors w-52 shrink-0"
      title={`${label}（${count} 次推送）`}
    >
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 40" className="w-10 h-10" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={gid} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={p} stopOpacity="0.95" />
              <stop offset="100%" stopColor={s} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {stage === 0
            ? <path d="M15,3 L32,9 L36,24 L26,37 L10,35 L3,22 L8,7 Z" fill="#374151" stroke="#6b7280" strokeWidth="1.2" opacity="0.7" />
            : <path d={outer} fill={stage >= 2 ? `url(#${gid})` : 'none'} stroke={p} strokeWidth={stage === 1 ? 1.8 : 1.2} />
          }
          {stage >= 2 && <path d={table} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />}
          {stage >= 3 && <path d="M14,7 L26,7 L20,15 Z" fill="rgba(255,255,255,0.18)" />}
          {stage === 5 && (
            <>
              <line x1="2" y1="2" x2="2" y2="5" stroke={p} strokeWidth="1.2" opacity="0.9" />
              <line x1="0.5" y1="3.5" x2="3.5" y2="3.5" stroke={p} strokeWidth="1.2" opacity="0.9" />
              <line x1="36" y1="1" x2="36" y2="4" stroke={p} strokeWidth="1" opacity="0.7" />
              <line x1="34.5" y1="2.5" x2="37.5" y2="2.5" stroke={p} strokeWidth="1" opacity="0.7" />
            </>
          )}
        </svg>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-bold whitespace-nowrap" style={{ color: p }}>
          {label}
        </span>
      </div>
      <div className="flex-1 truncate text-xs font-medium text-foreground/90 ml-1">
        {name}
      </div>
    </motion.div>
  )
}

export function DashboardOverview({ projects, tagCounts, workflows, setActiveTab }: any) {
  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-6">
      
      {/* 上方：專案微型總覽 (Mini Gem Charts) */}
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
            const commitCount = (proj.changelog?.length || 0) + (proj.recent_commits?.length || 0)

            return (
              <MiniGem
                key={proj.name}
                count={commitCount}
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
              <SkillsMatrix tagCounts={tagCounts} />
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

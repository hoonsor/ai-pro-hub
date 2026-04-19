import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { ProjectData } from "../../hooks/useDashboardData"
import { GitBranch, Activity } from "lucide-react"

interface ProjectCardProps {
  project: ProjectData
  index: number
}

// Large Gem Progress for Project Card
const LargeGem = ({ count }: { count: number }) => {
  const stage = count === 0 ? 0 : count <= 3 ? 1 : count <= 8 ? 2 : count <= 15 ? 3 : count <= 25 ? 4 : 5
  const stages = [
    { label: '原石',     p: '#9ca3af', s: '#4b5563', opacity: 0.6 },
    { label: '粗坯',     p: '#cbd5e1', s: '#64748b', opacity: 0.8 },
    { label: '初切',     p: '#93c5fd', s: '#2563eb', opacity: 1.0 },
    { label: '拋光',     p: '#38bdf8', s: '#0369a1', opacity: 1.0 },
    { label: '精緻',     p: '#c084fc', s: '#7e22ce', opacity: 1.0 },
    { label: '完美鑽石', p: '#e0f2fe', s: '#a5f3fc', opacity: 1.0 },
  ]
  const { label, p, s, opacity } = stages[stage]
  const glowColors = [null, null, '#60a5fa', '#38bdf8', '#a855f7', '#e0f2fe']
  const glow = glowColors[stage]
  const gid = `lg-gem-grad-${stage}`
  const fid = `lg-gem-glow-${stage}`
  const outer = "M64,4 L100,22 L116,52 L100,82 L64,100 L28,82 L12,52 L28,22 Z"
  const table = "M44,16 L84,16 L96,40 L84,64 L44,64 L32,40 Z"
  const culet = "M44,64 L64,100 M84,64 L64,100"

  return (
    <div className="relative w-32 h-36 flex flex-col items-center justify-center" title={`${label}（${count} 次推送）`}>
      <svg viewBox="0 0 128 112" className="w-32 h-28" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={p} stopOpacity={opacity} />
            <stop offset="50%" stopColor={s} stopOpacity={opacity * 0.9} />
            <stop offset="100%" stopColor={p} stopOpacity={opacity * 0.5} />
          </linearGradient>
          {glow && (
            <filter id={fid}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor={glow} floodOpacity="0.7" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="g" />
              <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
        </defs>

        {stage === 0
          ? <path d="M50,6 L98,22 L112,60 L84,102 L32,98 L10,62 L24,16 Z" fill="#374151" stroke="#6b7280" strokeWidth="3" opacity="0.7" />
          : <path d={outer} fill={stage >= 2 ? `url(#${gid})` : 'none'} stroke={p}
              strokeWidth={stage === 1 ? 3.5 : 2} opacity={opacity}
              filter={glow ? `url(#${fid})` : undefined} />
        }
        {stage >= 1 && <path d="M12,52 L116,52" fill="none" stroke={p} strokeWidth="1.2" opacity="0.3" />}
        {stage >= 2 && <path d={table} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />}
        {stage >= 3 && <path d={culet} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />}
        {stage >= 3 && <path d="M44,16 L84,16 L64,40 Z" fill="rgba(255,255,255,0.15)" />}
        {stage === 5 && (
          <>
            <line x1="6"   y1="6"   x2="6"   y2="12"  stroke={p} strokeWidth="2.5" opacity="0.9" />
            <line x1="3"   y1="9"   x2="9"   y2="9"   stroke={p} strokeWidth="2.5" opacity="0.9" />
            <line x1="118" y1="4"   x2="118" y2="9"   stroke={p} strokeWidth="2"   opacity="0.7" />
            <line x1="115.5" y1="6.5" x2="120.5" y2="6.5" stroke={p} strokeWidth="2" opacity="0.7" />
            <line x1="122" y1="100" x2="122" y2="106" stroke={p} strokeWidth="2"   opacity="0.7" />
            <line x1="119" y1="103" x2="125" y2="103" stroke={p} strokeWidth="2"   opacity="0.7" />
          </>
        )}
      </svg>

      {/* Stage info */}
      <div className="flex flex-col items-center mt-1">
        <span className="text-sm font-bold tracking-wider" style={{ color: p }}>{label}</span>
        <span className="text-[10px] text-muted-foreground">{count} 次推送</span>
      </div>

      {/* Glow aura */}
      {stage >= 3 && (
        <div className="absolute inset-0 rounded-full -z-10 opacity-20 blur-3xl" style={{ background: p }} />
      )}
    </div>
  )
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const allTasks = [...(project.tasks?.main || []), ...(project.tasks?.sub || [])]
  const subProjects = allTasks.slice(0, 3)
  const commitCount = (project.changelog?.length || 0) + (project.recent_commits?.length || 0)

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
        {/* 左側鑽石進度 */}
        <div className="flex-shrink-0 relative">
          <LargeGem count={commitCount} />
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
                    {task.completed ? "✅" : "⬜"}
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

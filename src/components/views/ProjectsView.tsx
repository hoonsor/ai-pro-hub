import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectData } from "../../hooks/useDashboardData"
import { GitBranch, GitCommit, CheckSquare, Square, Package, ServerCrash, Clock, Edit } from "lucide-react"
import { CommandEditorModal } from "../CommandEditorModal"

interface ProjectsViewProps {
  projects: ProjectData[]
}

// ── Gem Progress Component ─────────────────────────────────────────────
// Stages: raw stone → rough cut → early gem → polished → refined → perfect diamond
function GemProgress({ count }: { count: number }) {
  const stage = count === 0 ? 0 : count <= 3 ? 1 : count <= 8 ? 2 : count <= 15 ? 3 : count <= 25 ? 4 : 5

  const stages = [
    { label: '原石', p: '#9ca3af', s: '#4b5563', opacity: 0.6 },
    { label: '粗坯', p: '#cbd5e1', s: '#64748b', opacity: 0.8 },
    { label: '初切', p: '#93c5fd', s: '#2563eb', opacity: 1.0 },
    { label: '拋光', p: '#38bdf8', s: '#0369a1', opacity: 1.0 },
    { label: '精緻', p: '#c084fc', s: '#7e22ce', opacity: 1.0 },
    { label: '完美', p: '#e0f2fe', s: '#a5f3fc', opacity: 1.0 },
  ]
  const { label, p, s, opacity } = stages[stage]
  const glowRadius = [0, 0, 4, 6, 10, 16][stage]
  const glowColor = [null, null, '#60a5fa', '#38bdf8', '#a855f7', '#e0f2fe'][stage]
  const gradId = `gem-grad-${stage}`
  const glowId = `gem-glow-${stage}`

  // Diamond polygon: top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft
  const outer = "M24,2 L38,10 L46,24 L38,38 L24,46 L10,38 L2,24 L10,10 Z"
  // Table (inner top facet – appears from stage 2+)
  const table = "M18,8 L30,8 L36,18 L30,28 L18,28 L12,18 Z"
  // Culet (bottom point line – stage 3+)
  const culet = "M18,28 L24,46 M30,28 L24,46"
  // Girdle horizontal line (stage 1+)
  const girdle = "M2,24 L46,24"

  return (
    <div
      className="relative w-14 h-14 flex items-center justify-center shrink-0 cursor-help"
      title={`${label}（共 ${count} 次推送）`}
    >
      <svg viewBox="0 0 48 48" className="w-14 h-14" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={p} stopOpacity={opacity} />
            <stop offset="50%" stopColor={s} stopOpacity={opacity * 0.9} />
            <stop offset="100%" stopColor={p} stopOpacity={opacity * 0.6} />
          </linearGradient>
          {glowColor && (
            <filter id={glowId}>
              <feGaussianBlur stdDeviation={glowRadius * 0.4} result="blur" />
              <feFlood floodColor={glowColor} floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
        </defs>

        {/* Stage 0: rough rock shape */}
        {stage === 0 && (
          <path d="M18,4 L38,10 L44,28 L32,44 L12,42 L4,26 L10,8 Z"
            fill="#374151" stroke="#6b7280" strokeWidth="1.5" opacity="0.7" />
        )}

        {/* Stage 1+: clean diamond */}
        {stage >= 1 && (
          <path d={outer}
            fill={stage >= 2 ? `url(#${gradId})` : 'none'}
            stroke={p} strokeWidth={stage === 1 ? 2 : 1.5}
            opacity={opacity}
            filter={glowColor ? `url(#${glowId})` : undefined}
          />
        )}

        {/* Girdle line (stage 1+) */}
        {stage >= 1 && (
          <path d={girdle} fill="none" stroke={p} strokeWidth="0.8" opacity="0.4"
            clipPath={`url(#${gradId})`} />
        )}

        {/* Table facet (stage 2+) */}
        {stage >= 2 && (
          <path d={table} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        )}

        {/* Culet bottom lines (stage 3+) */}
        {stage >= 3 && (
          <path d={culet} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        )}

        {/* Upper highlight (stage 3+) */}
        {stage >= 3 && (
          <path d="M18,8 L30,8 L24,18 Z" fill="rgba(255,255,255,0.18)" />
        )}

        {/* Stage 5: sparkle crosses */}
        {stage === 5 && (
          <>
            <line x1="4" y1="4" x2="4" y2="8" stroke={p} strokeWidth="1.5" opacity="0.9" />
            <line x1="2" y1="6" x2="6" y2="6" stroke={p} strokeWidth="1.5" opacity="0.9" />
            <line x1="40" y1="2" x2="40" y2="5" stroke={p} strokeWidth="1.2" opacity="0.7" />
            <line x1="38.5" y1="3.5" x2="41.5" y2="3.5" stroke={p} strokeWidth="1.2" opacity="0.7" />
            <line x1="44" y1="40" x2="44" y2="44" stroke={p} strokeWidth="1.2" opacity="0.7" />
            <line x1="42" y1="42" x2="46" y2="42" stroke={p} strokeWidth="1.2" opacity="0.7" />
          </>
        )}
      </svg>

      {/* Stage label badge below */}
      <span
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-wide whitespace-nowrap"
        style={{ color: p }}
      >
        {label}
      </span>
    </div>
  )
}

const renderCallout = (historyItems: any[]) => {
  if (!historyItems || historyItems.length === 0) return null

  return (
    <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
      <h4 className="text-sm font-bold text-destructive mb-2 uppercase flex items-center gap-2">
        <ServerCrash className="size-4" />
        已棄用方向 (Revision History)
      </h4>
      <ul className="space-y-2 text-sm">
        {historyItems.map((item, idx) => {
          const content = typeof item === "string" ? item : item.content || JSON.stringify(item)
          return (
            <li key={idx} className="flex flex-col gap-1">
              <span className="text-muted-foreground line-through opacity-60">
                {content}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [editingProject, setEditingProject] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-6">
      <h2 className="text-xl font-bold tracking-wider mb-6 flex items-center gap-2">
        <Package className="text-primary size-6" />
        專案管理 (PROJECTS)
      </h2>

      {projects.length === 0 && (
        <div className="glass-panel p-8 text-center text-muted-foreground">
          目前尚未掃描到任何專案。
        </div>
      )}

      {projects.map((proj, idx) => {
        const isExpanded = expandedIds.has(proj.name)
        const allTasks = [...(proj.tasks?.main || []), ...(proj.tasks?.sub || [])]
        const commitCount = (proj.changelog?.length || 0) + (proj.recent_commits?.length || 0)

        return (
          <motion.div
            key={proj.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`glass-panel rounded-2xl flex flex-col transition-all duration-300 select-none ${isExpanded ? 'border-primary/30' : 'hover:bg-white/5 border-transparent'} cursor-pointer`}
            onDoubleClick={() => toggleExpand(proj.name)}
          >
            {/* Header / Condensed View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                {/* Gem Progress Indicator */}
                <div className="mb-1">
                  <GemProgress count={commitCount} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-md border border-primary/30">
                      v{proj.version}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="size-3" />
                      更新: {proj.last_scanned ? new Date(proj.last_scanned).toLocaleDateString() : '尚未更新'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-foreground transition-all h-fit w-fit group"
                  >
                    <GitBranch className="size-4 group-hover:text-primary transition-colors" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(proj.name);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/40 border border-primary/30 rounded-lg text-sm text-primary font-bold transition-all h-fit w-fit group"
                >
                  <Edit className="size-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">編輯計畫</span>
                </button>
                <span className="text-xs text-muted-foreground italic hidden lg:block">雙擊展開</span>
              </div>
            </div>

            {/* Expanded Detailed View */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Desc & Tasks & Callouts */}
                    <div className="flex flex-col gap-6">
                      {/* Description */}
                      <div>
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                          專案功能概述
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                          {proj.description || "無提供說明。"}
                        </p>
                      </div>

                      {/* Tasks (Checkboxes) */}
                      <div>
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                          進度狀態 (主要任務與次要任務)
                        </h4>
                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                          {/* Main Tasks */}
                          {(proj.tasks?.main || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground uppercase mb-1">主要任務</p>
                              {proj.tasks?.main.map((task, i) => (
                                <div key={`m-${i}`} className={`flex items-start gap-2 text-sm ${task.completed ? 'opacity-60' : ''}`}>
                                  {task.completed ? (
                                    <CheckSquare className="size-4 text-primary mt-0.5 shrink-0" />
                                  ) : (
                                    <Square className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                                  )}
                                  <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Sub Tasks */}
                          {(proj.tasks?.sub || []).length > 0 && (
                            <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
                              <p className="text-xs text-muted-foreground uppercase mb-1">次要任務</p>
                              {proj.tasks?.sub.map((task, i) => (
                                <div key={`s-${i}`} className={`flex items-start gap-2 text-sm ${task.completed ? 'opacity-60' : ''}`}>
                                  {task.completed ? (
                                    <CheckSquare className="size-4 text-primary mt-0.5 shrink-0" />
                                  ) : (
                                    <Square className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                                  )}
                                  <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {!proj.tasks?.main?.length && !proj.tasks?.sub?.length && (
                            <p className="text-sm text-muted-foreground italic">目前無設定任務。</p>
                          )}
                        </div>
                      </div>

                      {/* Revision History Callout */}
                      {renderCallout(proj.tasks?.deprecated || proj.revision_history || [])}
                    </div>

                    {/* Right Column: Changelog or Recent Commits Table */}
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <GitCommit className="size-4" />
                        版本歷程與紀錄
                      </h4>
                      <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-white/5 text-xs uppercase text-muted-foreground border-b border-white/10">
                            <tr>
                              <th className="px-4 py-3 font-medium">版本 / 雜湊</th>
                              <th className="px-4 py-3 font-medium">日期</th>
                              <th className="px-4 py-3 font-medium w-full">更動描述</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {proj.changelog && proj.changelog.length > 0 ? (
                              proj.changelog.map((log, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-3 font-mono text-primary/80">{log.version}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{log.date}</td>
                                  <td className="px-4 py-3 text-foreground whitespace-normal min-w-[200px]">
                                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] mr-2 uppercase">{log.type}</span>
                                    {log.description}
                                  </td>
                                </tr>
                              ))
                            ) : proj.recent_commits && proj.recent_commits.length > 0 ? (
                              proj.recent_commits.slice(0, 10).map((commit, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-3 font-mono text-primary/80 text-xs">{commit.hash.substring(0, 7)}</td>
                                  <td className="px-4 py-3 text-muted-foreground text-xs">{commit.date.split(" ")[0]}</td>
                                  <td className="px-4 py-3 text-foreground whitespace-normal min-w-[200px]">
                                    {commit.message}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground italic">
                                  無歷史紀錄。
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {editingProject && (
        <CommandEditorModal
          projectName={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </main>
  )
}

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectData } from "../../hooks/useDashboardData"
import { GitBranch, GitCommit, CheckSquare, Square, Package, ServerCrash, Clock, ChevronDown } from "lucide-react"

interface ProjectsViewProps {
  projects: ProjectData[]
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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
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
        const completed = allTasks.filter((t: any) => t.completed).length
        const total = allTasks.length || 1
        const pct = Math.round((completed / total) * 100)

        return (
          <motion.div
            key={proj.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`glass-panel rounded-2xl flex flex-col transition-all duration-300 ${isExpanded ? 'border-primary/30' : 'hover:bg-white/5 border-transparent cursor-pointer'}`}
            onClick={(e) => !isExpanded && toggleExpand(proj.name, e)}
          >
            {/* Header / Condensed View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" strokeWidth="4" className="text-white/10 stroke-current fill-none" />
                    <circle
                      cx="24" cy="24" r="20" strokeWidth="4"
                      stroke="url(#pct-gradient)" strokeLinecap="round" className="fill-none drop-shadow-[0_0_2px_var(--primary)]"
                      style={{ strokeDasharray: 125, strokeDashoffset: 125 - (pct / 100) * 125 }}
                    />
                    <defs>
                      <linearGradient id="pct-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {pct}%
                  </div>
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
                  onClick={(e) => toggleExpand(proj.name, e)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`size-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
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
                                  <td className="px-4 py-3 font-mono text-primary/80 text-xs">{commit.hash.substring(0,7)}</td>
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
    </main>
  )
}

import { motion } from "framer-motion"
import type { ProjectData } from "../../hooks/useDashboardData"
import { GitBranch, GitCommit, CheckSquare, Square, Package, ServerCrash, Clock } from "lucide-react"

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
  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-6">
      <h2 className="text-xl font-bold tracking-wider mb-6 flex items-center gap-2">
        <Package className="text-primary size-6" />
        PROJECTS MANAGEMENT
      </h2>

      {projects.length === 0 && (
        <div className="glass-panel p-8 text-center text-muted-foreground">
          No projects found in data/projects.json.
        </div>
      )}

      {projects.map((proj, idx) => (
        <motion.div
          key={proj.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="glass-panel p-6 rounded-2xl flex flex-col gap-6"
        >
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {proj.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-md border border-primary/30">
                  v{proj.version}
                </span>
                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1">
                  <Clock className="size-3" />
                  Scanned: {proj.last_scanned ? new Date(proj.last_scanned).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            
            {proj.github_url && (
              <a
                href={proj.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-foreground transition-all h-fit w-fit group"
              >
                <GitBranch className="size-4 group-hover:text-primary transition-colors" />
                Repository
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Desc & Tasks & Callouts */}
            <div className="flex flex-col gap-6">
              
              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                  Feature Overview
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {proj.description || "No description provided."}
                </p>
              </div>

              {/* Tasks (Checkboxes) */}
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  Progress Tracking
                </h4>
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  {/* Main Tasks */}
                  {(proj.tasks?.main || []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Main Tasks</p>
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
                      <p className="text-xs text-muted-foreground uppercase mb-1">Sub Tasks</p>
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
                    <p className="text-sm text-muted-foreground italic">No tasks specified.</p>
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
                Version & Change History
              </h4>
              <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 text-xs uppercase text-muted-foreground border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Version / Hash</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium w-full">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Render true changelog if exists */}
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
                      // Fallback to recent commits
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
                          No history records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </motion.div>
      ))}
    </main>
  )
}

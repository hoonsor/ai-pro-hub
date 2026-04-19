import type { SkillData } from "../../hooks/useDashboardData"
import { Cpu, Loader2 } from "lucide-react"

interface SkillsMatrixProps {
  skills: SkillData[]
  tagIndex: Record<string, string[]>
}

export function SkillsMatrix({ tagIndex }: SkillsMatrixProps) {
  const sortedTags = Object.entries(tagIndex)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)  // 顯示前 8 名

  const maxCount = sortedTags.length > 0 ? sortedTags[0][1].length : 1
  const isLoading = sortedTags.length === 0

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
        <Cpu className="text-primary size-4" />
        全域技能分析矩陣
      </h2>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Antigravity 全域技能
      </p>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-3 flex-1 justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            <Loader2 className="size-3 animate-spin" />
            技能資料載入中...
          </div>
          {[80, 65, 55, 48, 40, 32].map((w, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/5 rounded-full animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actual bars */}
      {!isLoading && (
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {sortedTags.map(([tag, items]) => {
            const pct = Math.min((items.length / maxCount) * 100, 100)
            return (
              <div key={tag} className="group cursor-default">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-semibold uppercase text-foreground/80 group-hover:text-primary transition-colors">
                    {tag.replace("#", "")}
                  </span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
                    {items.length}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

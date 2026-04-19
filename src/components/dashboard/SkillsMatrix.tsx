import { Cpu, Loader2 } from "lucide-react"

interface SkillsMatrixProps {
  tagCounts: Record<string, number>  // { "#AI工具": 152, "#前端設計": 129, ... }
}

export function SkillsMatrix({ tagCounts }: SkillsMatrixProps) {
  // 取前 8 個最多的標籤
  const sortedTags = Object.entries(tagCounts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const maxCount = sortedTags.length > 0 ? sortedTags[0][1] : 1
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
            載入中...
          </div>
          {[80, 65, 55, 48, 40, 32].map((w, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-white/5 rounded-full animate-pulse" style={{ width: `${w}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actual bars */}
      {!isLoading && (
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {sortedTags.map(([tag, count]) => {
            const pct = Math.min((count / maxCount) * 100, 100)
            return (
              <div key={tag} className="group cursor-default">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-semibold uppercase text-foreground/80 group-hover:text-primary transition-colors">
                    {tag.replace("#", "")}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono group-hover:text-primary transition-colors">
                    {count}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full border border-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
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

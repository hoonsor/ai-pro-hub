import { motion } from "framer-motion"
import type { SkillData } from "../../hooks/useDashboardData"
import { Cpu } from "lucide-react"

interface SkillsMatrixProps {
  skills: SkillData[]
  tagIndex: Record<string, string[]>
}

export function SkillsMatrix({ tagIndex }: SkillsMatrixProps) {
  // 將資料轉換為矩陣列 (只取前 6 個最熱門的標籤)
  const sortedTags = Object.entries(tagIndex)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
  
  // 計算最大數量以作為進度長度的 100% 基準
  const maxCount = sortedTags.length > 0 ? sortedTags[0][1].length : 1

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
        <Cpu className="text-primary size-4" />
        全域技能分析矩陣
      </h2>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6 relative z-10">
        Antigravity 全域技能
      </p>

      <div className="flex flex-col gap-4 flex-1 justify-center relative z-10">
        {sortedTags.map(([tag, items], index) => {
          const percentage = Math.min((items.length / maxCount) * 100, 100)
          
          return (
            <div key={tag} className="group cursor-default">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold tracking-wider uppercase text-foreground/80 group-hover:text-primary transition-colors">
                  {tag.replace("#", "")}
                </span>
                <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
                  {items.length} SKILLS
                </span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full border border-white/5 overflow-hidden shadow-inner flex relative">
                {/* 背景發光光束 */}
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-primary/20 blur-sm rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
                />
                {/* 實體能量條 */}
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent relative rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse rounded-full shadow-[0_0_10px_white]" />
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

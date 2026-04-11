import { motion } from "framer-motion"
import type { WorkflowData } from "../../hooks/useDashboardData"
import { GitMerge, Database, PlayCircle, ArrowRight } from "lucide-react"

interface WorkflowViewerProps {
  workflows: WorkflowData[]
}

const NodeBox = ({ title, status, desc, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative z-10 glass-panel border border-white/10 p-4 rounded-xl min-w-[160px] flex-1 flex flex-col gap-2 bg-background/50 hover:bg-background/80 transition-colors"
  >
    <div className="flex items-center gap-2 text-sm font-semibold text-white">
      <Icon className="size-4 text-primary" />
      {title}
    </div>
    <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2" title={desc}>
      {desc}
    </div>
    <div className="mt-auto pt-2 flex gap-2">
      <span className="flex items-center gap-1.5 text-[10px] uppercase px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {status}
      </span>
    </div>
  </motion.div>
)

export function WorkflowViewer({ workflows }: WorkflowViewerProps) {
  // 自動取第一個來代表流程範例，或者 fallback
  const workflow = workflows && workflows.length > 0 ? workflows[0] : null
  const wfTitle = workflow?.name || "全局自動化腳本"
  const wfDesc = (workflow as any)?.description || "負責將掃描的 JSON 結構合併至前端渲染"

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden group">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10">
        <GitMerge className="text-primary size-4" />
        工作流檢視器
      </h2>
      <p className="text-lg font-bold text-foreground relative z-10 truncate mb-6">
        {wfTitle}
      </p>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 relative py-4 z-10">
        
        <NodeBox 
          title="資料搜集" 
          status="運行中" 
          desc="解析本地資料夾的所有狀態與日誌" 
          icon={Database} 
          delay={0.2} 
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hidden sm:flex text-muted-foreground/50"
        >
          <ArrowRight className="size-6" />
        </motion.div>
        
        <NodeBox 
          title="腳本執行" 
          status="處理中" 
          desc={wfDesc} 
          icon={PlayCircle} 
          delay={0.6} 
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="hidden sm:flex text-muted-foreground/50"
        >
          <ArrowRight className="size-6" />
        </motion.div>
        
        <NodeBox 
          title="狀態更新" 
          status="已完成" 
          desc="輸出並同步 JSON 至儀表板" 
          icon={GitMerge} 
          delay={1.0} 
        />

      </div>
    </div>
  )
}

import { motion } from "framer-motion"
import type { WorkflowData } from "../../hooks/useDashboardData"
import { GitMerge, Database, PlayCircle, Settings2 } from "lucide-react"

interface WorkflowViewerProps {
  workflows: WorkflowData[]
}

const NodeBox = ({ title, status, desc, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="relative z-10 glass-panel border border-white/10 p-3 rounded-lg min-w-[140px] flex flex-col gap-2 bg-background/50 hover:bg-background/80 transition-colors"
  >
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
      <Icon className="size-3 text-primary" />
      {title}
    </div>
    <div className="text-[10px] text-muted-foreground leading-tight">
      {desc}
    </div>
    <div className="mt-2 flex gap-2">
      <span className="flex items-center gap-1 text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary border border-primary/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {status}
      </span>
    </div>
  </motion.div>
)

export function WorkflowViewer({ workflows }: WorkflowViewerProps) {
  // 顯示第一個掃描到的工作流 (或模擬流程)
  const workflow = workflows[0]

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden">
      <h2 className="text-xl font-bold tracking-wider mb-2 flex items-center gap-2 relative z-10 text-foreground">
        <GitMerge className="text-primary size-5" />
        WORKFLOW VIEWER
      </h2>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6 relative z-10 truncate">
        {workflow?.name || "Global Automation Flow"}
      </p>

      <div className="flex-1 flex items-center justify-center relative p-8">
        
        {/* 背景網格線條 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        <div className="relative w-full max-w-[400px] aspect-[4/3] flex items-center justify-center perspective-1000">
          {/* Node 連接線 (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <motion.path
              d="M100,50 C150,50 150,150 200,150"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
            <motion.path
              d="M100,200 C150,200 150,150 200,150"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "linear", delay: 0.5 }}
            />
            <motion.path
              d="M280,150 L350,150"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              className="opacity-70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "linear", delay: 1 }}
            />
          </svg>

          {/* Nodes */}
          <div className="absolute top-[20px] left-0 transform -translate-y-1/2">
             <NodeBox title="Scrape Data" status="active" desc="Parse project structures" icon={Database} delay={0.2} />
          </div>
          <div className="absolute top-[280px] left-0 transform -translate-y-1/2">
             <NodeBox title="Parse markdown" status="pending" desc="Regex metadata extraction" icon={Settings2} delay={0.4} />
          </div>
          
          <div className="absolute top-[150px] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
             <NodeBox title="Processing" status="running" desc="Generate JSON payloads" icon={PlayCircle} delay={0.8} />
          </div>
          
          <div className="absolute top-[150px] right-0 transform -translate-y-1/2">
             <NodeBox title="Output" status="publish" desc="Sync to dashboard data" icon={GitMerge} delay={1.4} />
          </div>

        </div>
      </div>
    </div>
  )
}

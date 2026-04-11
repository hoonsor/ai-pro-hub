import { useState } from "react"
import { motion } from "framer-motion"
import type { WorkflowData } from "../../hooks/useDashboardData"
import { GitMerge, Copy, CheckCircle2 } from "lucide-react"

interface WorkflowsViewProps {
  workflows: WorkflowData[]
}

const CopyButton = ({ text, label }: { text: string, label?: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
        copied ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground"
      }`}
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  )
}

export function WorkflowsView({ workflows }: WorkflowsViewProps) {
  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-wider mb-2 flex items-center gap-2">
          <GitMerge className="text-primary size-6" />
          全域工作流目錄
        </h2>
        <p className="text-xs text-muted-foreground">自動化定義與 Schema</p>
      </div>

      <div className="flex flex-col gap-8">
        {workflows.map((wf, idx) => (
          <motion.div
            key={wf.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                {wf.name}
                <CopyButton text={wf.name} label="名稱" />
              </h3>
              <CopyButton text={wf.content} label="複製 Schema" />
            </div>
            
            <div className="relative rounded-xl overflow-hidden bg-[#0d1117] border border-white/10">
              {/* Syntax Highlighting CSS Fallback for MD */}
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 font-mono leading-relaxed" style={{ WebkitFontSmoothing: "antialiased" }}>
                <code>
                  {wf.content}
                </code>
              </pre>
            </div>
          </motion.div>
        ))}
        {workflows.length === 0 && (
          <div className="glass-panel py-12 text-center text-muted-foreground">
            系統中尚未掃描到任何工作流。
          </div>
        )}
      </div>
    </main>
  )
}

import { useState } from "react"
import { motion } from "framer-motion"
import type { SkillData } from "../../hooks/useDashboardData"
import { Cpu, Copy, CheckCircle2 } from "lucide-react"

interface SkillsViewProps {
  skills: SkillData[]
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-all ${
        copied ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
      }`}
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}

export function SkillsView({ skills }: SkillsViewProps) {
  const [search, setSearch] = useState("")

  // Collect all unique tags for filter
  const allTags = Array.from(new Set(skills.flatMap(s => s.tags || []))).sort()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredSkills = skills.filter(skill => {
    const matchSearch = skill.name.toLowerCase().includes(search.toLowerCase()) || 
                        skill.display_name?.toLowerCase().includes(search.toLowerCase()) ||
                        skill.description?.toLowerCase().includes(search.toLowerCase())
    
    // Tag filter: if no tags selected, match all. Otherwise must match ALL selected tags (or ANY depending on design logic, here we do ANY for broader results)
    const matchTags = selectedTags.length === 0 || 
                      selectedTags.some(tag => skill.tags?.includes(tag))
    
    return matchSearch && matchTags
  })

  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="text-primary size-6" />
            全域技能目錄
          </h2>
          <p className="text-xs text-muted-foreground">管理並整合您的工作流模組</p>
        </div>
        
        <input 
          type="text" 
          placeholder="搜尋技能名稱或說明..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-panel px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm"
        />
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              selectedTags.includes(tag) 
                ? "bg-primary/20 border-primary/50 text-foreground" 
                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSkills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="glass-panel p-6 rounded-2xl flex flex-col h-full group hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  {skill.display_name || skill.name}
                </h3>
                <CopyButton text={skill.name} />
              </div>
            </div>
            
            <p className="text-sm text-foreground/70 mb-4 flex-1">
              {skill.description || "無提供說明。"}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
              {skill.tags?.map(tag => (
                <span key={tag} className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {filteredSkills.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            找不到符合條件的技能。
          </div>
        )}
      </div>
    </main>
  )
}

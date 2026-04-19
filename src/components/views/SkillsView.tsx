import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { SkillData } from "../../hooks/useDashboardData"
import { Cpu, Copy, CheckCircle2, X, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"

interface SkillsViewProps {
  skills: SkillData[]
}

const PAGE_SIZE = 24

// ─── Copy Button ──────────────────────────────────────────────────────────────
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`p-1.5 rounded-md transition-all ${copied ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"}`}
      title="複製技能名稱"
    >
      {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}

// ─── AND / OR Toggle ──────────────────────────────────────────────────────────
const LogicToggle = ({ mode, onChange }: { mode: "AND" | "OR"; onChange: (m: "AND" | "OR") => void }) => (
  <div className="flex items-center gap-1 glass-panel p-1 rounded-xl border border-white/10">
    <span className="text-xs text-muted-foreground px-2">標籤邏輯</span>
    {(["OR", "AND"] as const).map(m => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
          mode === m
            ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {m === "OR" ? "任一 (OR)" : "全含 (AND)"}
      </button>
    ))}
  </div>
)

// ─── Tag Chip (selected) ──────────────────────────────────────────────────────
const TagChip = ({ tag, onRemove }: { tag: string; onRemove: () => void }) => (
  <motion.span
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-primary/20 border border-primary/40 text-primary font-medium"
  >
    {tag}
    <button onClick={onRemove} className="hover:text-white transition-colors ml-0.5">
      <X className="size-3" />
    </button>
  </motion.span>
)

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1
    if (page >= totalPages - 3) return totalPages - 6 + i
    return page - 3 + i
  })
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="p-1.5 rounded-lg glass-panel disabled:opacity-30 hover:border-primary/30 transition-all">
        <ChevronLeft className="size-4" />
      </button>
      {pages[0] > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1 text-xs rounded-lg glass-panel hover:border-primary/30">1</button><span className="text-muted-foreground px-1">…</span></>}
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-3 py-1 text-xs rounded-lg transition-all font-mono ${p === page ? "bg-primary/20 border border-primary/50 text-primary" : "glass-panel hover:border-primary/30"}`}>
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && <><span className="text-muted-foreground px-1">…</span><button onClick={() => onChange(totalPages)} className="px-3 py-1 text-xs rounded-lg glass-panel hover:border-primary/30">{totalPages}</button></>}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="p-1.5 rounded-lg glass-panel disabled:opacity-30 hover:border-primary/30 transition-all">
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────
export function SkillsView({ skills }: SkillsViewProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [logicMode, setLogicMode] = useState<"AND" | "OR">("OR")
  const [page, setPage] = useState(1)

  // All unique tags with count
  const allTagsWithCount = useMemo(() => {
    const counts: Record<string, number> = {}
    skills.forEach(s => (s.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1 }))
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [skills])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    setPage(1)
  }

  const clearAll = () => { setSelectedTags([]); setSearch(""); setPage(1) }

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.display_name?.toLowerCase().includes(q) ||
        skill.description?.toLowerCase().includes(q)

      const matchTags = selectedTags.length === 0
        ? true
        : logicMode === "OR"
          ? selectedTags.some(t => skill.tags?.includes(t))   // OR: 任一標籤
          : selectedTags.every(t => skill.tags?.includes(t))  // AND: 全部標籤

      return matchSearch && matchTags
    })
  }, [skills, search, selectedTags, logicMode])

  const totalPages = Math.ceil(filteredSkills.length / PAGE_SIZE)
  const pagedSkills = filteredSkills.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilter = selectedTags.length > 0 || search !== ""

  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-4">

      {/* ─── Header Row ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <Cpu className="text-primary size-6" />
            全域技能目錄
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            共 <span className="text-primary font-bold">{filteredSkills.length}</span> / {skills.length} 個技能
            {selectedTags.length > 0 && (
              <span className="ml-2 text-muted-foreground/60">
                · 已選 {selectedTags.length} 個標籤（{logicMode} 模式）
              </span>
            )}
          </p>
        </div>

        {/* Search + Logic Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜尋技能..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="glass-panel pl-8 pr-4 py-2 w-52 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm"
            />
          </div>
          <LogicToggle mode={logicMode} onChange={m => { setLogicMode(m); setPage(1) }} />
          {hasFilter && (
            <button onClick={clearAll}
              className="flex items-center gap-1 px-3 py-2 text-xs rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all">
              <X className="size-3" /> 清除篩選
            </button>
          )}
        </div>
      </div>

      {/* ─── Selected Tag Chips ─── */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <Filter className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">已選：</span>
            <AnimatePresence>
              {selectedTags.map(tag => (
                <TagChip key={tag} tag={tag} onRemove={() => toggleTag(tag)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Tag Filter Pills ─── */}
      <div className="flex flex-wrap gap-2">
        {allTagsWithCount.map(([tag, count]) => {
          const active = selectedTags.includes(tag)
          // Count how many skills would match if this tag were added
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all ${
                active
                  ? "bg-primary/20 border-primary/60 text-primary font-semibold shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20 hover:text-foreground"
              }`}
            >
              {tag}
              <span className={`font-mono text-[10px] px-1 py-0.5 rounded ${active ? "bg-primary/30" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── AND-mode notice ─── */}
      {logicMode === "AND" && selectedTags.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs"
        >
          <span className="font-bold">AND 模式：</span>
          結果只顯示同時包含所有 {selectedTags.length} 個標籤的技能。若結果為 0，請改用 OR 模式。
        </motion.div>
      )}

      {/* ─── Skill Cards Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {pagedSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="glass-panel p-5 rounded-2xl flex flex-col group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {skill.display_name || skill.name}
                  </h3>
                  <CopyButton text={skill.name} />
                </div>
              </div>

              <p className="text-xs text-foreground/60 mb-4 flex-1 line-clamp-3">
                {skill.description || "無提供說明。"}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/5">
                {skill.tags?.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { if (!selectedTags.includes(tag)) toggleTag(tag) }}
                    className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-primary/25 text-primary border border-primary/30"
                        : "bg-primary/8 text-primary/70 hover:bg-primary/15 hover:text-primary"
                    }`}
                    title={`點擊加入篩選: ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground space-y-2">
            <p className="text-lg">找不到符合條件的技能</p>
            {logicMode === "AND" && selectedTags.length > 1 && (
              <p className="text-xs">
                試試切換為 <button onClick={() => setLogicMode("OR")} className="text-primary underline">OR 模式</button> 以放寬條件
              </p>
            )}
            {search && (
              <p className="text-xs">
                或<button onClick={() => setSearch("")} className="text-primary underline ml-1">清除搜尋詞</button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── Pagination ─── */}
      <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }} />
    </main>
  )
}

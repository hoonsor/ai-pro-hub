import { useState, useMemo, useCallback } from "react"
import type { SkillData } from "../../hooks/useDashboardData"
import { Cpu, Copy, CheckCircle2, X, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"

interface SkillsViewProps {
  skills: SkillData[]
}

const PAGE_SIZE = 24

// ─── Copy Button (no animation lib) ─────────────────────────────────────────
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className={`p-1.5 rounded-md transition-colors ${
        copied ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
      }`}
      title="複製技能名稱"
    >
      {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}

// ─── AND / OR Toggle ─────────────────────────────────────────────────────────
const LogicToggle = ({ mode, onChange }: { mode: "AND" | "OR"; onChange: (m: "AND" | "OR") => void }) => (
  <div className="flex items-center gap-1 glass-panel p-1 rounded-xl border border-white/10">
    <span className="text-xs text-muted-foreground px-2">邏輯</span>
    {(["OR", "AND"] as const).map(m => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
          mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {m === "OR" ? "任一 OR" : "全含 AND"}
      </button>
    ))}
  </div>
)

// ─── Pagination ──────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onChange }: {
  page: number; totalPages: number; onChange: (p: number) => void
}) => {
  if (totalPages <= 1) return null
  const start = Math.max(1, Math.min(page - 3, totalPages - 6))
  const pages = Array.from({ length: Math.min(7, totalPages) }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="p-1.5 rounded-lg glass-panel disabled:opacity-30 transition-colors hover:border-primary/30">
        <ChevronLeft className="size-4" />
      </button>
      {pages[0] > 1 && (
        <><button onClick={() => onChange(1)} className="px-3 py-1 text-xs rounded-lg glass-panel">1</button>
        <span className="text-muted-foreground px-1 text-xs">…</span></>
      )}
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors font-mono ${
            p === page ? "bg-primary/20 border border-primary/50 text-primary" : "glass-panel hover:border-primary/30"
          }`}>
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <><span className="text-muted-foreground px-1 text-xs">…</span>
        <button onClick={() => onChange(totalPages)} className="px-3 py-1 text-xs rounded-lg glass-panel">{totalPages}</button></>
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="p-1.5 rounded-lg glass-panel disabled:opacity-30 transition-colors hover:border-primary/30">
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

// ─── Main View ───────────────────────────────────────────────────────────────
export function SkillsView({ skills }: SkillsViewProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [logicMode, setLogicMode] = useState<"AND" | "OR">("OR")
  const [page, setPage] = useState(1)

  // All unique tags with count — computed once
  const allTagsWithCount = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of skills) {
      for (const t of s.tags || []) counts[t] = (counts[t] || 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [skills])

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    setPage(1)
  }, [])

  const clearAll = () => { setSelectedTags([]); setSearch(""); setPage(1) }

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase()
    return skills.filter(skill => {
      if (q && !(
        skill.name.toLowerCase().includes(q) ||
        skill.display_name?.toLowerCase().includes(q) ||
        skill.description?.toLowerCase().includes(q)
      )) return false

      if (selectedTags.length === 0) return true
      return logicMode === "OR"
        ? selectedTags.some(t => skill.tags?.includes(t))
        : selectedTags.every(t => skill.tags?.includes(t))
    })
  }, [skills, search, selectedTags, logicMode])

  const totalPages = Math.ceil(filteredSkills.length / PAGE_SIZE)
  const pagedSkills = filteredSkills.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilter = selectedTags.length > 0 || search !== ""

  const goPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  return (
    <main className="container mx-auto px-4 lg:px-8 space-y-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <Cpu className="text-primary size-6" />
            全域技能目錄
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            顯示 <span className="text-primary font-bold">{filteredSkills.length}</span> / {skills.length} 個技能
            {selectedTags.length > 0 && (
              <span className="ml-2 opacity-60">· {selectedTags.length} 個標籤 ({logicMode})</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="搜尋技能..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="glass-panel pl-8 pr-4 py-2 w-48 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm"
            />
          </div>
          <LogicToggle mode={logicMode} onChange={m => { setLogicMode(m); setPage(1) }} />
          {hasFilter && (
            <button onClick={clearAll}
              className="flex items-center gap-1 px-3 py-2 text-xs rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
              <X className="size-3" /> 清除
            </button>
          )}
        </div>
      </div>

      {/* Selected tag chips */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">已選：</span>
          {selectedTags.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg bg-primary/20 border border-primary/40 text-primary">
              {tag}
              <button onClick={() => toggleTag(tag)} className="hover:text-white transition-colors">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {allTagsWithCount.map(([tag, count]) => {
          const active = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors ${
                active
                  ? "bg-primary/20 border-primary/50 text-primary font-semibold"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {tag}
              <span className={`font-mono text-[10px] px-1 rounded ${active ? "bg-primary/30" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* AND mode hint */}
      {logicMode === "AND" && selectedTags.length >= 2 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          <span className="font-bold">AND 模式：</span>
          只顯示同時含有所有 {selectedTags.length} 個標籤的技能。結果為 0 時請
          <button onClick={() => setLogicMode("OR")} className="underline ml-0.5">改用 OR</button>
        </div>
      )}

      {/* Skill Cards — plain divs, no Framer Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {pagedSkills.map(skill => (
          <div
            key={skill.name}
            className="glass-panel p-4 rounded-2xl flex flex-col hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {skill.display_name || skill.name}
                </h3>
                <CopyButton text={skill.name} />
              </div>
            </div>

            <p className="text-xs text-foreground/60 mb-3 flex-1 whitespace-pre-wrap">
              {skill.description || "無提供說明。"}
            </p>

            <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-white/5">
              {skill.tags?.map(tag => (
                <button
                  key={tag}
                  onClick={() => { if (!selectedTags.includes(tag)) toggleTag(tag) }}
                  title={`篩選: ${tag}`}
                  className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-primary/25 text-primary border border-primary/30"
                      : "bg-primary/8 text-primary/70 hover:bg-primary/15"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            <p className="text-lg mb-2">找不到符合條件的技能</p>
            {logicMode === "AND" && selectedTags.length > 1 && (
              <button onClick={() => setLogicMode("OR")} className="text-xs text-primary underline">
                切換為 OR 模式放寬條件
              </button>
            )}
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={goPage} />
    </main>
  )
}

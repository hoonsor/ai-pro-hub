import { useTheme } from "../ThemeProvider"
import { Hexagon, User, Menu, ChevronDown, Check, Palette } from "lucide-react"
import type { TabType } from "../../App"
import { useState } from "react"

interface HeaderProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

const TABS: { id: TabType; label: string }[] = [
  { id: "DASHBOARD", label: "儀表板" },
  { id: "PROJECTS", label: "專案庫" },
  { id: "SKILLS", label: "全域技能" },
  { id: "WORKFLOW", label: "工作流" }
]

const THEMES = [
  { id: "deep-space", name: "深空湛藍" },
  { id: "neon-purple", name: "賽博霓虹" },
  { id: "emerald-matrix", name: "駭客翠綠" },
  { id: "crimson-forge", name: "深紅熔爐" }
]

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)

  return (
    <header className="glass-panel sticky top-4 z-50 rounded-2xl mx-4 lg:mx-8 mb-8 px-6 py-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab("DASHBOARD")}
          >
            <Hexagon className="text-primary size-7 fill-primary/20 animate-[spin_10s_linear_infinite]" />
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              AI PRO HUB
            </h1>
          </div>

          <nav className="hidden md:flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5 mx-4">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-primary/20 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="px-3 py-1.5 rounded-lg glass-panel-hover text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm border border-white/5"
            >
              <Palette className="size-4" />
              <span className="hidden sm:inline-block">
                {THEMES.find(t => t.id === theme)?.name || "佈景主題"}
              </span>
              <ChevronDown className={`size-3 transition-transform ${themeDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col z-50">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as any)
                      setThemeDropdownOpen(false)
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      theme === t.id ? "bg-primary/20 text-primary" : "text-foreground hover:bg-white/10"
                    }`}
                  >
                    {t.name}
                    {theme === t.id && <Check className="size-3" />}
                  </button>
                ))}
              </div>
            )}
            
            {/* 點擊外部關閉選單 */}
            {themeDropdownOpen && (
              <div 
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setThemeDropdownOpen(false)}
              />
            )}
          </div>

          <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 shrink-0 shadow-[0_0_8px_var(--primary)]">
            <User className="size-4 text-primary" />
          </div>

          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-primary glass-panel rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setMobileMenuOpen(false)
              }}
              className={`px-4 py-2 text-left rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

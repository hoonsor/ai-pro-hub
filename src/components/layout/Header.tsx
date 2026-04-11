import { useTheme } from "../ThemeProvider"
import { Hexagon, User, Menu } from "lucide-react"
import type { TabType } from "../../App"
import { useState } from "react"

interface HeaderProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

const TABS: TabType[] = ["DASHBOARD", "PROJECTS", "SKILLS", "WORKFLOW"]

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cycleTheme = () => {
    const themes: any[] = ["deep-space", "neon-purple", "emerald-matrix", "crimson-forge"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  return (
    <header className="glass-panel sticky top-4 z-50 rounded-2xl mx-4 lg:mx-8 mb-8 px-6 py-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("DASHBOARD")}
          >
            <Hexagon className="text-primary size-7 fill-primary/20 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
              AI PRO HUB
            </h1>
          </div>

          <nav className="hidden md:flex gap-1">
            {TABS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item
                    ? "bg-white/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full glass-panel-hover text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            title="切換佈景主題"
          >
            <div className="flex items-center gap-1 text-xs px-2">
              <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              <span className="opacity-70 hidden sm:inline-block capitalize">{theme.replace("-", " ")}</span>
            </div>
          </button>

          <div className="h-10 w-10 glass-panel rounded-full flex items-center justify-center border border-white/20">
            <User className="size-5 text-primary" />
          </div>

          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveTab(item)
                setMobileMenuOpen(false)
              }}
              className={`px-4 py-2 text-left rounded-xl text-sm font-semibold transition-all ${
                activeTab === item
                  ? "bg-white/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

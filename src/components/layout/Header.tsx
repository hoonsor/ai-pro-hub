import { useTheme } from "../ThemeProvider"
import { Hexagon, User } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const themes: any[] = ["deep-space", "neon-purple", "emerald-matrix", "crimson-forge"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  return (
    <header className="glass-panel sticky top-4 z-50 rounded-2xl mx-4 lg:mx-8 mb-8 px-6 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <Hexagon className="text-primary size-7 fill-primary/20 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI PRO HUB
          </h1>
        </div>

        <nav className="hidden md:flex gap-1">
          {["DASHBOARD", "PROJECTS", "SKILLS", "WORKFLOW"].map((item, idx) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                idx === 0
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
      </div>
    </header>
  )
}

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = 
  | "aurora-dusk" 
  | "ocean-breeze" 
  | "sakura-garden" 
  | "golden-hour"
  | "macaron-peach"
  | "macaron-mint"
  | "macaron-lavender"
  | "macaron-lemon"

const VALID_THEMES: Theme[] = [
  "aurora-dusk", "ocean-breeze", "sakura-garden", "golden-hour",
  "macaron-peach", "macaron-mint", "macaron-lavender", "macaron-lemon"
]

const ALL_THEME_CLASSES = [
  "theme-ocean-breeze", "theme-sakura-garden", "theme-golden-hour",
  "theme-macaron-peach", "theme-macaron-mint", "theme-macaron-lavender", "theme-macaron-lemon"
]

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "aurora-dusk",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("ui-theme") as Theme
    if (savedTheme && VALID_THEMES.includes(savedTheme)) return savedTheme
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes first
    root.classList.remove(...ALL_THEME_CLASSES)

    // Add selected theme class (if not default)
    if (theme !== "aurora-dusk") {
      root.classList.add(`theme-${theme}`)
    }
    
    localStorage.setItem("ui-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

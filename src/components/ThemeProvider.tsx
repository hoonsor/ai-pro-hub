import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "aurora-dusk" | "ocean-breeze" | "sakura-garden" | "golden-hour"

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
    // If the saved theme is from the old set, reset to default
    const validThemes: Theme[] = ["aurora-dusk", "ocean-breeze", "sakura-garden", "golden-hour"]
    if (savedTheme && validThemes.includes(savedTheme)) return savedTheme
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes first
    root.classList.remove(
      "theme-ocean-breeze", 
      "theme-sakura-garden", 
      "theme-golden-hour"
    )

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

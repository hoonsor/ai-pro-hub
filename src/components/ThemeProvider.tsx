import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "deep-space" | "neon-purple" | "emerald-matrix" | "crimson-forge"

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
  defaultTheme = "deep-space",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("ui-theme") as Theme
    return savedTheme || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all theme classes first
    root.classList.remove(
      "theme-neon-purple", 
      "theme-emerald-matrix", 
      "theme-crimson-forge"
    )

    // Add selected theme class (if not default)
    if (theme !== "deep-space") {
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

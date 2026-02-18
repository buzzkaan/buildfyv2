"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 border border-border flex items-center justify-center">
        <div className="w-3.5 h-3.5" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative w-8 h-8 border border-border bg-secondary/30 flex items-center justify-center transition-all duration-300 hover:border-accent hover:bg-accent/10"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={`h-3.5 w-3.5 transition-all duration-300 absolute ${
          isDark
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100 text-accent"
        }`}
      />
      <Moon
        className={`h-3.5 w-3.5 transition-all duration-300 absolute ${
          isDark
            ? "opacity-100 rotate-0 scale-100 text-accent"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  )
}

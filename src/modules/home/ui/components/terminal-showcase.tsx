"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

const LINES = [
  { type: "prompt", text: "> buildfy create --template landing-page" },
  { type: "info", text: "  Analyzing prompt..." },
  { type: "info", text: "  Generating component tree..." },
  { type: "success", text: "  [OK] Hero section created" },
  { type: "success", text: "  [OK] Features grid generated" },
  { type: "success", text: "  [OK] Pricing table built" },
  { type: "success", text: "  [OK] Footer component ready" },
  { type: "info", text: "  Bundling assets..." },
  { type: "success", text: "  [OK] Build complete in 3.2s" },
  { type: "output", text: "  -> https://your-site.buildfy.app" },
  { type: "prompt", text: "> _" },
] as const

type LineType = (typeof LINES)[number]["type"]

const LINE_STYLES: Record<LineType, string> = {
  prompt: "text-accent",
  success: "text-foreground/80",
  output: "text-accent underline",
  info: "text-muted-foreground",
}

export function TerminalShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= LINES.length) clearInterval(interval)
    }, 250)

    return () => clearInterval(interval)
  }, [isInView])

  return (
    <section ref={ref} className="relative px-6 md:px-10 py-24 md:py-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            How it works
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h2 className="font-sans text-xl md:text-3xl font-semibold text-foreground text-center mb-4 tracking-tight text-balance">
          From prompt to production in seconds
        </h2>
        <p className="font-mono text-sm text-muted-foreground text-center mb-12 max-w-lg mx-auto leading-relaxed">
          Describe what you want. Buildfy writes the code, deploys it, and gives you a live URL.
        </p>

        <div className="border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-accent/60" />
              <div className="w-2.5 h-2.5 bg-muted-foreground/30" />
              <div className="w-2.5 h-2.5 bg-muted-foreground/30" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              buildfy-cli v0.1.0
            </span>
          </div>

          <div className="p-5 md:p-8 font-mono text-sm leading-relaxed min-h-[320px]">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={cn("mb-1", LINE_STYLES[line.type])}
              >
                {line.text}
              </motion.div>
            ))}
            {visibleLines < LINES.length && isInView && (
              <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

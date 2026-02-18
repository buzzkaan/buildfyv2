"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"

const stackItems = [
  {
    id: "st-01",
    name: "Next.js & React",
    description: "Every project is built on Next.js with server components, app router, and optimized bundling.",
    signal: "FRAMEWORK",
    tags: ["SSR", "App Router", "React 19"],
  },
  {
    id: "st-02",
    name: "Tailwind CSS",
    description: "Utility-first styling with responsive design, dark mode, and consistent design tokens out of the box.",
    signal: "STYLING",
    tags: ["Responsive", "Dark Mode", "Tokens"],
  },
  {
    id: "st-03",
    name: "shadcn/ui Components",
    description: "Production-grade UI components — buttons, cards, inputs, modals, tables — styled to your design.",
    signal: "COMPONENTS",
    tags: ["Radix", "Accessible", "Customizable"],
  },
  {
    id: "st-04",
    name: "E2B Sandboxes",
    description: "Instant cloud sandboxes for live preview. Each project runs in an isolated environment.",
    signal: "RUNTIME",
    tags: ["Isolated", "Fast", "Secure"],
  },
  {
    id: "st-05",
    name: "AI Agent System",
    description: "Multi-step AI agents that plan, generate, and iterate on your code autonomously.",
    signal: "AI ENGINE",
    tags: ["Inngest", "Multi-step", "Autonomous"],
  },
  {
    id: "st-06",
    name: "TypeScript",
    description: "Full type safety across your entire project. Clean, maintainable, production-ready code.",
    signal: "LANGUAGE",
    tags: ["Type-safe", "IntelliSense", "Strict"],
  },
]

export function DesignSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              SYS.STACK
            </span>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>

        <h2 className="font-sans text-lg md:text-2xl font-semibold text-foreground mb-2 tracking-tight">
          Built on modern foundations
        </h2>
        <p className="font-mono text-xs text-muted-foreground mb-10 max-w-md leading-relaxed">
          Every project Buildfy generates uses battle-tested, production-grade technologies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
          {stackItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="group flex flex-col bg-background p-6 h-full hover:bg-card/50 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent/70" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                    {item.signal}
                  </span>
                </div>
                <BitmapChevron className="h-3 w-3 text-accent/0 group-hover:text-accent transition-colors duration-200" />
              </div>

              <h3 className="font-sans text-sm font-medium text-foreground tracking-tight mb-2">
                <ScrambleTextOnHover text={item.name} duration={0.3} />
              </h3>

              <p className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed mb-5 flex-1">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/30">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 border border-border/30 px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

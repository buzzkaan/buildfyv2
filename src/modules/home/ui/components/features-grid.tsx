"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"

const features = [
  {
    id: "01",
    title: "AI Code Generation",
    description:
      "Describe any UI and watch Buildfy generate production-ready React, Next.js, and Tailwind code in real-time.",
  },
  {
    id: "02",
    title: "Live Preview",
    description:
      "See your changes instantly in a side-by-side preview panel. No context-switching, no manual reloads.",
  },
  {
    id: "03",
    title: "One-Click Deploy",
    description:
      "Ship to production with a single click. Every project gets a unique URL, SSL, and CDN out of the box.",
  },
  {
    id: "04",
    title: "Iterative Editing",
    description:
      "Chat naturally to refine your design. Change colors, layouts, copy, and functionality through conversation.",
  },
  {
    id: "05",
    title: "Component Library",
    description:
      "Access hundreds of pre-built components. Buildfy combines and customizes them to match your vision.",
  },
  {
    id: "06",
    title: "Export & Own",
    description:
      "Download your full source code anytime. No lock-in. The code is yours to host, modify, and extend.",
  },
]

export function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative px-6 md:px-10 py-24 md:py-40 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            SYS.CAPABILITIES
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h2 className="font-sans text-xl md:text-3xl font-semibold text-foreground mb-16 tracking-tight max-w-lg">
          Everything you need to build, ship, and iterate — powered by AI.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group bg-background p-6 md:p-8 flex flex-col gap-4 hover:bg-card/50 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  {feature.id}
                </span>
                <BitmapChevron className="text-accent/0 group-hover:text-accent transition-colors duration-200" />
              </div>
              <h3 className="font-sans text-base font-semibold text-foreground tracking-tight">
                <ScrambleTextOnHover text={feature.title} duration={0.4} />
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"

const showcaseItems = [
  { prompt: "Build a SaaS landing page with pricing", type: "Landing Page", time: "2.8s" },
  { prompt: "Create an admin dashboard with charts", type: "Dashboard", time: "4.1s" },
  { prompt: "Build an e-commerce store with cart", type: "E-Commerce", time: "5.3s" },
  { prompt: "Make a portfolio site with dark theme", type: "Portfolio", time: "2.1s" },
  { prompt: "Build a blog with markdown support", type: "Blog", time: "3.6s" },
]

export function ShowcaseSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative px-6 md:px-10 py-24 md:py-40 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            LOG.RECENT
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h2 className="font-sans text-xl md:text-3xl font-semibold text-foreground mb-4 tracking-tight max-w-lg">
          Built with Buildfy
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-12 max-w-md leading-relaxed">
          Real projects generated from simple prompts. Each one took less than 6 seconds.
        </p>

        <div className="border border-border">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/20">
            <span className="col-span-7 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Prompt
            </span>
            <span className="col-span-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Type
            </span>
            <span className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
              Time
            </span>
          </div>

          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.prompt}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="group grid grid-cols-12 gap-4 px-5 py-4 border-b border-border/40 last:border-b-0 hover:bg-card/30 transition-colors duration-200 cursor-pointer"
            >
              <div className="col-span-7 flex items-center gap-3">
                <BitmapChevron className="text-accent/0 group-hover:text-accent transition-colors duration-200 shrink-0 hidden md:block" />
                <span className="font-mono text-xs text-foreground/80 group-hover:text-foreground transition-colors truncate">
                  <ScrambleTextOnHover text={item.prompt} duration={0.3} />
                </span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5">
                  {item.type}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-mono text-xs text-accent">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

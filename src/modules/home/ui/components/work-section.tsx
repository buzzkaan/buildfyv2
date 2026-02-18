"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const capabilities = [
  { title: "AI Code Generation", medium: "Core Engine", description: "Describe what you want in plain language. Buildfy writes production-ready code with Next.js, Tailwind, and modern frameworks.", span: "col-span-2 row-span-2" },
  { title: "Instant Preview", medium: "Live Sandbox", description: "See your app running live in seconds with a real deployment URL.", span: "col-span-1 row-span-1" },
  { title: "Template Library", medium: "Quick Start", description: "Start from pre-built templates — dashboards, stores, portfolios, and more.", span: "col-span-1 row-span-2" },
  { title: "Iterative Chat", medium: "Conversation", description: "Refine your project through natural conversation. Each message builds on the last.", span: "col-span-1 row-span-1" },
  { title: "Visual Editor", medium: "Inline Edit", description: "Click any element in the preview to edit styles, text, and layout directly.", span: "col-span-2 row-span-1" },
  { title: "One-Click Deploy", medium: "Production", description: "Ship to production with a single click. Your app gets a live URL instantly.", span: "col-span-1 row-span-1" },
]

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 90%", toggleActions: "play none none reverse" },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 90%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-16 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Capabilities</span>
            <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">HOW IT WORKS</h2>
          </div>
          <p className="hidden md:block max-w-xs font-mono text-xs text-muted-foreground text-right leading-relaxed">
            From prompt to production — everything you need to build with AI.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]">
          {capabilities.map((item, index) => (
            <WorkCard key={index} experiment={item} index={index} persistHover={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
}: {
  experiment: { title: string; medium: string; description: string; span: string }
  index: number
  persistHover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)

  useEffect(() => {
    if (!persistHover || !cardRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        onEnter: () => setIsScrollActive(true),
      })
    }, cardRef)
    return () => ctx.revert()
  }, [persistHover])

  const isActive = isHovered || isScrollActive

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden",
        experiment.span,
        isActive && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("absolute inset-0 bg-accent/5 transition-opacity duration-500", isActive ? "opacity-100" : "opacity-0")} />
      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{experiment.medium}</span>
        <h3 className={cn("mt-3 font-[var(--font-bebas)] text-2xl md:text-4xl tracking-tight transition-colors duration-300", isActive ? "text-accent" : "text-foreground")}>
          {experiment.title}
        </h3>
      </div>
      <div className="relative z-10">
        <p className={cn("font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]", isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          {experiment.description}
        </p>
      </div>
      <span className={cn("absolute bottom-4 right-4 font-mono text-[10px] transition-colors duration-300", isActive ? "text-accent" : "text-muted-foreground/40")}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={cn("absolute top-0 right-0 w-12 h-12 transition-all duration-500", isActive ? "opacity-100" : "opacity-0")}>
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}

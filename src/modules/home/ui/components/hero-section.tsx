"use client"

import { AnimatedNoise } from "@/components/animated-noise"
import { BuildfyLogo } from "@/components/buildfy-logo"
import { motion } from "framer-motion"
import { ProjectForm } from "./project-form"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center px-6 pt-36 md:pt-44 pb-20 min-h-[92vh] overflow-hidden"
    >
      <AnimatedNoise opacity={0.025} />

      {/* Ambient glow — centered on the form */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 62%, oklch(0.6 0.2 45 / 0.11) 0%, transparent 70%)",
        }}
      />

      {/* Decorative horizontal rules */}
      <div className="pointer-events-none absolute inset-x-0 top-[38%] h-px bg-border/20" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-[62%] h-px bg-border/10" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">

        {/* Logo lockup */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex items-center gap-3 mb-14"
        >
          <BuildfyLogo size={28} animate={false} />
          <div className="w-px h-4 bg-border/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/50">
            AI Web Builder
          </span>
        </motion.div>

        {/* Display headline */}
        <div className="text-center w-full mb-3 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-display uppercase leading-[0.88] tracking-tight text-foreground"
            style={{ fontSize: "clamp(3.8rem, 13vw, 9.5rem)" }}
          >
            Build{" "}
            <span className="text-accent italic">Anything</span>
          </motion.h1>
        </div>

        {/* Subheadline rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl h-px bg-border/40 mb-5 origin-left"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="font-mono text-[11px] md:text-xs text-muted-foreground/55 uppercase tracking-[0.3em] text-center mb-12"
        >
          Describe your app &mdash; AI writes the code &mdash; ship in seconds
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="w-full max-w-2xl"
          style={{
            filter: "drop-shadow(0 0 32px oklch(0.6 0.2 45 / 0.12))",
          }}
        >
          <ProjectForm />
        </motion.div>
      </div>
    </section>
  )
}

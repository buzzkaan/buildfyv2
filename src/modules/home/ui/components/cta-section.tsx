"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { BuildfyLogo } from "@/components/buildfy-logo"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative px-6 md:px-10 py-24 md:py-40 border-t border-border/40">
      <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <BuildfyLogo size={48} animate={false} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-sans text-2xl md:text-4xl font-semibold text-foreground mt-8 tracking-tight text-balance"
        >
          Start building with AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-mono text-sm text-muted-foreground mt-4 max-w-md leading-relaxed"
        >
          No credit card required. Describe what you want to build and get a live site in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10"
        >
          <SignedOut>
            <SignUpButton>
              <button className="group inline-flex items-center gap-3 border border-accent bg-accent text-accent-foreground px-8 py-3.5 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-transparent hover:text-accent">
                Get Started Free
                <BitmapChevron className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 border border-accent bg-accent text-accent-foreground px-8 py-3.5 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:bg-transparent hover:text-accent"
            >
              Go to Dashboard
              <BitmapChevron className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </SignedIn>
        </motion.div>
      </div>
    </section>
  )
}

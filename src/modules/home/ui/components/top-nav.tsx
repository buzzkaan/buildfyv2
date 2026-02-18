"use client"

import { BuildfyLogo } from "@/components/buildfy-logo"
import { ScrambleText } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs"
import { UserControl } from "./user-control"
import Link from "next/link"

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md">
      {/* Accent top rule */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent) 30%, oklch(0.75 0.18 55) 50%, var(--accent) 70%, transparent 100%)",
        }}
      />

      {/* Nav row */}
      <div className="border-b border-border/30 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-13">
          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <BuildfyLogo size={22} animate={false} />
            <div className="w-px h-3.5 bg-border/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/80 group-hover:text-accent transition-colors duration-300">
              <ScrambleText text="Buildfy" duration={0.6} />
            </span>
          </Link>

          {/* Center — system status (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground/40">
              All systems operational
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <SignedOut>
              <SignUpButton>
                <button className="group flex items-center gap-2 border border-accent bg-accent text-accent-foreground px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 hover:bg-transparent hover:text-accent">
                  Get Started
                  <BitmapChevron className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserControl showName />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

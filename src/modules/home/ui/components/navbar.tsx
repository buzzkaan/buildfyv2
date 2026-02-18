"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"
import { UserControl } from "./user-control"
import { BuildfyLogo } from "@/components/buildfy-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useScroll } from "@/hooks/use-scroll"

export const Navbar = () => {
  const isScrolled = useScroll()
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 border-b border-transparent",
        isScrolled && "bg-background/80 backdrop-blur-md border-border/40",
      )}
    >
      <Link href="/" className="flex items-center gap-3 group">
        <BuildfyLogo size={24} />
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors duration-200">
          Buildfy
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignedOut>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-200">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="font-mono text-xs uppercase tracking-[0.15em] border border-accent/60 px-4 py-2 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  )
}

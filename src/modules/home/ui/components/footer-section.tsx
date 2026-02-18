"use client"

import { BuildfyLogo } from "@/components/buildfy-logo"
import Link from "next/link"

const productLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "#" },
  { label: "Changelog", href: "#" },
]

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "Status", href: "#" },
]

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
]

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
]

export function FooterSection() {
  return (
    <footer className="border-t border-border/40 px-6 md:px-10 pt-16 pb-8 relative overflow-hidden">
      {/* Large wordmark watermark */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 font-display uppercase leading-none text-border/[0.06] select-none whitespace-nowrap"
        style={{ fontSize: "clamp(6rem, 20vw, 18rem)" }}
        aria-hidden="true"
      >
        BUILDFY
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <BuildfyLogo size={22} animate={false} />
              <div className="w-px h-3.5 bg-border/50" />
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/80">
                Buildfy
              </span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground/55 leading-relaxed max-w-xs mb-6">
              AI-powered web builder. Describe what you want,
              get production-ready code in seconds.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/buzkaan"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-accent transition-colors duration-200"
              >
                GitHub
              </a>
              <div className="w-px h-3 bg-border/40" />
              <a
                href="https://x.com/buzkaan"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-accent transition-colors duration-200"
              >
                X / Twitter
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono text-[8px] uppercase tracking-[0.35em] text-muted-foreground/40 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] text-foreground/60 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-mono text-[8px] uppercase tracking-[0.35em] text-muted-foreground/40 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] text-foreground/60 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[8px] uppercase tracking-[0.35em] text-muted-foreground/40 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] text-foreground/60 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accent divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border/30" />
          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/25">
            {new Date().getFullYear()}
          </span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Buildfy. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center gap-5">
                <Link
                  href={link.href}
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40 hover:text-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <div className="w-px h-3 bg-border/30" />
                )}
              </span>
            ))}
          </div>

          <p className="font-mono text-[9px] text-muted-foreground/40 tracking-wider">
            Built by{" "}
            <a
              href="https://github.com/buzkaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-foreground transition-colors duration-200"
            >
              buzkaan
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

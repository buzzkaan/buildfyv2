"use client"

import { motion } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import Link from "next/link"

const templates = [
  {
    id: "saas-landing",
    name: "SaaS Landing",
    description: "Modern SaaS landing page with hero, features, pricing, and testimonials.",
    tags: ["Next.js", "Tailwind", "Responsive"],
    category: "LANDING",
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    description: "Full admin panel with sidebar navigation, charts, tables, and analytics.",
    tags: ["React", "Charts", "Auth"],
    category: "APP",
  },
  {
    id: "ecommerce-store",
    name: "E-Commerce Store",
    description: "Complete storefront with product catalog, cart, checkout, and filters.",
    tags: ["Next.js", "Stripe", "API"],
    category: "APP",
  },
  {
    id: "portfolio",
    name: "Portfolio Minimal",
    description: "Clean portfolio with project showcase, about section, and contact form.",
    tags: ["Animation", "Responsive", "Dark"],
    category: "LANDING",
  },
  {
    id: "blog-platform",
    name: "Blog Platform",
    description: "Blog with Markdown rendering, categories, search, and responsive layout.",
    tags: ["MDX", "CMS", "SEO"],
    category: "APP",
  },
  {
    id: "ai-chat",
    name: "AI Chat Interface",
    description: "Chat UI with streaming responses, code blocks, and conversation history.",
    tags: ["AI SDK", "Streaming", "UI"],
    category: "APP",
  },
  {
    id: "docs-site",
    name: "Documentation Site",
    description: "Documentation site with sidebar, search, code examples, and dark mode.",
    tags: ["MDX", "Search", "Nav"],
    category: "LANDING",
  },
  {
    id: "social-feed",
    name: "Social Feed",
    description: "Social media feed with posts, likes, comments, and infinite scroll.",
    tags: ["Real-time", "Auth", "API"],
    category: "APP",
  },
]

export function TemplatesSection() {
  return (
    <section className="px-6 md:px-10 py-20 border-t border-border/40">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                Templates
              </span>
              <div className="h-px w-12 bg-border" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
                {templates.length} ready
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.9] tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
            >
              Start from a{" "}
              <span className="text-accent italic">template</span>
            </h2>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground/60 max-w-xs leading-relaxed md:text-right">
            Browse example sites and use them as a starting point.
            <br />Each template is production-ready.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Link
                href={`/templates/${template.id}`}
                className="group flex flex-col bg-background p-5 h-full hover:bg-card/50 transition-colors duration-300 cursor-pointer"
              >
                {/* Index + category row */}
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="font-display text-foreground/10 group-hover:text-accent/20 transition-colors duration-300 leading-none"
                    style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col items-end gap-2 mt-1">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/50 border border-border/40 px-1.5 py-0.5">
                      {template.category}
                    </span>
                    <BitmapChevron className="h-3 w-3 text-accent/0 group-hover:text-accent transition-colors duration-200" />
                  </div>
                </div>

                <h3 className="font-sans text-sm font-medium text-foreground tracking-tight mb-2">
                  <ScrambleTextOnHover text={template.name} duration={0.3} />
                </h3>

                <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed mb-4 flex-1">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/30">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50 border border-border/30 px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

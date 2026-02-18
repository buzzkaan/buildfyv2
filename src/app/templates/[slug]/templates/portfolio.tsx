"use client"

import { useState } from "react"
import { GithubIcon, TwitterIcon, ExternalLinkIcon, MailIcon, ArrowRightIcon } from "lucide-react"

const projects = [
  { title: "Horizon OS", desc: "Next-gen operating system interface built with React and WebGL.", tags: ["React", "WebGL", "Design"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", year: "2024" },
  { title: "Pulse Analytics", desc: "Real-time data visualization platform processing 1M+ events/sec.", tags: ["TypeScript", "D3", "Node"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", year: "2024" },
  { title: "Forma 3D", desc: "Browser-based 3D modeling tool with collaborative editing.", tags: ["Three.js", "WASM", "WebRTC"], image: "https://images.unsplash.com/photo-1633355444132-695d5876a4f4?w=600&q=80", year: "2023" },
  { title: "Void CMS", desc: "Headless CMS with AI-powered content suggestions.", tags: ["Next.js", "OpenAI", "Prisma"], image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80", year: "2023" },
]

const skills = ["TypeScript", "React", "Next.js", "Node.js", "Three.js", "Figma", "PostgreSQL", "Rust", "WebGL", "AWS"]

export function Portfolio() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5">
        <span className="font-mono text-sm text-zinc-500">AD</span>
        <div className="flex items-center gap-6">
          {["Work", "About", "Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white transition-colors font-mono">{n}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 pt-20">
        <div className="max-w-4xl">
          <p className="font-mono text-zinc-500 text-sm mb-6 tracking-wider uppercase">Available for work</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Alex<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Durant</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            Creative engineer crafting immersive digital experiences. Specializing in interactive interfaces, 3D, and high-performance web applications.
          </p>
          <div className="flex items-center gap-4">
            <a href="#work" className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 font-semibold text-sm hover:bg-zinc-100 transition-colors">
              View work <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#contact" className="flex items-center gap-2 border border-zinc-700 px-6 py-3 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
              Get in touch
            </a>
          </div>
          <div className="flex items-center gap-4 mt-10">
            {[GithubIcon, TwitterIcon].map((Icon, i) => (
              <a key={i} href="#" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* Work */}
      <section id="work" className="px-8 md:px-16 py-24">
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-zinc-600 text-sm">01</span>
          <h2 className="text-3xl font-bold">Selected Work</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="group relative overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProject(i)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-zinc-950/70 flex items-end p-6 transition-opacity duration-300 ${hoveredProject === i ? "opacity-100" : "opacity-0"}`}>
                  <ExternalLinkIcon className="h-5 w-5 text-white absolute top-5 right-5" />
                </div>
              </div>
              <div className="pt-4 pb-2">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-base">{p.title}</h3>
                  <span className="font-mono text-xs text-zinc-600">{p.year}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-3 leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 md:px-16 py-24 border-t border-zinc-900">
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-zinc-600 text-sm">02</span>
          <h2 className="text-3xl font-bold">About</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-zinc-300 text-base leading-relaxed mb-5">
              I'm a full-stack engineer and designer with 8 years of experience building products that live at the intersection of technology and art.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Previously at Stripe, Vercel, and Linear. Now building my own things and taking on select freelance projects.
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1">{s}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="Alex Durant" className="w-full aspect-[3/4] object-cover grayscale" />
            <div className="absolute inset-0 ring-1 ring-zinc-700 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 md:px-16 py-24 border-t border-zinc-900">
        <div className="flex items-center gap-4 mb-12">
          <span className="font-mono text-zinc-600 text-sm">03</span>
          <h2 className="text-3xl font-bold">Contact</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="max-w-xl">
          <p className="text-zinc-400 text-base leading-relaxed mb-8">
            I'm currently open to new opportunities. Whether it's a project, a job, or just a conversation — let's talk.
          </p>
          <a href="mailto:alex@durant.io" className="flex items-center gap-3 text-xl font-bold hover:text-emerald-400 transition-colors group">
            <MailIcon className="h-6 w-6 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            alex@durant.io
          </a>
        </div>
      </section>

      <footer className="px-8 md:px-16 py-8 border-t border-zinc-900 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-700">© 2024 Alex Durant</span>
        <span className="font-mono text-xs text-zinc-700">Made with precision</span>
      </footer>
    </div>
  )
}

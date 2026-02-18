"use client"

import { SearchIcon, ClockIcon, ArrowRightIcon, TagIcon, RssIcon } from "lucide-react"

const featured = {
  title: "The Future of AI-Assisted Development",
  excerpt: "How large language models are transforming the way we write, review, and ship code — and what it means for the next generation of engineers.",
  author: { name: "Sarah Kim", avatar: "https://i.pravatar.cc/40?img=5" },
  category: "AI & Tech",
  readTime: "8 min read",
  date: "Jan 24, 2025",
  image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
}

const articles = [
  { title: "Building Type-Safe APIs with tRPC and Zod", excerpt: "A practical guide to end-to-end type safety in full-stack TypeScript applications.", category: "Engineering", readTime: "6 min", date: "Jan 20", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80", author: { name: "Marcus T.", avatar: "https://i.pravatar.cc/32?img=11" } },
  { title: "Design Systems at Scale: Lessons from Linear", excerpt: "What we learned building a component library used by thousands of engineers.", category: "Design", readTime: "10 min", date: "Jan 18", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", author: { name: "Priya N.", avatar: "https://i.pravatar.cc/32?img=23" } },
  { title: "The Art of Readable Code", excerpt: "Naming conventions, structure, and the philosophy behind code that explains itself.", category: "Best Practices", readTime: "5 min", date: "Jan 15", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80", author: { name: "Tom Blake", avatar: "https://i.pravatar.cc/32?img=3" } },
  { title: "PostgreSQL Performance Tuning for 10M+ Rows", excerpt: "Indexing strategies, query optimization, and partitioning that actually matter.", category: "Database", readTime: "12 min", date: "Jan 12", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80", author: { name: "Ana Lopez", avatar: "https://i.pravatar.cc/32?img=47" } },
]

const categories = ["All", "AI & Tech", "Engineering", "Design", "Best Practices", "Database"]
const popular = ["Building for Scale", "React Server Components", "Rust for Web Developers", "The Perfect PR", "Zero-Downtime Deploys"]

export function BlogPlatform() {
  return (
    <div className="min-h-screen bg-white font-serif antialiased">
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-black text-2xl tracking-tighter text-gray-900">BYTE</span>
            <span className="font-black text-2xl tracking-tighter text-indigo-600">PULSE</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Latest", "Topics", "Newsletter", "About"].map(n => (
              <a key={n} href="#" className="text-sm text-gray-500 hover:text-gray-900 font-sans transition-colors">{n}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SearchIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 font-sans transition-colors">Subscribe</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <article className="grid md:grid-cols-2 gap-8 mb-14 pb-14 border-b border-gray-100">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] uppercase tracking-wider px-2 py-1 font-sans">{featured.category}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans mb-4">Featured Story</span>
            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4">{featured.title}</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6 font-sans">{featured.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={featured.author.avatar} alt={featured.author.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-semibold text-gray-800 font-sans">{featured.author.name}</div>
                  <div className="text-xs text-gray-400 font-sans">{featured.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-sans">
                <ClockIcon className="h-3 w-3" />{featured.readTime}
              </div>
            </div>
          </div>
        </article>

        <div className="flex gap-10">
          <div className="flex-1">
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map(c => (
                <button key={c} className={`text-xs font-sans px-3 py-1.5 border transition-colors ${c === "All" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>{c}</button>
              ))}
            </div>
            <div className="flex flex-col gap-8">
              {articles.map((a) => (
                <article key={a.title} className="flex gap-5 group cursor-pointer">
                  <div className="w-28 h-20 shrink-0 overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-indigo-600 font-sans font-semibold">{a.category}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400 font-sans">{a.readTime}</span>
                    </div>
                    <h3 className="font-bold text-base text-gray-900 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors">{a.title}</h3>
                    <p className="text-sm text-gray-400 font-sans leading-relaxed line-clamp-2">{a.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={a.author.avatar} alt={a.author.name} className="w-5 h-5 rounded-full" />
                      <span className="text-xs text-gray-400 font-sans">{a.author.name} · {a.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-indigo-50 p-4 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <RssIcon className="h-4 w-4 text-indigo-600" />
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 font-sans">Newsletter</span>
              </div>
              <p className="text-xs text-gray-600 font-sans leading-relaxed mb-3">Weekly deep dives into engineering and technology.</p>
              <input className="w-full border border-gray-200 text-xs px-3 py-2 mb-2 outline-none font-sans" placeholder="you@email.com" />
              <button className="w-full bg-indigo-600 text-white text-xs py-2 font-sans font-medium hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1">
                Subscribe <ArrowRightIcon className="h-3 w-3" />
              </button>
            </div>
            <div className="mb-8">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans mb-3">Most Read</h4>
              <ul className="flex flex-col gap-3">
                {popular.map((p, i) => (
                  <li key={p} className="flex items-start gap-2 cursor-pointer group">
                    <span className="font-black text-xl text-gray-100 leading-none">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-gray-600 group-hover:text-indigo-600 font-sans leading-snug transition-colors">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans mb-3 flex items-center gap-1.5"><TagIcon className="h-3 w-3" /> Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {["TypeScript", "React", "AI", "Design", "SQL", "Node", "CSS", "Testing"].map(t => (
                  <span key={t} className="text-[9px] border border-gray-200 px-1.5 py-0.5 text-gray-500 font-sans cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-colors">{t}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-black text-sm"><span className="text-gray-900">BYTE</span><span className="text-indigo-600">PULSE</span></span>
          <p className="text-xs text-gray-400 font-sans">© 2025 BytePulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

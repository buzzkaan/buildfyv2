"use client"

import { useState } from "react"
import { HeartIcon, MessageCircleIcon, RepeatIcon, ShareIcon, MoreHorizontalIcon, HomeIcon, SearchIcon, BellIcon, MailIcon, UserIcon, FeatherIcon, TrendingUpIcon } from "lucide-react"

const tweets = [
  { id: 1, name: "Sarah Chen", handle: "@sarahchen", avatar: "https://i.pravatar.cc/40?img=5", time: "2m", content: "Just shipped a new feature using AI-assisted development — cut the usual 3-day sprint down to 4 hours. The future of engineering is wild. 🚀", likes: 847, comments: 63, reposts: 124, liked: false },
  { id: 2, name: "Marcus Webb", handle: "@marcuswebb", avatar: "https://i.pravatar.cc/40?img=11", time: "15m", content: "Hot take: the best code review is no code review. Build systems that make bugs impossible, not processes that try to catch them.\n\nContradict me.", likes: 2341, comments: 412, reposts: 589, liked: true },
  { id: 3, name: "Priya Nair", handle: "@priya_builds", avatar: "https://i.pravatar.cc/40?img=23", time: "1h", content: "PSA: You don't need to rewrite your codebase in Rust. Your users don't care about the language. They care about the product.\n\nFocus on what matters.", likes: 4120, comments: 287, reposts: 1032, liked: false },
  { id: 4, name: "Tom Blake", handle: "@tomblake_dev", avatar: "https://i.pravatar.cc/40?img=3", time: "3h", content: "Spent 2 hours debugging only to realize I forgot to save the file.\n\nI've been doing this for 10 years.", likes: 18200, comments: 1204, reposts: 4521, liked: false },
]

const trending = [
  { tag: "#TypeScript", posts: "42.1K posts" },
  { tag: "Open Source AI", posts: "18.4K posts" },
  { tag: "#WebDev", posts: "12.8K posts" },
  { tag: "React Server Components", posts: "8.2K posts" },
  { tag: "#BuildInPublic", posts: "5.6K posts" },
]

const suggestions = [
  { name: "Next.js", handle: "@nextjs", avatar: "https://i.pravatar.cc/32?img=32" },
  { name: "Vercel", handle: "@vercel", avatar: "https://i.pravatar.cc/32?img=33" },
  { name: "Linear", handle: "@linear", avatar: "https://i.pravatar.cc/32?img=34" },
]

export function SocialFeed() {
  const [tweetData, setTweetData] = useState(tweets)
  const [composerText, setComposerText] = useState("")
  const charLimit = 280

  const toggleLike = (id: number) => {
    setTweetData(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 } : t))
  }

  const navItems = [
    { icon: HomeIcon, label: "Home", active: true },
    { icon: SearchIcon, label: "Explore" },
    { icon: BellIcon, label: "Notifications" },
    { icon: MailIcon, label: "Messages" },
    { icon: UserIcon, label: "Profile" },
  ]

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

  return (
    <div className="flex min-h-screen bg-black text-white font-sans antialiased">
      {/* Left sidebar */}
      <aside className="hidden lg:flex flex-col items-end w-64 px-6 py-4 border-r border-gray-800 sticky top-0 h-screen">
        <div className="flex flex-col gap-1 w-full max-w-[200px]">
          <div className="mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
          </div>
          {navItems.map(({ icon: Icon, label, active }) => (
            <button key={label} className={`flex items-center gap-4 px-4 py-3 rounded-full text-base font-medium transition-colors text-left w-full ${active ? "text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"}`}>
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
          <button className="flex items-center gap-4 px-4 py-3 rounded-full text-gray-400 hover:bg-gray-900 hover:text-white transition-colors text-left w-full text-base font-medium">
            <MoreHorizontalIcon className="h-5 w-5" /> More
          </button>
          <button className="mt-4 bg-sky-500 hover:bg-sky-400 text-white py-3 px-4 rounded-full font-bold text-base transition-colors flex items-center gap-2 w-full justify-center">
            <FeatherIcon className="h-5 w-5" /> Post
          </button>
          <div className="mt-auto pt-4 flex items-center gap-3 p-3 hover:bg-gray-900 rounded-full cursor-pointer transition-colors">
            <img src="https://i.pravatar.cc/36?img=8" className="w-9 h-9 rounded-full" alt="You" />
            <div>
              <div className="text-sm font-bold">Alex Johnson</div>
              <div className="text-xs text-gray-500">@alexj</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Feed */}
      <main className="flex-1 max-w-xl border-r border-gray-800">
        <div className="sticky top-0 bg-black/80 backdrop-blur border-b border-gray-800 px-5 py-3">
          <div className="flex gap-6">
            <button className="text-sm font-bold text-white border-b-2 border-sky-400 pb-3">For you</button>
            <button className="text-sm font-medium text-gray-500 hover:text-white transition-colors pb-3">Following</button>
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-3">
            <img src="https://i.pravatar.cc/40?img=8" className="w-10 h-10 rounded-full shrink-0" alt="You" />
            <div className="flex-1">
              <textarea
                value={composerText}
                onChange={e => setComposerText(e.target.value)}
                maxLength={charLimit}
                placeholder="What is happening?!"
                className="w-full bg-transparent text-lg text-gray-100 placeholder:text-gray-600 outline-none resize-none leading-normal min-h-[80px]"
              />
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex gap-3 text-sky-400">
                  {/* dummy icons */}
                </div>
                <div className="flex items-center gap-3">
                  {composerText.length > 0 && (
                    <div className="relative w-7 h-7">
                      <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                        <circle cx="16" cy="16" r="14" fill="none" stroke="#2f3336" strokeWidth="3" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke={composerText.length > charLimit * 0.8 ? "#f4212e" : "#1d9bf0"} strokeWidth="3" strokeDasharray={`${(composerText.length / charLimit) * 88} 88`} />
                      </svg>
                    </div>
                  )}
                  <button disabled={!composerText.trim()} className="bg-sky-500 hover:bg-sky-400 text-white px-5 py-2 rounded-full font-bold text-sm disabled:opacity-50 transition-colors">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tweets */}
        {tweetData.map(t => (
          <div key={t.id} className="px-4 py-4 border-b border-gray-800 hover:bg-gray-950/50 transition-colors cursor-pointer">
            <div className="flex gap-3">
              <img src={t.avatar} className="w-10 h-10 rounded-full shrink-0" alt={t.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{t.name}</span>
                  <span className="text-gray-500 text-sm">{t.handle}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-gray-500 text-sm">{t.time}</span>
                  <button className="ml-auto text-gray-600 hover:text-white transition-colors"><MoreHorizontalIcon className="h-4 w-4" /></button>
                </div>
                <p className="text-sm leading-relaxed text-gray-100 whitespace-pre-line mb-3">{t.content}</p>
                <div className="flex justify-between max-w-xs text-gray-500">
                  <button className="flex items-center gap-2 text-xs hover:text-sky-400 transition-colors group">
                    <MessageCircleIcon className="h-4 w-4 group-hover:text-sky-400" />
                    {fmt(t.comments)}
                  </button>
                  <button className="flex items-center gap-2 text-xs hover:text-emerald-400 transition-colors group">
                    <RepeatIcon className="h-4 w-4 group-hover:text-emerald-400" />
                    {fmt(t.reposts)}
                  </button>
                  <button onClick={() => toggleLike(t.id)} className={`flex items-center gap-2 text-xs transition-colors group ${t.liked ? "text-pink-500" : "hover:text-pink-500"}`}>
                    <HeartIcon className={`h-4 w-4 ${t.liked ? "fill-pink-500" : ""}`} />
                    {fmt(t.likes)}
                  </button>
                  <button className="flex items-center gap-2 text-xs hover:text-sky-400 transition-colors group">
                    <ShareIcon className="h-4 w-4 group-hover:text-sky-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Right sidebar */}
      <aside className="hidden xl:block w-72 px-4 py-4 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 bg-gray-900 rounded-full px-4 py-2 mb-4">
          <SearchIcon className="h-4 w-4 text-gray-400" />
          <input className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full" placeholder="Search" />
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2"><TrendingUpIcon className="h-4 w-4 text-sky-400" /> Trending</h3>
          {trending.map(t => (
            <div key={t.tag} className="py-2.5 hover:bg-gray-800 -mx-2 px-2 rounded-lg cursor-pointer transition-colors">
              <div className="font-semibold text-sm">{t.tag}</div>
              <div className="text-xs text-gray-500">{t.posts}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-4">
          <h3 className="font-bold text-base mb-3">Who to follow</h3>
          {suggestions.map(s => (
            <div key={s.handle} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <img src={s.avatar} className="w-8 h-8 rounded-full" alt={s.name} />
                <div>
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.handle}</div>
                </div>
              </div>
              <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">Follow</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

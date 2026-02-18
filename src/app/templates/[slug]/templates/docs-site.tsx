"use client"

import { useState } from "react"
import { SearchIcon, ChevronRightIcon, ChevronDownIcon, SunIcon, MoonIcon, BookOpenIcon, AlertCircleIcon, InfoIcon, CheckCircle2Icon } from "lucide-react"

const sidebarItems = [
  { label: "Getting Started", open: true, children: ["Introduction", "Installation", "Quick Start", "Configuration"] },
  { label: "Core Concepts", open: false, children: ["Architecture", "Data Flow", "State Management", "Routing"] },
  { label: "API Reference", open: false, children: ["Components", "Hooks", "Utilities", "Types"] },
  { label: "Guides", open: false, children: ["Authentication", "Deployment", "Testing", "Performance"] },
]

const toc = ["Overview", "Prerequisites", "Installation", "Basic Setup", "Configuration", "Next Steps"]

export function DocsSite() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "Getting Started": true })
  const [activeItem, setActiveItem] = useState("Quick Start")
  const [dark, setDark] = useState(true)

  const bg = dark ? "bg-gray-950" : "bg-white"
  const text = dark ? "text-gray-100" : "text-gray-900"
  const border = dark ? "border-gray-800" : "border-gray-200"
  const sidebar = dark ? "bg-gray-900" : "bg-gray-50"
  const muted = dark ? "text-gray-400" : "text-gray-500"
  const card = dark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"

  return (
    <div className={`flex h-screen ${bg} ${text} font-sans antialiased`}>
      {/* Sidebar */}
      <aside className={`w-56 shrink-0 flex flex-col ${sidebar} border-r ${border}`}>
        <div className={`flex items-center gap-2 px-4 py-4 border-b ${border}`}>
          <BookOpenIcon className="h-4 w-4 text-blue-500" />
          <span className="font-bold text-sm">Docs</span>
          <span className={`ml-auto text-[10px] ${muted} border ${border} px-1.5 py-0.5`}>v2.4</span>
        </div>

        <div className={`flex items-center gap-2 mx-3 my-3 px-3 py-2 border ${border} rounded-lg`}>
          <SearchIcon className="h-3.5 w-3.5 text-gray-500" />
          <input className={`bg-transparent text-xs ${muted} outline-none w-full`} placeholder="Search docs..." />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {sidebarItems.map((section) => (
            <div key={section.label} className="mb-1">
              <button
                onClick={() => setOpenSections(prev => ({ ...prev, [section.label]: !prev[section.label] }))}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider ${muted} hover:text-blue-400 transition-colors`}
              >
                {section.label}
                {openSections[section.label] ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronRightIcon className="h-3 w-3" />}
              </button>
              {openSections[section.label] && (
                <div className="ml-3 flex flex-col gap-0.5">
                  {section.children.map(child => (
                    <button
                      key={child}
                      onClick={() => setActiveItem(child)}
                      className={`text-left px-3 py-1.5 text-sm rounded transition-colors ${activeItem === child ? "bg-blue-500/10 text-blue-400" : `${muted} hover:text-blue-400`}`}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className={`flex items-center justify-between px-6 py-3 border-b ${border}`}>
          <div className={`flex items-center gap-1 text-xs ${muted}`}>
            <span>Docs</span><ChevronRightIcon className="h-3 w-3" /><span>Getting Started</span><ChevronRightIcon className="h-3 w-3" /><span className="text-blue-400">{activeItem}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className={`p-1.5 rounded-lg ${muted} hover:text-blue-400 transition-colors border ${border}`}>
              {dark ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-10">
            {/* Breadcrumb */}
            <p className={`text-xs ${muted} mb-4`}>Getting Started → {activeItem}</p>

            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Quick Start</h1>
            <p className={`${muted} text-sm mb-8 leading-relaxed`}>Get up and running in less than 5 minutes. This guide covers installation, basic configuration, and your first API call.</p>

            {/* Info callout */}
            <div className={`flex gap-3 p-4 rounded-xl border ${card} mb-8`}>
              <InfoIcon className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-1">Prerequisites</p>
                <p className={`text-sm ${muted} leading-relaxed`}>Node.js 18+ and npm/yarn/pnpm. Basic knowledge of TypeScript recommended.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Installation</h2>
            <div className={`rounded-xl overflow-hidden border ${border} mb-6`}>
              <div className={`flex items-center justify-between px-4 py-2 ${dark ? "bg-gray-800" : "bg-gray-100"} border-b ${border}`}>
                <span className={`text-[10px] ${muted} font-mono uppercase tracking-wider`}>terminal</span>
              </div>
              <pre className={`p-4 text-sm font-mono ${dark ? "bg-gray-900 text-emerald-400" : "bg-gray-50 text-green-700"} overflow-x-auto`}><code>{`npm install @mylib/core @mylib/react
# or
pnpm add @mylib/core @mylib/react`}</code></pre>
            </div>

            <h2 className="text-xl font-bold mb-4">Basic Setup</h2>
            <p className={`${muted} text-sm mb-4 leading-relaxed`}>Import and initialize the client in your application entry point. The configuration object accepts the following options:</p>

            <div className={`rounded-xl overflow-hidden border ${border} mb-6`}>
              <div className={`flex items-center justify-between px-4 py-2 ${dark ? "bg-gray-800" : "bg-gray-100"} border-b ${border}`}>
                <span className={`text-[10px] ${muted} font-mono uppercase tracking-wider`}>typescript</span>
              </div>
              <pre className={`p-4 text-sm font-mono ${dark ? "bg-gray-900 text-blue-300" : "bg-gray-50 text-blue-800"} overflow-x-auto`}><code>{`import { createClient } from '@mylib/core'

const client = createClient({
  apiKey: process.env.API_KEY,
  region: 'us-east-1',
  timeout: 5000,
})`}</code></pre>
            </div>

            {/* Warning */}
            <div className={`flex gap-3 p-4 rounded-xl border ${dark ? "bg-yellow-500/5 border-yellow-500/20" : "bg-yellow-50 border-yellow-200"} mb-8`}>
              <AlertCircleIcon className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-400">Never expose your API key in client-side code. Use environment variables.</p>
            </div>

            <h2 className="text-xl font-bold mb-4">Your First API Call</h2>
            <div className={`rounded-xl overflow-hidden border ${border} mb-6`}>
              <div className={`flex items-center justify-between px-4 py-2 ${dark ? "bg-gray-800" : "bg-gray-100"} border-b ${border}`}>
                <span className={`text-[10px] ${muted} font-mono uppercase tracking-wider`}>typescript</span>
              </div>
              <pre className={`p-4 text-sm font-mono ${dark ? "bg-gray-900 text-purple-300" : "bg-gray-50 text-purple-700"} overflow-x-auto`}><code>{`const result = await client.query({
  resource: 'users',
  filter: { active: true },
  limit: 10,
})

console.log(result.data) // User[]`}</code></pre>
            </div>

            {/* Success */}
            <div className={`flex gap-3 p-4 rounded-xl border ${dark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"} mb-10`}>
              <CheckCircle2Icon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400">You're all set! Explore the API Reference for the full list of available methods.</p>
            </div>

            {/* Pagination */}
            <div className={`flex items-center justify-between pt-6 border-t ${border}`}>
              <button className={`flex items-center gap-2 text-sm ${muted} hover:text-blue-400 transition-colors`}>
                ← Installation
              </button>
              <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Configuration →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ToC */}
      <aside className={`hidden xl:block w-44 shrink-0 border-l ${border} px-4 py-10`}>
        <p className={`text-[10px] uppercase tracking-wider font-semibold ${muted} mb-3`}>On this page</p>
        <ul className="flex flex-col gap-2">
          {toc.map((item, i) => (
            <li key={item}>
              <a href="#" className={`text-xs transition-colors ${i === 2 ? "text-blue-400" : `${muted} hover:text-blue-400`}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

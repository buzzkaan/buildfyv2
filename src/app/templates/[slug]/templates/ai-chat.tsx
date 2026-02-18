"use client"

import { useState, useRef, useEffect } from "react"
import { SendIcon, PlusIcon, BotIcon, UserIcon, CopyIcon, ThumbsUpIcon, ThumbsDownIcon, ChevronDownIcon } from "lucide-react"

const conversations = [
  { id: 1, title: "Build a REST API with auth", time: "2h ago" },
  { id: 2, title: "React performance tips", time: "Yesterday" },
  { id: 3, title: "PostgreSQL query optimization", time: "Jan 20" },
  { id: 4, title: "Explain monads in simple terms", time: "Jan 19" },
]

const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI coding assistant. I can help you write code, debug issues, explain concepts, and more. What would you like to build today?",
    timestamp: "10:24 AM",
  },
  {
    role: "user",
    content: "Can you show me how to create a debounce function in TypeScript?",
    timestamp: "10:25 AM",
  },
  {
    role: "assistant",
    content: `Sure! Here's a type-safe debounce implementation:\n\`\`\`typescript\nfunction debounce<T extends (...args: unknown[]) => void>(\n  fn: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout>\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), delay)\n  }\n}\n\n// Usage:\nconst handleSearch = debounce((query: string) => {\n  console.log('Searching for:', query)\n}, 300)\n\`\`\`\nThis generic version preserves the parameter types of the original function, giving you full type safety.`,
    timestamp: "10:25 AM",
  },
]

export function AiChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [model, setModel] = useState("Claude 3.5 Sonnet")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "That's a great question! I'd be happy to help. Here's what I can tell you based on your request. Let me break this down step by step for you.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }])
    }, 1500)
  }

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```[\w]*\n?/, "").replace(/```$/, "")
        const lang = part.match(/```(\w+)/)?.[1] ?? ""
        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{lang || "code"}</span>
              <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors">
                <CopyIcon className="h-3 w-3" /> Copy
              </button>
            </div>
            <pre className="p-4 text-xs text-emerald-300 font-mono leading-relaxed overflow-x-auto"><code>{code}</code></pre>
          </div>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        <div className="p-3 border-b border-gray-800">
          <button className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm py-2 rounded-lg transition-colors">
            <PlusIcon className="h-4 w-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 px-2 py-2">Recent</p>
          {conversations.map(c => (
            <button key={c.id} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${c.id === 1 ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <div className="truncate font-medium text-[13px]">{c.title}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{c.time}</div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/32?img=8" className="w-7 h-7 rounded-full" alt="User" />
            <span className="text-xs text-gray-400">alex@example.com</span>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <BotIcon className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Build a REST API with auth</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
            {model} <ChevronDownIcon className="h-3 w-3" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="max-w-3xl mx-auto px-5 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? "bg-emerald-500/20" : "bg-indigo-500/20"}`}>
                  {msg.role === "assistant" ? <BotIcon className="h-4 w-4 text-emerald-400" /> : <UserIcon className="h-4 w-4 text-indigo-400" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-100 rounded-tl-sm"}`}>
                    {renderContent(msg.content)}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:text-gray-300 text-gray-600 transition-colors"><ThumbsUpIcon className="h-3 w-3" /></button>
                        <button className="p-1 hover:text-gray-300 text-gray-600 transition-colors"><ThumbsDownIcon className="h-3 w-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <BotIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 focus-within:border-gray-500 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Message Claude..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none resize-none max-h-32 leading-relaxed"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="flex items-center justify-center w-8 h-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <SendIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  )
}

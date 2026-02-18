"use client"

import { useState } from "react"
import { LayoutDashboardIcon, UsersIcon, BarChart2Icon, SettingsIcon, BellIcon, SearchIcon, TrendingUpIcon, TrendingDownIcon, ShoppingCartIcon, DollarSignIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const stats = [
  { label: "Total Revenue", value: "$84,325", change: "+12.5%", up: true, icon: DollarSignIcon },
  { label: "Active Users", value: "12,847", change: "+8.2%", up: true, icon: UsersIcon },
  { label: "Orders", value: "3,412", change: "-2.1%", up: false, icon: ShoppingCartIcon },
  { label: "Conversion", value: "4.28%", change: "+0.4%", up: true, icon: TrendingUpIcon },
]

const rows = [
  { name: "Aurora Pro Plan", user: "Sarah Chen", amount: "$299", status: "Completed", date: "Jan 24" },
  { name: "Luminate Basic", user: "Marcus Webb", amount: "$49", status: "Pending", date: "Jan 24" },
  { name: "Enterprise Suite", user: "Priya Nair", amount: "$999", status: "Completed", date: "Jan 23" },
  { name: "Starter Pack", user: "Tom Blake", amount: "$19", status: "Failed", date: "Jan 23" },
  { name: "Aurora Pro Plan", user: "Lisa Park", amount: "$299", status: "Completed", date: "Jan 22" },
]

const statusColors: Record<string, string> = {
  Completed: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
  Failed: "bg-red-500/10 text-red-400",
}

const barHeights = [40, 65, 55, 80, 70, 90, 60, 75, 85, 50, 95, 70]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboardIcon },
    { label: "Users", icon: UsersIcon },
    { label: "Analytics", icon: BarChart2Icon },
    { label: "Settings", icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-white/5">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <BarChart2Icon className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm">Axiom</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                activeNav === label ? "bg-indigo-500/20 text-indigo-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/32?img=7" className="w-8 h-8 rounded-full" alt="Avatar" />
            <div>
              <div className="text-xs font-medium">Alex Johnson</div>
              <div className="text-[10px] text-gray-500">admin@axiom.io</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-gray-900/50">
          <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2 w-64">
            <SearchIcon className="h-4 w-4 text-gray-400" />
            <input className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full" placeholder="Search..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <BellIcon className="h-4 w-4 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <img src="https://i.pravatar.cc/32?img=7" className="w-8 h-8 rounded-full cursor-pointer" alt="Avatar" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-400 text-sm mb-6">Welcome back, Alex. Here's what's happening.</p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-900 border border-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{s.value}</div>
                <div className={`flex items-center gap-1 text-xs ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                  {s.up ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                  {s.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Chart + mini stats */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-gray-900 border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Revenue Overview</h3>
                <select className="bg-white/5 text-xs text-gray-400 rounded px-2 py-1 border border-white/10 outline-none">
                  <option>2024</option>
                </select>
              </div>
              <div className="flex items-end gap-2 h-32">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-indigo-500/80 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[8px] text-gray-600">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side stats */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-900 border border-white/5 rounded-xl p-4 flex-1">
                <div className="text-xs text-gray-400 mb-2">Top Channel</div>
                <div className="text-lg font-bold mb-1">Organic Search</div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "62%" }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-gray-500">62% of traffic</span>
                  <TrendingUpIcon className="h-3 w-3 text-emerald-400" />
                </div>
              </div>
              <div className="bg-gray-900 border border-white/5 rounded-xl p-4 flex-1">
                <div className="text-xs text-gray-400 mb-2">Goal Progress</div>
                <div className="text-lg font-bold mb-1">$84K / $100K</div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "84%" }} />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">84% of monthly goal</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold">Recent Transactions</h3>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                  <th className="text-left px-5 py-3">Item</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium">{row.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{row.user}</td>
                    <td className="px-5 py-3 text-sm font-medium">{row.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

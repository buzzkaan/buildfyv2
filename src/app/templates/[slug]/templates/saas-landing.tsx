"use client"

import { useState } from "react"
import { CheckIcon, ArrowRightIcon, MenuIcon, XIcon, StarIcon, ZapIcon, ShieldIcon, BarChartIcon } from "lucide-react"

const nav = ["Features", "Pricing", "Docs", "Blog"]

const features = [
  { icon: ZapIcon, title: "Blazing Fast", desc: "Built on edge infrastructure delivering sub-50ms response times globally." },
  { icon: ShieldIcon, title: "Secure by Default", desc: "End-to-end encryption, SOC 2 Type II certified, GDPR compliant." },
  { icon: BarChartIcon, title: "Deep Analytics", desc: "Real-time dashboards with custom metrics, cohorts, and funnel analysis." },
  { icon: CheckIcon, title: "99.99% Uptime", desc: "Redundant infrastructure across 3 regions with automatic failover." },
]

const plans = [
  { name: "Starter", price: "$0", period: "/mo", desc: "Perfect for individuals and small projects.", features: ["5 projects", "10GB storage", "Community support", "Basic analytics"], cta: "Get started free", highlighted: false },
  { name: "Pro", price: "$29", period: "/mo", desc: "For growing teams that need more power.", features: ["Unlimited projects", "100GB storage", "Priority support", "Advanced analytics", "Custom domains", "Team members (5)"], cta: "Start free trial", highlighted: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "Tailored solutions for large organizations.", features: ["Everything in Pro", "Unlimited storage", "Dedicated support", "SLA guarantee", "Custom integrations", "SAML SSO"], cta: "Contact sales", highlighted: false },
]

const testimonials = [
  { name: "Sarah Chen", role: "CTO at Vercel", avatar: "https://i.pravatar.cc/48?img=5", text: "This platform cut our deployment time by 80%. The analytics alone are worth the price." },
  { name: "Marcus Webb", role: "Founder at Linear", avatar: "https://i.pravatar.cc/48?img=11", text: "Switched from three separate tools to this one. Haven't looked back since." },
  { name: "Priya Nair", role: "VP Eng at Figma", avatar: "https://i.pravatar.cc/48?img=23", text: "The uptime guarantee is real. We've had zero incidents in 18 months of use." },
]

export function SaasLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-500 rounded flex items-center justify-center">
              <ZapIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">Luminate</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {nav.map((n) => <a key={n} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{n}</a>)}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Sign in</button>
            <button className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">Get started</button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/5">
            {nav.map((n) => <a key={n} href="#" className="text-sm text-slate-400">{n}</a>)}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.25),transparent)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now in public beta — join 12,000+ teams
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Ship products<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">10× faster</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for modern teams. Collaborate, deploy, and scale with confidence — without the operational overhead.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors">
              Start for free <ArrowRightIcon className="h-4 w-4" />
            </button>
            <button className="w-full sm:w-auto text-slate-400 hover:text-white border border-white/10 px-8 py-3.5 rounded-xl text-sm font-medium transition-colors">
              View demo
            </button>
          </div>
          <p className="text-slate-500 text-xs mt-4">No credit card required · Free forever plan available</p>
        </div>

        {/* Hero image */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-10" />
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 bg-white/5 rounded h-5" />
            </div>
            <div className="grid grid-cols-5 h-64">
              <div className="col-span-1 border-r border-white/5 p-3 flex flex-col gap-2">
                {[...Array(6)].map((_, i) => <div key={i} className="h-7 bg-white/5 rounded w-full" />)}
              </div>
              <div className="col-span-4 p-4 grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/5 rounded-lg h-24" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built for modern engineering teams who care about quality, speed, and developer experience.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-900 border border-white/5 rounded-xl p-6 hover:border-violet-500/30 transition-colors group">
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <f.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 mb-6">No hidden fees. Cancel anytime.</p>
            <div className="inline-flex items-center bg-slate-800 rounded-lg p-1 gap-1">
              <button onClick={() => setBilling("monthly")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white text-slate-900" : "text-slate-400"}`}>Monthly</button>
              <button onClick={() => setBilling("yearly")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billing === "yearly" ? "bg-white text-slate-900" : "text-slate-400"}`}>
                Yearly <span className="text-violet-400 ml-1">-20%</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border flex flex-col ${plan.highlighted ? "bg-violet-600 border-violet-500" : "bg-slate-900 border-white/5"}`}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">{plan.name}</span>
                    {plan.highlighted && <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Popular</span>}
                  </div>
                  <div className="flex items-end gap-1 mb-3">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={`text-sm mb-1 ${plan.highlighted ? "text-violet-200" : "text-slate-400"}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.highlighted ? "text-violet-200" : "text-slate-400"}`}>{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckIcon className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-white" : "text-violet-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${plan.highlighted ? "bg-white text-violet-700 hover:bg-slate-100" : "border border-white/10 hover:bg-white/5"}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Loved by engineering teams</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-slate-900 border border-white/5 rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join thousands of teams already shipping faster with Luminate.</p>
          <button className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-colors">
            Start building for free <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-violet-500 rounded flex items-center justify-center">
              <ZapIcon className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-sm">Luminate</span>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Luminate Inc. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Status"].map((l) => <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}

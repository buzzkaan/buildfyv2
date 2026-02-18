import Link from "next/link"
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"

interface Props {
  children: React.ReactNode
}

export default function TemplateLayout({ children }: Props) {
  return (
    <div className="min-h-screen">
      {/* Buildfy banner */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 py-2 bg-black/90 backdrop-blur border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          Back to Buildfy
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
          Template Preview
        </span>
        <Link
          href="/"
          className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 font-mono text-[9px] uppercase tracking-wider hover:bg-orange-400 transition-colors"
        >
          Use Template
          <ExternalLinkIcon className="h-3 w-3" />
        </Link>
      </div>
      <div className="pt-9">
        {children}
      </div>
    </div>
  )
}

import { TopNav } from "@/modules/home/ui/components/top-nav"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <main className="relative min-h-screen">
      <TopNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </main>
  )
}

export default Layout

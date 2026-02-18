import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-mono text-6xl font-bold text-foreground">404</h1>
      <p className="font-mono text-sm text-muted-foreground">
        Page not found
      </p>
      <Link
        href="/"
        className="mt-4 border border-border/60 px-6 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        Go Home
      </Link>
    </div>
  )
}

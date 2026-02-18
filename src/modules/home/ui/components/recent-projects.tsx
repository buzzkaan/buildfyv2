"use client"

import { motion } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { Clock, MoreHorizontal, PowerIcon, Loader2Icon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useTRPC } from "@/trpc/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SandboxStatus = "checking" | "alive" | "dead" | "none"

const StatusDot = ({ status }: { status: SandboxStatus }) => {
  if (status === "none") return (
    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
  )
  if (status === "checking") return (
    <span className="w-1.5 h-1.5 rounded-full bg-border animate-pulse" />
  )
  if (status === "alive") return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
  )
  // dead
  return <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
}

const statusLabel: Record<SandboxStatus, string> = {
  none: "Building",
  checking: "Checking...",
  alive: "Live",
  dead: "Offline",
}

const statusColor: Record<SandboxStatus, string> = {
  none: "text-orange-400/70",
  checking: "text-muted-foreground/40",
  alive: "text-emerald-500/70",
  dead: "text-red-500/70",
}

const ProjectCardSkeleton = ({ i }: { i: number }) => (
  <div className="bg-background p-5 flex flex-col gap-4" style={{ animationDelay: `${i * 80}ms` }}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-border/40 bg-secondary/30 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-28 bg-secondary/50 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-14 bg-secondary/30 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 animate-pulse" />
            <div className="h-3 w-10 bg-secondary/20 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="w-6 h-6 bg-secondary/20 animate-pulse rounded-sm" />
    </div>
    <div className="flex items-center pt-2 border-t border-border/20">
      <div className="h-3 w-24 bg-secondary/30 animate-pulse" />
    </div>
  </div>
)

export function RecentProjects() {
  const trpc = useTRPC()
  const { user } = useUser()
  const [sandboxStatuses, setSandboxStatuses] = useState<Record<string, SandboxStatus>>({})
  const [restartingIds, setRestartingIds] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    ...trpc.projects.getMany.queryOptions(),
    staleTime: 30_000,
    enabled: !!user,
  })

  const deleteProject = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())
        toast.success("Project deleted")
      },
      onError: () => toast.error("Failed to delete project"),
    })
  )

  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    deleteProject.mutate({ id: projectId })
  }

  // Check all sandbox statuses once projects load
  useEffect(() => {
    if (!projects || projects.length === 0) return

    const toCheck = projects
      .filter((p) => p.messages[0]?.fragment?.sandboxId)
      .map((p) => ({
        fragmentId: p.messages[0].fragment!.id,
        sandboxId: p.messages[0].fragment!.sandboxId!,
      }))

    if (toCheck.length === 0) return

    // Mark all as "checking"
    const checking: Record<string, SandboxStatus> = {}
    toCheck.forEach(({ fragmentId }) => { checking[fragmentId] = "checking" })
    setSandboxStatuses(checking)

    fetch('/api/check-sandboxes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sandboxes: toCheck }),
    })
      .then((r) => r.json())
      .then(({ results }) => {
        const next: Record<string, SandboxStatus> = {}
        results.forEach(({ fragmentId, status }: { fragmentId: string; status: 'alive' | 'dead' }) => {
          next[fragmentId] = status
        })
        setSandboxStatuses(next)
      })
      .catch(() => {
        // On error, mark all as unknown (don't crash)
        const fallback: Record<string, SandboxStatus> = {}
        toCheck.forEach(({ fragmentId }) => { fallback[fragmentId] = "dead" })
        setSandboxStatuses(fallback)
      })
  }, [projects])

  const handleRestart = async (e: React.MouseEvent, fragmentId: string) => {
    e.preventDefault()
    setRestartingIds((prev) => new Set(prev).add(fragmentId))
    try {
      const res = await fetch('/api/restart-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId }),
      })
      if (!res.ok) throw new Error()
      setSandboxStatuses((prev) => ({ ...prev, [fragmentId]: 'alive' }))
      toast.success('Sandbox restarted — click the project to view it')
    } catch {
      toast.error('Could not restart sandbox')
    } finally {
      setRestartingIds((prev) => {
        const next = new Set(prev)
        next.delete(fragmentId)
        return next
      })
    }
  }

  if (!user) return null

  return (
    <section className="px-6 md:px-10 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Recent Projects
          </span>
          <div className="h-px w-16 bg-border" />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
            {[0, 1, 2].map((i) => <ProjectCardSkeleton key={i} i={i} />)}
          </div>
        )}

        {!isLoading && (!projects || projects.length === 0) && (
          <div className="border border-border/40 p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              No projects yet. Create your first one above.
            </p>
          </div>
        )}

        {!isLoading && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
            {projects.map((project, i) => {
              const fragment = project.messages[0]?.fragment
              const fragmentId = fragment?.id
              const sandboxId = fragment?.sandboxId

              // Determine status
              const status: SandboxStatus = !fragment
                ? "none"
                : sandboxId && sandboxStatuses[fragmentId!] !== undefined
                  ? sandboxStatuses[fragmentId!]
                  : fragment
                    ? "checking"
                    : "none"

              const isRestarting = fragmentId ? restartingIds.has(fragmentId) : false
              const showRestartBtn = status === "dead" && fragmentId && !isRestarting

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                  className="group bg-background p-5 flex flex-col gap-4 hover:bg-card/50 transition-colors duration-300"
                >
                  <Link href={`/projects/${project.id}`} className="flex flex-col gap-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-border bg-secondary/40 flex items-center justify-center shrink-0">
                          <span className="font-sans text-sm font-semibold text-foreground/70">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <h3 className="font-sans text-sm font-medium text-foreground tracking-tight truncate">
                            <ScrambleTextOnHover text={project.name} duration={0.3} />
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/60 px-1.5 py-0.5">
                              Project
                            </span>
                            <StatusDot status={status} />
                            <span className={`font-mono text-[9px] uppercase tracking-wider ${statusColor[status]}`}>
                              {isRestarting ? "Restarting..." : statusLabel[status]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                        {showRestartBtn && (
                          <button
                            onClick={(e) => handleRestart(e, fragmentId)}
                            title="Restart sandbox"
                            className="flex items-center gap-1 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-red-500/70 border border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <PowerIcon className="h-2.5 w-2.5" />
                            Restart
                          </button>
                        )}
                        {isRestarting && (
                          <Loader2Icon className="h-4 w-4 text-muted-foreground/50 animate-spin" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-muted-foreground/30 hover:text-muted-foreground transition-colors p-1"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[130px]">
                            <DropdownMenuItem
                              onClick={(e) => handleDelete(e, project.id)}
                              disabled={deleteProject.isPending}
                              className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                              <span className="font-mono text-xs">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono text-[10px]">
                          {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <BitmapChevron className="h-3 w-3 text-accent" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

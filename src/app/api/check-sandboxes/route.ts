import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { Sandbox } from '@e2b/code-interpreter'
import { prisma } from '@/lib/db'

export const maxDuration = 30

const MAX_SANDBOXES = 20

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sandboxes } = await req.json() as {
    sandboxes: { fragmentId: string; sandboxId: string }[]
  }

  if (!Array.isArray(sandboxes) || sandboxes.length === 0) {
    return NextResponse.json({ results: [] })
  }

  if (sandboxes.length > MAX_SANDBOXES) {
    return NextResponse.json({ error: 'Too many sandboxes' }, { status: 400 })
  }

  // Verify all fragments belong to the authenticated user
  const fragmentIds = sandboxes.map(s => s.fragmentId)
  const ownedFragments = await prisma.fragment.findMany({
    where: {
      id: { in: fragmentIds },
      message: { project: { userId } }
    },
    select: { id: true }
  })
  const ownedIds = new Set(ownedFragments.map(f => f.id))

  const results = await Promise.all(
    sandboxes
      .filter(({ fragmentId }) => ownedIds.has(fragmentId))
      .map(async ({ fragmentId, sandboxId }) => {
        try {
          await Sandbox.connect(sandboxId)
          return { fragmentId, status: 'alive' as const }
        } catch {
          return { fragmentId, status: 'dead' as const }
        }
      })
  )

  return NextResponse.json({ results })
}

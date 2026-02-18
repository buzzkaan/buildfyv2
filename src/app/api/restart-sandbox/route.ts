import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { Sandbox } from '@e2b/code-interpreter'
import { setupEditModeInSandbox } from '@/lib/edit-mode-setup'
import { E2B_TEMPLATE } from '@/lib/constants'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fragmentId } = await req.json()
    if (!fragmentId) {
      return NextResponse.json({ error: 'Missing fragmentId' }, { status: 400 })
    }

    // Verify ownership
    const fragment = await prisma.fragment.findUnique({
      where: { id: fragmentId },
      include: { message: { include: { project: true } } },
    })

    if (!fragment || fragment.message.project.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create a fresh sandbox from the same template
    const sandbox = await Sandbox.create(E2B_TEMPLATE, {
      timeoutMs: 300_000, // 5 min keep-alive
    })

    // Setup edit mode
    await setupEditModeInSandbox(sandbox)

    // Write all project files in parallel
    const files = fragment.files as { [path: string]: string }
    await Promise.all(
      Object.entries(files).map(([path, content]) =>
        sandbox.files.write(path, content)
      )
    )

    // Get the new tunnel URL
    const host = sandbox.getHost(3000)
    const newSandboxUrl = `https://${host}`

    // Persist new sandbox info
    await prisma.fragment.update({
      where: { id: fragmentId },
      data: {
        sandboxId: sandbox.sandboxId,
        sandboxUrl: newSandboxUrl,
      },
    })

    return NextResponse.json({ sandboxUrl: newSandboxUrl, sandboxId: sandbox.sandboxId })
  } catch (error) {
    console.error('Restart sandbox error:', error)
    return NextResponse.json({ error: 'Failed to restart sandbox' }, { status: 500 })
  }
}

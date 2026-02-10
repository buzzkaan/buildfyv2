import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import Sandbox from '@e2b/code-interpreter'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { fragmentId, files, sandboxId } = body

    if (!fragmentId || !files || !sandboxId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify fragment ownership
    const fragment = await prisma.fragment.findUnique({
      where: { id: fragmentId },
      include: {
        message: {
          include: {
            project: true
          }
        }
      }
    })

    if (!fragment || fragment.message.project.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Connect to sandbox and update files
    const sandbox = await Sandbox.connect(sandboxId)

    try {
      // Update files in sandbox
      for (const [path, content] of Object.entries(files)) {
        await sandbox.files.write(path as string, content as string)
      }

      // Update fragment in database
      await prisma.fragment.update({
        where: { id: fragmentId },
        data: {
          files: files
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Sandbox updated successfully'
      })
    } finally {
      // Always close the sandbox connection
      await sandbox.close()
    }
  } catch (error) {
    console.error('Error updating sandbox:', error)
    return NextResponse.json(
      {
        error: 'Failed to update sandbox',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

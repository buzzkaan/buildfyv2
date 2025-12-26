import { Sandbox } from '@e2b/code-interpreter'
import { inngest } from '@/inngest/client'
// import { Agent, agenticOpenai as openai, createAgent } from '@inngest/agent-kit'
import { createAgent, openai } from '@inngest/agent-kit'
import { getSandbox } from './utils'

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },

  async ({ event, step }) => {
    const sandBoxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('buildfy-nextjs-buzzka-test-2')
      return sandbox.sandboxId
    })

    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert next.js developer. You write readable , maintainable code. You write simple Next.js & React snippets.',
      model: openai({ model: 'gpt-4o' })
    })

    const { output } = await codeAgent.run(
      ` summarize the following text: ${event.data.value}`
    )

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandBoxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })

    console.log(output)

    return { output, sandboxUrl }
  }
)

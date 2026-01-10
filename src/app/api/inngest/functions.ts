import { Sandbox } from '@e2b/code-interpreter'
import { inngest } from '@/inngest/client'
// import { Agent, agenticOpenai as openai, createAgent } from '@inngest/agent-kit'
import { createAgent, createTool, openai, createNetwork } from '@inngest/agent-kit'
import { getSandbox, lastAssistantTextMessageContent } from './utils'
import { z } from 'zod'
import { step } from 'inngest'
import { PROMPT } from "@/prompt"


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
      system: PROMPT,
      description: 'An Expert Code Agent',
      model: openai({
        model: 'gpt-4.1',
        defaultParameters: {
          temperature: 0.1,
        }
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal tool to run commands",
          parameters: z.object({
            command: z.string()
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' }
              try {
                const sandbox = await getSandbox(sandBoxId)
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data
                  }
                })
                return result.stdout
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                )
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
              }
            })
          },
        }),


        createTool({
          name: "createOrUpdateFile",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string()
              })
            )
          }),

          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run('createOrUpdateFile', async () => {
              try {
                const updateFiles = network.state.data.files || {}
                const sandbox = await getSandbox(sandBoxId)
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content)
                  updateFiles[file.path] = file.content
                }


                return updateFiles
              }
              catch (e) {
                return "Error: " + e;
              }
            })

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles
            }

          },
        }),

        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string())
          }),

          handler: async ({ files }, { step }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandBoxId)
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file)
                  contents.push({ path: file, content })
                }
                return JSON.stringify(contents)
              }
              catch (e) {
                return "Error: " + e;
              }
            })
          },
        })


      ],
      lifecycle: {

        onResponse: async ({ result, network }) => {

          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result)

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText
            }
          }
          return result;

        }
      }

    })

    const network = createNetwork(
      {
        name: "coding-agent-network",
        agents: [codeAgent],
        maxIter: 15,
        router: async ({ network }) => {
          const summary = network.state.data.summary
          if (summary) {
            return;
          }
          return codeAgent;
        }


      }
    )


    const result = await network.run(event.data.value);







    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandBoxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })


    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary


    }

  }


)



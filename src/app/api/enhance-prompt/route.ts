import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"

const client = new OpenAI()

const MAX_PROMPT_LENGTH = 2000

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: "Prompt too long" }, { status: 400 })
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are a UI/UX design expert. Take the given web app prompt and add style details only: color palette, typography, layout feel, visual aesthetic (e.g. minimal, glassmorphism, dark/light). Keep it short and natural. Return ONLY the improved prompt, nothing else.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const enhanced = response.choices[0]?.message?.content ?? prompt

    return NextResponse.json({ enhanced })
  } catch (error) {
    console.error("Enhance prompt error:", error)
    return NextResponse.json({ error: "Failed to enhance prompt" }, { status: 500 })
  }
}

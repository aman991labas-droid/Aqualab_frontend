import { buildSystemPrompt } from '@/lib/chat/system-prompt'
import { streamFallbackResponse } from '@/lib/chat/fallback-responses'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || null
}

function formatMessagesForGemini(messages) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
}

async function* streamGeminiLocal(messages) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: buildSystemPrompt() }],
      },
      contents: formatMessagesForGemini(messages),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (!payload || payload === '[DONE]') continue

      try {
        const json = JSON.parse(payload)
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) yield text
      } catch {
        /* ignore malformed SSE chunks */
      }
    }
  }
}

async function* streamGeminiBackend(messages) {
  const base = getBackendUrl()
  if (!base) return

  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Backend chat error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (!payload || payload === '[DONE]') continue

      try {
        const json = JSON.parse(payload)
        if (json.error) throw new Error(json.error)
        if (json.text) yield json.text
      } catch (err) {
        if (err instanceof Error && err.message !== 'Unexpected end of JSON input') {
          throw err
        }
      }
    }
  }
}

async function* streamWithFallback(messages, lastUserContent) {
  const backends = []

  if (getBackendUrl()) {
    backends.push(() => streamGeminiBackend(messages))
  }
  if (process.env.GEMINI_API_KEY) {
    backends.push(() => streamGeminiLocal(messages))
  }

  for (const streamFn of backends) {
    let gotContent = false
    try {
      for await (const chunk of streamFn()) {
        gotContent = true
        yield chunk
      }
      if (gotContent) return
    } catch {
      /* try next backend */
    }
  }

  yield* streamFallbackResponse(lastUserContent)
}

function createSSEStream(generator) {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body?.messages) ? body.messages : []

    if (messages.length === 0) {
      return Response.json({ error: 'Messages required' }, { status: 400 })
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser?.content?.trim()) {
      return Response.json({ error: 'User message required' }, { status: 400 })
    }

    const generator = streamWithFallback(messages, lastUser.content)

    return new Response(createSSEStream(generator), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

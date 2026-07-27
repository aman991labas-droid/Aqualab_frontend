'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { detectLanguage, getUiStrings } from '@/lib/chat/detect-language'
import { SUGGESTED_QUESTIONS } from '@/data/aqualab-knowledge'

const STORAGE_KEY = 'aqualab-chat-history'

function loadHistory() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistory(messages) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
  } catch {
    /* storage full or unavailable */
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('fr')
  const abortRef = useRef(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true
      const saved = loadHistory()
      setMessages(saved)
      const lastUser = [...saved].reverse().find((m) => m.role === 'user')
      if (lastUser?.content) setLanguage(detectLanguage(lastUser.content))
    }
  }, [])

  useEffect(() => {
    if (hydratedRef.current) saveHistory(messages)
  }, [messages])

  const ui = getUiStrings(language)

  const streamResponse = useCallback(async (historyMessages, assistantId) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setIsStreaming(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyMessages }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error('Request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') continue

          try {
            const data = JSON.parse(payload)
            if (data.error) throw new Error(data.error)
            if (data.text) {
              accumulated += data.text
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
              )
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
              throw parseErr
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(ui.error)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && !m.content
            ? { ...m, content: ui.error, isError: true }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [ui.error])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim()
      if (!trimmed || isLoading) return

      const lang = detectLanguage(trimmed)
      setLanguage(lang)

      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
      }

      const assistantId = `assistant-${Date.now()}`
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      }

      const nextMessages = [...messages, userMsg, assistantMsg]
      setMessages(nextMessages)

      const historyForApi = nextMessages
        .filter((m) => m.id !== assistantId)
        .map(({ role, content }) => ({ role, content }))

      await streamResponse(historyForApi, assistantId)
    },
    [isLoading, messages, streamResponse],
  )

  const regenerateLast = useCallback(async () => {
    if (isLoading) return

    let lastUserIndex = -1
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === 'user') {
        lastUserIndex = i
        break
      }
    }
    if (lastUserIndex === -1) return

    const history = messages.slice(0, lastUserIndex + 1)
    const assistantId = `assistant-${Date.now()}`
    const assistantMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    }

    setMessages([...history, assistantMsg])

    const historyForApi = history.map(({ role, content }) => ({ role, content }))
    await streamResponse(historyForApi, assistantId)
  }, [isLoading, messages, streamResponse])

  const clearConversation = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setIsLoading(false)
    setIsStreaming(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), [])
  const close = useCallback(() => setIsOpen(false), [])

  return {
    messages,
    isOpen,
    isLoading,
    isStreaming,
    error,
    language,
    ui,
    suggestedQuestions: SUGGESTED_QUESTIONS,
    sendMessage,
    regenerateLast,
    clearConversation,
    toggleOpen,
    close,
    setLanguage,
  }
}

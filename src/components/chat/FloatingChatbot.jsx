'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Copy,
  Check,
  MessageCircle,
  RefreshCw,
  Send,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react'
import MarkdownMessage from './MarkdownMessage'
import { useChatbot } from './useChatbot'
import './FloatingChatbot.css'

function TypingIndicator() {
  return (
    <div className="chat-typing" aria-label="Typing">
      <span /><span /><span />
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="chat-loading" aria-hidden="true">
      <span /><span /><span />
    </div>
  )
}

export default function FloatingChatbot() {
  const {
    messages,
    isOpen,
    isLoading,
    isStreaming,
    ui,
    suggestedQuestions,
    sendMessage,
    regenerateLast,
    clearConversation,
    toggleOpen,
    close,
  } = useChatbot()

  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isStreaming, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    sendMessage(text)
  }

  const handleCopy = async (id, content) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleSuggestion = (q) => {
    if (isLoading) return
    sendMessage(q)
  }

  const showSuggestions = messages.length === 0 && !isLoading
  const lastMessage = messages[messages.length - 1]
  const canRegenerate =
    !isLoading &&
    lastMessage?.role === 'assistant' &&
    lastMessage.content &&
    !lastMessage.isError

  return (
    <div className="chatbot-root" aria-live="polite">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            className="chatbot-panel"
            role="dialog"
            aria-modal="true"
            aria-label={ui.title}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <header className="chatbot-header">
              <div className="chatbot-header__info">
                <div className="chatbot-header__avatar" aria-hidden="true">
                  <Bot size={22} />
                </div>
                <div>
                  <h2 className="chatbot-header__title">{ui.title}</h2>
                  <p className="chatbot-header__subtitle">
                    {isStreaming ? ui.typing : ui.subtitle}
                  </p>
                </div>
              </div>
              <div className="chatbot-header__actions">
                {messages.length > 0 && (
                  <button
                    type="button"
                    className="chatbot-icon-btn"
                    onClick={clearConversation}
                    aria-label={ui.clear}
                    title={ui.clear}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="button"
                  className="chatbot-icon-btn"
                  onClick={close}
                  aria-label={ui.close}
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="chatbot-messages">
              {messages.length === 0 && (
                <div className="chatbot-welcome">
                  <div className="chatbot-welcome__icon" aria-hidden="true">
                    <Sparkles size={28} />
                  </div>
                  <MarkdownMessage content={ui.welcome} />
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chatbot-msg chatbot-msg--${msg.role}${msg.isError ? ' chatbot-msg--error' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="chatbot-msg__avatar" aria-hidden="true">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className="chatbot-msg__bubble">
                    {msg.role === 'assistant' && !msg.content && isLoading ? (
                      <TypingIndicator />
                    ) : (
                      <MarkdownMessage content={msg.content} />
                    )}

                    {msg.role === 'assistant' && msg.content && !msg.isError && (
                      <div className="chatbot-msg__actions">
                        <button
                          type="button"
                          className="chatbot-msg__action"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          aria-label={ui.copy}
                        >
                          {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedId === msg.id ? ui.copied : ui.copy}</span>
                        </button>
                        {msg.id === lastMessage?.id && canRegenerate && (
                          <button
                            type="button"
                            className="chatbot-msg__action"
                            onClick={regenerateLast}
                            aria-label={ui.regenerate}
                          >
                            <RefreshCw size={14} />
                            <span>{ui.regenerate}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

            </div>

            {showSuggestions && (
              <div className="chatbot-suggestions">
                <p className="chatbot-suggestions__label">{ui.suggestions}</p>
                <div className="chatbot-suggestions__list">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="chatbot-suggestion"
                      onClick={() => handleSuggestion(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="chatbot-input" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className="chatbot-input__field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder={ui.placeholder}
                rows={1}
                disabled={isLoading}
                aria-label={ui.placeholder}
              />
              <button
                type="submit"
                className="chatbot-input__send"
                disabled={!input.trim() || isLoading}
                aria-label={ui.send}
              >
                {isLoading ? <LoadingDots /> : <Send size={18} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`chatbot-fab${isOpen ? ' chatbot-fab--open' : ''}`}
        onClick={toggleOpen}
        aria-label={isOpen ? ui.close : ui.open}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={26} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={26} />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && <span className="chatbot-fab__pulse" aria-hidden="true" />}
      </motion.button>
    </div>
  )
}

'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function isInternalPath(href) {
  return href.startsWith('/') && !href.startsWith('//')
}

function inlineFormat(text) {
  let html = escapeHtml(text)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) => {
      if (isInternalPath(href)) {
        return `<a href="${href}" data-internal="true">${label}</a>`
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    },
  )
  html = html.replace(
    /(?<![">])(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  )
  return html
}

function parseMarkdown(content) {
  if (!content) return ''

  const lines = content.split('\n')
  const blocks = []
  let listItems = []
  let listType = null

  const flushList = () => {
    if (listItems.length === 0) return
    const tag = listType === 'ol' ? 'ol' : 'ul'
    blocks.push(`<${tag}>${listItems.map((i) => `<li>${inlineFormat(i)}</li>`).join('')}</${tag}>`)
    listItems = []
    listType = null
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    if (/^#{1,3}\s/.test(trimmed)) {
      flushList()
      const level = trimmed.match(/^#+/)[0].length
      const text = trimmed.replace(/^#+\s*/, '')
      blocks.push(`<h${Math.min(level + 2, 6)}>${inlineFormat(text)}</h${Math.min(level + 2, 6)}>`)
      continue
    }

    if (/^[-*]\s/.test(trimmed)) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'
      listItems.push(trimmed.replace(/^[-*]\s*/, ''))
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'
      listItems.push(trimmed.replace(/^\d+\.\s*/, ''))
      continue
    }

    flushList()
    blocks.push(`<p>${inlineFormat(trimmed)}</p>`)
  }

  flushList()
  return blocks.join('')
}

export default function MarkdownMessage({ content, className = '' }) {
  const router = useRouter()
  const html = useMemo(() => parseMarkdown(content), [content])

  const handleClick = useCallback(
    (e) => {
      const anchor = e.target.closest('a[data-internal="true"]')
      if (!anchor) return
      e.preventDefault()
      router.push(anchor.getAttribute('href'))
    },
    [router],
  )

  return (
    <div
      className={`chat-md ${className}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

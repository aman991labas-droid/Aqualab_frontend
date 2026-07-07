import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialContactMessages } from '../data/mockData'
import { delay, uid } from './mockUtils'

let messages = initialContactMessages.map((m) => ({ ...m }))

function parseContactMessageId(id) {
  if (typeof id === 'number') return id
  return String(id).replace(/^msg-/, '')
}

export const contactService = {
  async getMessages() {
    if (useApiBackend()) {
      return adminFetch('/api/contact-messages')
    }

    await delay()
    return [...messages].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  },

  async getMessage(id) {
    if (useApiBackend()) {
      const numericId = parseContactMessageId(id)
      return adminFetch(`/api/contact-messages/${numericId}`)
    }

    await delay()
    const item = messages.find((m) => m.id === id)
    if (!item) throw new Error('Message introuvable.')
    if (!item.isRead) {
      item.isRead = true
      item.readAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
    return item
  },

  async markAsRead(id, read = true) {
    if (useApiBackend()) {
      const numericId = parseContactMessageId(id)
      return adminFetch(`/api/contact-messages/${numericId}`, {
        method: 'PATCH',
        body: JSON.stringify({ read }),
      })
    }

    await delay()
    messages = messages.map((item) =>
      item.id === id
        ? {
            ...item,
            isRead: read,
            readAt: read ? new Date().toISOString().slice(0, 16).replace('T', ' ') : null,
          }
        : item
    )
    return messages.find((item) => item.id === id)
  },

  async deleteMessage(id) {
    if (useApiBackend()) {
      const numericId = parseContactMessageId(id)
      return adminFetch(`/api/contact-messages/${numericId}`, { method: 'DELETE' })
    }

    await delay()
    messages = messages.filter((item) => item.id !== id)
    return { ok: true }
  },
}

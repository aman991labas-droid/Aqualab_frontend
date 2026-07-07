import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialBlogCategories } from '../data/mockData'
import { delay } from './mockUtils'

let categories = initialBlogCategories.map((c) => ({ ...c }))

export const categoryService = {
  async getCategories() {
    if (useApiBackend()) {
      return adminFetch('/api/blog-categories')
    }

    await delay()
    return [...categories]
  },

  async createCategory(payload) {
    if (!payload.id?.trim() || !payload.label?.trim()) {
      throw new Error('id et label sont requis.')
    }
    if (payload.id === 'all') throw new Error('L\'identifiant "all" est réservé.')

    if (useApiBackend()) {
      return adminFetch('/api/blog-categories', {
        method: 'POST',
        body: JSON.stringify({ key: payload.id.trim(), label: payload.label.trim() }),
      })
    }

    await delay()
    if (categories.some((c) => c.id === payload.id)) {
      throw new Error('Cet identifiant existe déjà.')
    }
    const newItem = { id: payload.id.trim(), label: payload.label.trim() }
    categories = [...categories, newItem]
    return newItem
  },

  async updateCategory(id, payload) {
    if (!payload.label?.trim()) throw new Error('label est requis.')

    if (useApiBackend()) {
      return adminFetch(`/api/blog-categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ label: payload.label.trim() }),
      })
    }

    await delay()
    categories = categories.map((item) =>
      item.id === id ? { ...item, label: payload.label.trim() } : item
    )
    return categories.find((item) => item.id === id)
  },

  async deleteCategory(id) {
    if (id === 'all') throw new Error('Impossible de supprimer la catégorie "all".')

    if (useApiBackend()) {
      return adminFetch(`/api/blog-categories/${id}`, { method: 'DELETE' })
    }

    await delay()
    categories = categories.filter((item) => item.id !== id)
    return { ok: true }
  },
}

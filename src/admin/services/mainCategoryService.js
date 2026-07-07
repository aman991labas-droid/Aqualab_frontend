import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialMainCategories } from '../data/mockData'
import { delay } from './mockUtils'

let mainCategories = initialMainCategories.map((c) => ({ ...c }))

export const mainCategoryService = {
  async getMainCategories() {
    if (useApiBackend()) {
      return adminFetch('/api/main-categories')
    }

    await delay()
    return [...mainCategories]
  },

  async createMainCategory(payload) {
    if (!payload.id?.trim() || !payload.label?.trim()) {
      throw new Error('Identifiant et libellé sont requis.')
    }

    if (useApiBackend()) {
      return adminFetch('/api/main-categories', {
        method: 'POST',
        body: JSON.stringify({
          key: payload.id.trim(),
          label: payload.label.trim(),
          sort_order: payload.sortOrder ?? 0,
        }),
      })
    }

    await delay()
    if (mainCategories.some((c) => c.id === payload.id.trim())) {
      throw new Error('Cet identifiant existe déjà.')
    }
    const newItem = {
      id: payload.id.trim(),
      label: payload.label.trim(),
      sortOrder: payload.sortOrder ?? 0,
    }
    mainCategories = [...mainCategories, newItem].sort((a, b) => a.sortOrder - b.sortOrder)
    return newItem
  },

  async updateMainCategory(id, payload) {
    if (!payload.label?.trim()) throw new Error('Libellé requis.')

    if (useApiBackend()) {
      return adminFetch(`/api/main-categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          label: payload.label.trim(),
          sort_order: payload.sortOrder ?? 0,
        }),
      })
    }

    await delay()
    mainCategories = mainCategories
      .map((item) =>
        item.id === id
          ? { ...item, label: payload.label.trim(), sortOrder: payload.sortOrder ?? item.sortOrder ?? 0 }
          : item
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return mainCategories.find((item) => item.id === id)
  },

  async deleteMainCategory(id) {
    if (useApiBackend()) {
      return adminFetch(`/api/main-categories/${id}`, { method: 'DELETE' })
    }

    await delay()
    mainCategories = mainCategories.filter((item) => item.id !== id)
    return { ok: true }
  },
}

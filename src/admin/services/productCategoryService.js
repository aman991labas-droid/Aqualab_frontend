import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { delay } from './mockUtils'

// Mock data fallback if api backend isn't used
let productCategories = [
  { id: 1, name: 'Stéréomicroscopes Série M' },
  { id: 2, name: 'Microscopes droits' }
]

export const productCategoryService = {
  async getProductCategories() {
    if (useApiBackend()) {
      const response = await adminFetch('/api/product-categories')
      return Array.isArray(response) ? response : (response?.data || [])
    }

    await delay()
    return [...productCategories]
  },

  async createProductCategory(payload) {
    if (!payload.name?.trim()) {
      throw new Error('Nom requis.')
    }

    if (useApiBackend()) {
      const response = await adminFetch('/api/product-categories', {
        method: 'POST',
        body: JSON.stringify({ name: payload.name.trim() }),
      })
      return response?.id ? response : response?.data
    }

    await delay()
    if (productCategories.some((c) => c.name.toLowerCase() === payload.name.trim().toLowerCase())) {
      throw new Error('Ce nom existe déjà.')
    }
    const newItem = {
      id: Date.now(),
      name: payload.name.trim(),
    }
    productCategories = [...productCategories, newItem]
    return newItem
  },

  async updateProductCategory(id, payload) {
    if (!payload.name?.trim()) throw new Error('Nom requis.')

    if (useApiBackend()) {
      const response = await adminFetch(`/api/product-categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: payload.name.trim() }),
      })
      return response?.id ? response : response?.data
    }

    await delay()
    productCategories = productCategories.map((item) =>
      item.id === id ? { ...item, name: payload.name.trim() } : item
    )
    return productCategories.find((item) => item.id === id)
  },

  async deleteProductCategory(id) {
    if (useApiBackend()) {
      return adminFetch(`/api/product-categories/${id}`, { method: 'DELETE' })
    }

    await delay()
    productCategories = productCategories.filter((item) => item.id !== id)
    return { ok: true }
  },
}

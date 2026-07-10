import { adminFetch, adminFetchFull, useApiBackend } from '@/services/api/adminClient'

export const newsletterService = {
  async getSubscribers(params = {}) {
    if (!useApiBackend()) {
      return { stats: { total: 0, active: 0, unsubscribed: 0 }, data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } }
    }

    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.status && params.status !== 'all') query.set('status', params.status)
    if (params.sort) query.set('sort', params.sort)
    if (params.dir) query.set('dir', params.dir)
    if (params.page) query.set('page', String(params.page))
    if (params.perPage) query.set('per_page', String(params.perPage))

    const suffix = query.toString() ? `?${query.toString()}` : ''
    return adminFetchFull(`/api/admin/newsletter/subscribers${suffix}`)
  },

  async deactivateSubscriber(id) {
    return adminFetch(`/api/admin/newsletter/subscribers/${id}`, { method: 'DELETE' })
  },

  async addSubscriber(email) {
    return adminFetch(`/api/admin/newsletter/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  },
}

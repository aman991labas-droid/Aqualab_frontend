import {
  adminFetch,
  parseApplicationId,
  useApiBackend,
} from '@/services/api/adminClient'
import { initialApplications } from '../data/mockData'
import { delay, uid } from './mockUtils'
import { scoreApplicationFallback } from '../utils/aiHelpers'

let applications = initialApplications.map((a) => ({ ...a }))

export const applicationService = {
  async getApplications() {
    if (useApiBackend()) {
      return adminFetch('/api/applications')
    }

    await delay()
    return [...applications]
  },

  async createApplication(payload) {
    await delay()
    const newItem = {
      id: uid('app'),
      name: payload.name?.trim(),
      email: payload.email?.trim(),
      tel: payload.tel?.trim() || '',
      jobType: payload.jobType?.trim() || '',
      cvFile: payload.cvFile || '',
      cvUrl: payload.cvUrl || '#',
      message: payload.message?.trim(),
      submittedAt: payload.submittedAt || new Date().toISOString().slice(0, 10),
      status: payload.status || 'new',
    }
    applications = [newItem, ...applications]
    return newItem
  },

  async updateApplicationStatus(id, status) {
    if (useApiBackend()) {
      const numericId = parseApplicationId(id)
      return adminFetch(`/api/applications/${numericId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    }

    await delay()
    applications = applications.map((item) => (item.id === id ? { ...item, status } : item))
    return applications.find((item) => item.id === id)
  },

  async deleteApplication(id) {
    if (useApiBackend()) {
      const numericId = parseApplicationId(id)
      return adminFetch(`/api/applications/${numericId}`, { method: 'DELETE' })
    }

    await delay()
    applications = applications.filter((item) => item.id !== id)
    return { ok: true }
  },

  async scoreApplication(id) {
    if (useApiBackend()) {
      const numericId = parseApplicationId(id)
      return adminFetch(`/api/applications/${numericId}/priority-score`, { method: 'POST' })
    }

    await delay(300)
    const application = applications.find((item) => item.id === id)
    if (!application) throw new Error('Candidature introuvable.')
    return scoreApplicationFallback(application)
  },
}

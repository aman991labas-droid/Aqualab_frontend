import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialPartners } from '../data/mockData'
import { delay } from './mockUtils'

let partners = initialPartners.map((p) => ({ ...p }))

function mapPartner(partner) {
  return {
    id: partner.id,
    name: partner.name,
    specialty: partner.specialty,
    url: partner.url ?? '',
    logo: partner.logo ?? '',
    sortOrder: partner.sortOrder ?? 0,
    preserveContrast: !!partner.preserveContrast,
    isActive: partner.isActive !== false,
  }
}

export const partnerService = {
  async getPartners() {
    if (useApiBackend()) {
      const data = await adminFetch('/api/admin/partners')
      return (data ?? []).map(mapPartner)
    }

    await delay()
    return [...partners].sort((a, b) => a.sortOrder - b.sortOrder)
  },

  async createPartner(payload) {
    if (!payload.name?.trim() || !payload.specialty?.trim()) {
      throw new Error('Nom et spécialité sont requis.')
    }

    if (useApiBackend()) {
      const data = await adminFetch('/api/partners', {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name.trim(),
          specialty: payload.specialty.trim(),
          url: payload.url?.trim() || null,
          logo: payload.logo || null,
          sort_order: payload.sortOrder ?? 0,
          preserve_contrast: !!payload.preserveContrast,
          is_active: payload.isActive !== false,
        }),
      })
      return mapPartner(data)
    }

    await delay()
    const newItem = {
      id: Date.now(),
      name: payload.name.trim(),
      specialty: payload.specialty.trim(),
      url: payload.url?.trim() || '',
      logo: payload.logo || '',
      sortOrder: payload.sortOrder ?? partners.length,
      preserveContrast: !!payload.preserveContrast,
      isActive: payload.isActive !== false,
    }
    partners = [...partners, newItem].sort((a, b) => a.sortOrder - b.sortOrder)
    return newItem
  },

  async updatePartner(id, payload) {
    if (!payload.name?.trim() || !payload.specialty?.trim()) {
      throw new Error('Nom et spécialité sont requis.')
    }

    if (useApiBackend()) {
      const data = await adminFetch(`/api/partners/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: payload.name.trim(),
          specialty: payload.specialty.trim(),
          url: payload.url?.trim() || null,
          logo: payload.logo || null,
          sort_order: payload.sortOrder ?? 0,
          preserve_contrast: !!payload.preserveContrast,
          is_active: payload.isActive !== false,
        }),
      })
      return mapPartner(data)
    }

    await delay()
    partners = partners
      .map((item) =>
        item.id === id
          ? {
              ...item,
              name: payload.name.trim(),
              specialty: payload.specialty.trim(),
              url: payload.url?.trim() || '',
              logo: payload.logo ?? item.logo,
              sortOrder: payload.sortOrder ?? item.sortOrder ?? 0,
              preserveContrast: !!payload.preserveContrast,
              isActive: payload.isActive !== false,
            }
          : item
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return partners.find((item) => item.id === id)
  },

  async deletePartner(id) {
    if (useApiBackend()) {
      return adminFetch(`/api/partners/${id}`, { method: 'DELETE' })
    }

    await delay()
    partners = partners.filter((item) => item.id !== id)
    return { ok: true }
  },
}

import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialProductTabs } from '../data/mockData'
import { mainCategoryService } from './mainCategoryService'
import { delay } from './mockUtils'
import { generateProductDescriptionFallback } from '../utils/aiHelpers'

let tabs = initialProductTabs.map((tab) => ({
  ...tab,
  categories: tab.categories.map((cat) => ({ ...cat, items: [...cat.items] })),
}))

function normalizeItemImages(item, itemName = '') {
  if (Array.isArray(item?.images) && item.images.length > 0) {
    return item.images
      .map((img) => {
        if (typeof img === 'string') {
          return { url: img, alt: itemName || null }
        }
        const url = img?.url ?? img?.image ?? ''
        if (!url) return null
        return {
          url,
          alt: (img?.alt ?? img?.imageAlt ?? itemName) || null,
        }
      })
      .filter(Boolean)
  }

  if (item?.image) {
    return [{ url: item.image, alt: (item.imageAlt ?? itemName) || null }]
  }

  return []
}

function normalizeItems(items = []) {
  return items
    .map((item) => {
      if (typeof item === 'string') return item.trim()

      const name = item?.name?.trim()
      if (!name) return null

      const images = normalizeItemImages(item, name)

      return {
        name,
        images,
        details: item.details?.trim() || null,
      }
    })
    .filter(Boolean)
}

function mapFormToApi(form) {
  return {
    slug: form.slug?.trim(),
    title: form.title?.trim(),
    group: form.tabId,
    partner: form.partner?.trim(),
    partner_logo: form.partnerLogo || null,
    short_desc: form.metaDescription?.slice(0, 255) || form.title?.trim(),
    description: form.metaDescription || form.title?.trim(),
    image: form.groupImage || `/images/products/${form.slug}.jpg`,
    items: normalizeItems(form.items),
    seo_title: form.metaTitle || null,
    seo_description: form.metaDescription || null,
  }
}

function groupCategoriesFromApi(categories, mainCategories) {
  return mainCategories.map((tab) => ({
    ...tab,
    categories: categories
      .filter((category) => category.group === tab.id)
      .map((category) => ({
        slug: category.slug,
        title: category.title,
        partner: category.partner,
        partnerLogo: category.partnerLogo,
        groupImage: category.image,
        metaTitle: category.seo?.title ?? '',
        metaDescription: category.seo?.description ?? category.description ?? '',
        items: category.items ?? [],
      })),
  }))
}

function flattenFromApi(categories, mainCategories) {
  return mainCategories.flatMap((tab) =>
    categories
      .filter((category) => category.group === tab.id)
      .map((category, categoryIndex) => ({
        tabId: tab.id,
        tabLabel: tab.label,
        categoryIndex,
        slug: category.slug,
        title: category.title,
        partner: category.partner,
        partnerLogo: category.partnerLogo,
        groupImage: category.image,
        metaTitle: category.seo?.title ?? '',
        metaDescription: category.seo?.description ?? category.description ?? '',
        items: category.items ?? [],
      }))
  )
}

async function fetchCategoriesBundle() {
  const [categories, mainCategories] = await Promise.all([
    adminFetch('/api/categories'),
    mainCategoryService.getMainCategories(),
  ])
  return {
    tabs: groupCategoriesFromApi(categories, mainCategories),
    groups: flattenFromApi(categories, mainCategories),
    mainCategories,
  }
}

function flattenFromMock() {
  return tabs.flatMap((tab) =>
    tab.categories.map((cat, categoryIndex) => ({
      tabId: tab.id,
      tabLabel: tab.label,
      categoryIndex,
      title: cat.title,
      partner: cat.partner,
      items: cat.items,
    }))
  )
}

export const productService = {
  async getTabs() {
    if (useApiBackend()) {
      const { tabs } = await fetchCategoriesBundle()
      return tabs
    }

    await delay()
    return tabs.map((tab) => ({
      ...tab,
      categories: tab.categories.map((cat) => ({ ...cat, items: [...cat.items] })),
    }))
  },

  async getCategoryGroups() {
    if (useApiBackend()) {
      const { groups } = await fetchCategoriesBundle()
      return groups
    }

    await delay()
    return flattenFromMock()
  },

  async getCategoriesBundle() {
    if (useApiBackend()) {
      return fetchCategoriesBundle()
    }

    await delay()
    const mainCategories = await mainCategoryService.getMainCategories()
    return {
      tabs: tabs.map((tab) => ({
        ...tab,
        categories: tab.categories.map((cat) => ({ ...cat, items: [...cat.items] })),
      })),
      groups: flattenFromMock(),
      mainCategories,
    }
  },

  async createCategoryGroup(form) {
    if (useApiBackend()) {
      return adminFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify(mapFormToApi(form)),
      })
    }

    await delay()
    const tab = tabs.find((t) => t.id === form.tabId)
    if (!tab) throw new Error('Onglet introuvable.')
    const group = {
      title: form.title.trim(),
      partner: form.partner.trim(),
      items: normalizeItems(form.items),
    }
    tab.categories = [...tab.categories, group]
    return group
  },

  async updateCategoryGroup(tabId, categoryIndex, form, slug) {
    if (useApiBackend()) {
      const categorySlug = slug ?? (await this.getCategoryGroups()).find(
        (g) => g.tabId === tabId && g.categoryIndex === categoryIndex,
      )?.slug
      if (!categorySlug) throw new Error('Groupe introuvable.')
      return adminFetch(`/api/categories/${categorySlug}`, {
        method: 'PATCH',
        body: JSON.stringify(mapFormToApi(form)),
      })
    }

    await delay()
    const sourceTab = tabs.find((t) => t.id === tabId)
    if (!sourceTab || !sourceTab.categories[categoryIndex]) throw new Error('Groupe introuvable.')

    const updatedGroup = {
      ...sourceTab.categories[categoryIndex],
      title: form.title.trim(),
      partner: form.partner.trim(),
      items: normalizeItems(form.items),
    }

    if (form.tabId !== tabId) {
      const targetTab = tabs.find((t) => t.id === form.tabId)
      if (!targetTab) throw new Error('Catégorie principale introuvable.')
      sourceTab.categories = sourceTab.categories.filter((_, i) => i !== categoryIndex)
      targetTab.categories = [...targetTab.categories, updatedGroup]
    } else {
      sourceTab.categories[categoryIndex] = updatedGroup
    }

    return updatedGroup
  },

  async deleteCategoryGroup(tabId, categoryIndex, slug) {
    if (useApiBackend()) {
      const categorySlug = slug ?? (await this.getCategoryGroups()).find(
        (g) => g.tabId === tabId && g.categoryIndex === categoryIndex,
      )?.slug
      if (!categorySlug) throw new Error('Groupe introuvable.')
      return adminFetch(`/api/categories/${categorySlug}`, { method: 'DELETE' })
    }

    await delay()
    const tab = tabs.find((t) => t.id === tabId)
    if (!tab) throw new Error('Onglet introuvable.')
    tab.categories = tab.categories.filter((_, i) => i !== categoryIndex)
    return { ok: true }
  },

  async generateDescription({ title, partner, tabId, categoryLabel, items }) {
    const payload = {
      title: title?.trim(),
      partner: partner?.trim() || null,
      group: tabId,
      category_label: categoryLabel || tabId,
      items: (items || []).map((item) => ({
        name: item.name?.trim() || '',
        details: item.details?.trim() || '',
      })),
    }

    if (useApiBackend()) {
      return adminFetch('/api/categories/generate-description', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }

    await delay(400)
    return generateProductDescriptionFallback({
      title: payload.title,
      partner: payload.partner,
      tabId,
      categoryLabel: payload.category_label,
      items: payload.items,
    })
  },
}

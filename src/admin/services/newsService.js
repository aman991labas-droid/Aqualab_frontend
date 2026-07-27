import { adminFetch, useApiBackend } from '@/services/api/adminClient'
import { initialArticles } from '../data/mockData'
import { delay } from './mockUtils'
import { ensureUniqueSlug, generateSeoSlug } from '../utils/slug'
import { generateArticleContentFallback } from '../utils/aiHelpers'

let articles = initialArticles.map((a) => ({ ...a, author: { ...a.author } }))

const nextArticleId = () => (articles.length ? Math.max(...articles.map((a) => a.id)) + 1 : 1)

function mapArticleToApi(payload) {
  return {
    slug: payload.slug?.trim(),
    title: payload.title?.trim(),
    excerpt: payload.excerpt?.trim(),
    content: payload.content?.trim(),
    category: payload.category,
    image: payload.image,
    author_name: payload.author?.name?.trim(),
    author_avatar: payload.author?.avatar || null,
    published_at: payload.date,
    read_time: Number(payload.readTime),
    featured: !!payload.featured,
    related_product_slugs: payload.relatedProductSlugs ?? [],
  }
}

export const newsService = {
  async getNews() {
    if (useApiBackend()) {
      return adminFetch('/api/articles')
    }

    await delay()
    return articles.map((a) => ({ ...a, author: { ...a.author } }))
  },

  async createNews(payload) {
    if (useApiBackend()) {
      return adminFetch('/api/articles', {
        method: 'POST',
        body: JSON.stringify(mapArticleToApi(payload)),
      })
    }

    await delay()
    const newItem = {
      id: nextArticleId(),
      slug: payload.slug?.trim(),
      title: payload.title?.trim(),
      excerpt: payload.excerpt?.trim(),
      content: payload.content?.trim(),
      category: payload.category,
      image: payload.image,
      author: { name: payload.author?.name?.trim(), avatar: payload.author?.avatar || '' },
      date: payload.date,
      readTime: Number(payload.readTime),
      featured: !!payload.featured,
    }
    articles = [newItem, ...articles]
    return newItem
  },

  async updateNews(id, payload) {
    if (useApiBackend()) {
      return adminFetch(`/api/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(mapArticleToApi(payload)),
      })
    }

    await delay()
    articles = articles.map((item) =>
      item.id === id
        ? {
            ...item,
            slug: payload.slug?.trim(),
            title: payload.title?.trim(),
            excerpt: payload.excerpt?.trim(),
            content: payload.content?.trim(),
            category: payload.category,
            image: payload.image,
            author: { name: payload.author?.name?.trim(), avatar: payload.author?.avatar || '' },
            date: payload.date,
            readTime: Number(payload.readTime),
            featured: !!payload.featured,
          }
        : item
    )
    return articles.find((item) => item.id === id)
  },

  async deleteNews(id) {
    if (useApiBackend()) {
      return adminFetch(`/api/articles/${id}`, { method: 'DELETE' })
    }

    await delay()
    articles = articles.filter((item) => item.id !== id)
    return { ok: true }
  },

  async suggestSlug({ title, excerpt, categoryLabel, excludeId }) {
    if (useApiBackend()) {
      const result = await adminFetch('/api/articles/suggest-slug', {
        method: 'POST',
        body: JSON.stringify({
          title: title?.trim(),
          excerpt: excerpt?.trim() || null,
          category_label: categoryLabel || null,
          exclude_id: excludeId || null,
        }),
      })
      return result?.slug ?? ''
    }

    await delay(200)
    const existingSlugs = articles
      .filter((item) => item.id !== excludeId)
      .map((item) => item.slug)
    const baseSlug = generateSeoSlug({ title, excerpt, categoryLabel })
    return ensureUniqueSlug(baseSlug, existingSlugs)
  },

  async generateContent({ title, categoryLabel }) {
    if (useApiBackend()) {
      return adminFetch('/api/articles/generate-content', {
        method: 'POST',
        body: JSON.stringify({
          title: title?.trim(),
          category_label: categoryLabel || null,
        }),
      })
    }

    await delay(400)
    return generateArticleContentFallback({ title, categoryLabel })
  },
}

import 'server-only'
import {
  productCategories as staticProductCategories,
  productGroups as staticProductGroups,
  getCategoryBySlug as getStaticCategoryBySlug,
} from '@/data/products'
import { articles as staticArticles } from '@/data/articles'

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? ''
}

async function fetchApi(path) {
  const base = getApiBase()
  if (!base) return null

  try {
    const response = await fetch(`${base}${path}`, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) return null

    const body = await response.json()
    return body?.data ?? body
  } catch {
    return null
  }
}

export async function getAllCategories() {
  const data = await fetchApi('/api/categories')
  if (Array.isArray(data) && data.length > 0) return data
  return staticProductCategories
}

export async function getMainCategories() {
  const data = await fetchApi('/api/main-categories')
  if (Array.isArray(data) && data.length > 0) return data
  return staticProductGroups
}

export async function getPartners() {
  const data = await fetchApi('/api/partners')
  if (Array.isArray(data) && data.length > 0) return data
  return []
}

export async function getCategoryBySlug(slug) {
  const data = await fetchApi(`/api/categories/${slug}`)
  if (data?.slug) return data
  return getStaticCategoryBySlug(slug)
}

export async function getCategorySlugs() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export function getCategoriesByGroup(groupId, categories) {
  return (categories ?? [])
    .filter((category) => category.group === groupId)
}

export async function getAllArticles() {
  const data = await fetchApi('/api/articles')
  if (Array.isArray(data) && data.length > 0) return data
  return staticArticles
}

export async function getArticleBySlug(slug) {
  const data = await fetchApi(`/api/articles/${slug}`)
  if (data?.slug) return data
  return staticArticles.find((article) => article.slug === slug) ?? null
}

export async function getArticleSlugs() {
  const articles = await getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function getBlogCategories() {
  const data = await fetchApi('/api/blog-categories')
  if (Array.isArray(data) && data.length > 0) {
    return [{ id: 'all', label: 'Tous' }, ...data]
  }
  return [{ id: 'all', label: 'Tous' }]
}

export function getArticlesForProduct(productSlug, articles) {
  return (articles ?? []).filter((article) => article.relatedProductSlugs?.includes(productSlug))
}

export function getCategoriesForSlugs(slugs, categories) {
  return slugs.map((slug) => categories?.find((category) => category.slug === slug)).filter(Boolean)
}

export function getRelatedArticles(article, articles) {
  return (articles ?? [])
    .filter((item) => item.id !== article.id && item.category === article.category)
    .slice(0, 3)
}

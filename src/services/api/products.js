import { apiFetch } from './client'

/** GET /api/categories — future Laravel endpoint */
export function fetchCategories(options) {
  return apiFetch('/api/categories', { cache: 'no-store', ...options })
}

/** GET /api/categories/{slug} — future Laravel endpoint */
export function fetchCategoryBySlug(slug, options) {
  return apiFetch(`/api/categories/${slug}`, { cache: 'no-store', ...options })
}

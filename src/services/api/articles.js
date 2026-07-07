import { apiFetch } from './client'

/** GET /api/articles — future Laravel endpoint */
export function fetchArticles(options) {
  return apiFetch('/api/articles', { cache: 'no-store', ...options })
}

/** GET /api/articles/{slug} — future Laravel endpoint */
export function fetchArticleBySlug(slug, options) {
  return apiFetch(`/api/articles/${slug}`, { cache: 'no-store', ...options })
}

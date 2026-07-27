const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'en', 'au', 'aux',
  'pour', 'par', 'avec', 'sur', 'dans', 'ce', 'cette', 'ces', 'qui', 'que',
  'est', 'sont', 'a', 'à', 'ou', 'où', 'se', 'sa', 'son', 'ses', 'leur', 'leurs',
  'nos', 'vos', 'notre', 'votre', 'tout', 'tous', 'toute', 'toutes', 'plus',
  'moins', 'très', 'bien', 'comment', 'pourquoi', 'quoi', 'dont', 'comme',
  'the', 'and', 'or', 'of', 'in', 'to', 'a', 'an', 'is', 'are', 'for', 'with',
])

const MAX_SLUG_LENGTH = 60

export function generateSlug(text) {
  if (!text) return ''
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractKeywords(text, maxWords = 4) {
  if (!text) return []
  const words = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !FRENCH_STOP_WORDS.has(w))

  const seen = new Set()
  const unique = []
  for (const word of words) {
    if (!seen.has(word)) {
      seen.add(word)
      unique.push(word)
    }
    if (unique.length >= maxWords) break
  }
  return unique
}

function truncateSlug(slug, maxLength = MAX_SLUG_LENGTH) {
  if (slug.length <= maxLength) return slug
  const truncated = slug.slice(0, maxLength)
  const lastDash = truncated.lastIndexOf('-')
  return lastDash > 20 ? truncated.slice(0, lastDash) : truncated.replace(/-$/, '')
}

export function generateSeoSlug({ title, excerpt, categoryLabel }) {
  const titleSlug = generateSlug(title)
  if (!titleSlug) return ''

  const titleKeywords = extractKeywords(title, 5)
  const excerptKeywords = extractKeywords(excerpt, 3)
  const categoryKeyword = categoryLabel ? generateSlug(categoryLabel) : ''

  const parts = [...titleKeywords]
  for (const kw of excerptKeywords) {
    if (!parts.includes(kw)) parts.push(kw)
  }

  let slug = parts.length ? parts.join('-') : titleSlug

  if (categoryKeyword && slug.length < 35 && !slug.includes(categoryKeyword)) {
    slug = `${categoryKeyword}-${slug}`
  }

  return truncateSlug(slug)
}

export function ensureUniqueSlug(baseSlug, existingSlugs = []) {
  const normalized = generateSlug(baseSlug)
  if (!normalized) return ''
  if (!existingSlugs.includes(normalized)) return normalized

  let counter = 2
  while (existingSlugs.includes(`${normalized}-${counter}`)) {
    counter += 1
  }
  return `${normalized}-${counter}`
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? ''

/**
 * Rewrites Laravel storage URLs to same-origin proxy paths for next/image.
 * http://localhost:8000/storage/foo -> /media/foo
 */
export function resolveMediaUrl(src) {
  if (!src || typeof src !== 'string') return src

  if (src.startsWith('/') && !src.startsWith('//')) return src

  if (API_BASE) {
    const storagePrefix = `${API_BASE}/storage/`
    if (src.startsWith(storagePrefix)) {
      return `/media/${src.slice(storagePrefix.length)}`
    }
  }

  try {
    const url = new URL(src)
    if (url.pathname.startsWith('/storage/')) {
      return `/media/${url.pathname.slice('/storage/'.length)}`
    }
  } catch {
    return src
  }

  return src
}

export function isExternalMediaUrl(src) {
  return typeof src === 'string' && /^https?:\/\//i.test(src)
}

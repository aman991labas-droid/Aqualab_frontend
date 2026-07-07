/**
 * Laravel REST API client.
 * Requires NEXT_PUBLIC_API_URL — not configured until backend is ready.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export function isApiConfigured() {
  return Boolean(BASE_URL)
}

function buildUrl(path) {
  return `${BASE_URL}${path}`
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

async function handleResponse(response) {
  const data = await parseResponse(response)

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && data.message) ||
      `API request failed: ${response.status} ${response.statusText}`

    throw new Error(message)
  }

  return data
}

/**
 * @param {string} path - API path (e.g. "/api/categories")
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  if (!BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. Laravel API is not available yet.',
    )
  }

  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  return handleResponse(response)
}

/**
 * Multipart upload for file fields (e.g. CV on /api/applications).
 * Do not set Content-Type — the browser adds the boundary.
 *
 * @param {string} path
 * @param {FormData} formData
 * @param {RequestInit} [options]
 */
export async function apiUpload(path, formData, options = {}) {
  if (!BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. Laravel API is not available yet.',
    )
  }

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  })

  return handleResponse(response)
}


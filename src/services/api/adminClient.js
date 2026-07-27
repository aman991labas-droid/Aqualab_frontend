import { isApiConfigured, apiFetch } from './client'

const STORAGE_KEY = 'admin_auth'

export function getAdminSession() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAdminSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY)
}

const GET_CACHE = new Map()
const CACHE_TTL_MS = 60000 // 60 seconds

export async function adminFetch(path, options = {}) {
  const session = getAdminSession()
  const method = options.method || 'GET'
  const isGet = method === 'GET'

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  if (isGet) {
    const cached = GET_CACHE.get(path)
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return cached.data
    }
  } else {
    // If it's a mutation (POST, PATCH, DELETE), clear the cache
    // so subsequent GETs fetch fresh data
    GET_CACHE.clear()
  }

  const result = await apiFetch(path, { ...options, headers })
  const responseData = result?.data ?? result

  if (isGet) {
    GET_CACHE.set(path, {
      data: responseData,
      time: Date.now()
    })
  }

  return responseData
}

export async function adminFetchFull(path, options = {}) {
  const session = getAdminSession()
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  return apiFetch(path, { ...options, headers })
}

export function useApiBackend() {
  return isApiConfigured()
}

export function parseApplicationId(id) {
  if (typeof id === 'number') return id
  return String(id).replace(/^app-/, '')
}

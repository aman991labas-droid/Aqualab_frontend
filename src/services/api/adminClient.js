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

export async function adminFetch(path, options = {}) {
  const session = getAdminSession()
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  }

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  const result = await apiFetch(path, { ...options, headers })
  return result?.data ?? result
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

import { apiFetch } from './client'

/** POST /api/auth/login — future Laravel endpoint */
export function login(credentials) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

/** POST /api/auth/logout — future Laravel endpoint */
export function logout() {
  return apiFetch('/api/auth/logout', { method: 'POST' })
}

/** GET /api/auth/user — future Laravel endpoint */
export function fetchCurrentUser() {
  return apiFetch('/api/auth/user')
}

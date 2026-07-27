import {
  adminFetch,
  clearAdminSession,
  getAdminSession,
  parseApplicationId,
  setAdminSession,
  useApiBackend,
} from '@/services/api/adminClient'
import { login as apiLogin } from '@/services/api/auth'
import { delay } from './mockUtils'

const STORAGE_KEY = 'admin_auth'

export const authService = {
  async login({ email, password, remember }) {
    if (!email || !password) throw new Error('Email et mot de passe requis.')
    if (!email.includes('@')) throw new Error('Email invalide.')

    if (useApiBackend()) {
      const result = await apiLogin({ email, password })
      const payload = {
        token: result.token,
        user: result.user,
        remember,
        loggedAt: new Date().toISOString(),
      }
      setAdminSession(payload)
      return payload
    }

    await delay(700)
    const user = { id: 'admin-1', name: 'Admin Aqualab', email }
    const payload = { token: 'mock-jwt-token', user, remember, loggedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return payload
  },

  logout() {
    if (useApiBackend()) {
      const session = getAdminSession()
      if (session?.token) {
        adminFetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      }
    }
    clearAdminSession()
  },

  getSession() {
    return getAdminSession()
  },
}

'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/admin/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    setSession(authService.getSession())
    setInitializing(false)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthenticated: !!session?.token,
      initializing,
      async login(values) {
        const next = await authService.login(values)
        setSession(next)
        return next
      },
      logout() {
        authService.logout()
        setSession(null)
      },
      async forgotPassword(email) {
        return authService.forgotPassword(email)
      },
    }),
    [session, initializing]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/admin/context/AuthContext'
import LoadingSpinner from '@/admin/components/ui/LoadingSpinner'
import AdminLayout from '@/admin/components/layout/AdminLayout'

export default function ProtectedAdminLayout({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [initializing, isAuthenticated, router, pathname])

  if (initializing) {
    return <LoadingSpinner fullPage label="Chargement de la session..." />
  }

  if (!isAuthenticated) {
    return <LoadingSpinner fullPage label="Redirection..." />
  }

  return <AdminLayout>{children}</AdminLayout>
}

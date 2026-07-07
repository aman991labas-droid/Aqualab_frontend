'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/admin/components/layout/Sidebar'
import AdminNavbar from '@/admin/components/layout/AdminNavbar'
import AdminBreadcrumb from '@/admin/components/layout/AdminBreadcrumb'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(window.innerWidth > 1024)
    const onResize = () => setSidebarOpen(window.innerWidth > 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminNavbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <AdminBreadcrumb />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}

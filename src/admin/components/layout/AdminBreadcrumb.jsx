'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminBreadcrumb() {
  const pathname = usePathname()
  const chunks = pathname.split('/').filter(Boolean)

  return (
    <div className="admin-breadcrumb">
      <Link href="/admin/dashboard">Admin</Link>
      {chunks.slice(1).map((part, idx) => {
        const to = `/${chunks.slice(0, idx + 2).join('/')}`
        return (
          <span key={to}>
            <span>/</span>
            <Link href={to}>{part}</Link>
          </span>
        )
      })}
    </div>
  )
}

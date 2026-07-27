'use client'

import { Bell, Menu } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useAuth } from '@/admin/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.replace('/admin/login')
  }

  return (
    <header className="admin-topbar">
      <button type="button" className="admin-icon-btn" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <Menu size={18} />
      </button>
      <div className="admin-topbar__right">
        <ThemeToggle />
        {/* <button className="admin-icon-btn" aria-label="Notifications">
          <Bell size={18} />
        </button> */}
        <div className="admin-profile">
          <button type="button" className="admin-profile__btn" onClick={() => setOpen((v) => !v)}>
            {user?.name || 'Admin'}
          </button>
          {open && (
            <div className="admin-profile__dropdown">
              <p>{user?.email}</p>
              <button type="button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


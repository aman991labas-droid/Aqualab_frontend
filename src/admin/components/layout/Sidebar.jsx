'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Shapes, Boxes, Layers, Newspaper, BriefcaseBusiness, Mail, MessageSquare, LogOut, X, Handshake, Home } from 'lucide-react'
import { useAuth } from '@/admin/context/AuthContext'
import { isNavLinkActive } from '@/lib/nav-active'
import "./Sidebar.css"

const links = [
  { href: '/', label: 'acceuil', icon: Home },
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Catégories blog', icon: Shapes },
  { href: '/admin/main-categories', label: 'Catégories principales', icon: Layers },
  { href: '/admin/product-categories', label: 'Catégories produits', icon: Layers },
  { href: '/admin/partners', label: 'Partenaires exclusifs', icon: Handshake },
  { href: '/admin/products', label: 'Produits', icon: Boxes },
  { href: '/admin/news', label: 'Actualites', icon: Newspaper },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/contact', label: 'Messages contact', icon: MessageSquare },
  { href: '/admin/applications', label: 'Candidatures', icon: BriefcaseBusiness },
]

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace('/admin/login')
  }

  return (
    <>
      {open && <button type="button" className="admin-sidebar-backdrop" onClick={onClose} aria-label="Fermer le menu" />}
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
        <div className="admin-sidebar__head">
          <strong>Aqualab Admin</strong>
          <button type="button" onClick={onClose} className="admin-sidebar__close">
            <X size={18} />
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = isNavLinkActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                className={`admin-sidebar__link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth <= 1024 && onClose()}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
        <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={16} />
          Deconnexion
        </button>
      </aside>
    </>
  )
}

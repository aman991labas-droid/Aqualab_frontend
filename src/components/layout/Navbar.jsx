'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { mainNavLinks } from '@/lib/navigation'
import { isNavLinkActive } from '@/lib/nav-active'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const prevPath = useRef(pathname)

    useEffect(() => {
        if (prevPath.current !== pathname) {
            setMobileOpen(false)
            prevPath.current = pathname
        }
    }, [pathname])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    return (
        <>
            <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
                <div className="navbar__inner container">
                    <Link href="/" className="navbar__logo" aria-label="Aqualab Technologie – Accueil">
                        <Image
                            src="/images/logo.png"
                            alt="Aqualab Technologie"
                            className="navbar__logo-img"
                            width={160}
                            height={48}
                            priority
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling.style.display = 'flex'
                            }}
                        />
                        <span className="navbar__logo-fallback" style={{ display: 'none' }}>
                            <span className="navbar__logo-aq">AQ</span>
                            <span className="navbar__logo-text">
                                <span className="navbar__logo-brand">AQUALAB</span>
                                <span className="navbar__logo-sub">TECHNOLOGIE</span>
                            </span>
                        </span>
                    </Link>

                    <nav className="navbar__nav" role="navigation" aria-label="Navigation principale">
                        <ul className="navbar__list">
                            {mainNavLinks.map(link => {
                                const end = link.path === '/'
                                const isActive = isNavLinkActive(pathname, link.path, end)
                                return (
                                    <li key={link.path}>
                                        <Link
                                            href={link.path}
                                            className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        <ThemeToggle className="navbar__theme" />
                        <Link href="/contact" className="btn btn-primary navbar__cta">
                            Contact
                        </Link>
                    </nav>

                    <ThemeToggle className="navbar__theme navbar__theme--mobile" />
                    <button
                        type="button"
                        className="navbar__toggle"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileOpen
                                ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .2 }}>
                                    <X size={24} />
                                </motion.span>
                                : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: .2 }}>
                                    <Menu size={24} />
                                </motion.span>
                            }
                        </AnimatePresence>
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="navbar__backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.nav
                            id="mobile-menu"
                            className="navbar__mobile"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                            aria-label="Menu mobile"
                        >
                            <ul className="navbar__mobile-list">
                                {mainNavLinks.map((link, i) => {
                                    const end = link.path === '/'
                                    const isActive = isNavLinkActive(pathname, link.path, end)
                                    return (
                                        <motion.li
                                            key={link.path}
                                            initial={{ opacity: 0, x: 24 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.06 }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    )
                                })}
                                <motion.li
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + mainNavLinks.length * 0.06 }}
                                >
                                    <ThemeToggle />
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + (mainNavLinks.length + 1) * 0.06 }}
                                >
                                    <Link
                                        href="/contact"
                                        className="btn btn-primary w-full"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                </motion.li>
                            </ul>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

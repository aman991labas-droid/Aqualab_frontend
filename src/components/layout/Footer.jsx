'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Linkedin } from '@/components/ui/SocialIcons'
import { getCategoryPath } from '@/lib/products'
import { footerNavLinks } from '@/lib/navigation'
import './Footer.css'

export default function Footer({ productCategories = [] }) {
    const year = new Date().getFullYear()

    return (
        <footer className="footer" role="contentinfo">
            <div className="footer__wave" aria-hidden="true">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#1f2937" />
                </svg>
            </div>

            <div className="footer__body">
                <div className="container">
                    <div className="footer__grid">
                        <div className="footer__brand">
                            <Image
                                src="/images/logo.png"
                                alt="Aqualab Technologie"
                                className="footer__logo"
                                width={160}
                                height={48}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling.style.display = 'block'
                                }}
                            />
                            <div className="footer__logo-fallback" style={{ display: 'none' }}>
                                <span className="footer__logo-text">
                                    <span className="footer__aq">AQ</span>
                                    <span className="footer__brand-name">AQUALAB<br /><small>TECHNOLOGIE</small></span>
                                </span>
                            </div>

                            <p className="footer__desc">
                                Distribution et installation de matériels industriels, scientifiques et de laboratoire au Maroc depuis 2006.
                            </p>

                            <div className="footer__social">
                                <a
                                    href="https://www.linkedin.com/company/aqualab-technologie/"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="footer__social-link"
                                    aria-label="Aqualab Technologie sur LinkedIn"
                                >
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer__col">
                            <h3 className="footer__col-title">Navigation</h3>
                            <ul className="footer__links">
                                {footerNavLinks.map(l => (
                                    <li key={l.path}>
                                        <Link href={l.path} className="footer__link">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer__col">
                            <h3 className="footer__col-title">Nos Produits</h3>
                            <ul className="footer__links">
                                {productCategories.slice(0, 6).map(cat => (
                                    <li key={cat.slug}>
                                        <Link href={getCategoryPath(cat.slug)} className="footer__link">{cat.title}</Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/produits" className="footer__link footer__link--accent">Tout le catalogue →</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer__col">
                            <h3 className="footer__col-title">Nos Services</h3>
                            <ul className="footer__links">
                                <li><Link href="/services" className="footer__link">Installation & Mise en service</Link></li>
                                <li><Link href="/services" className="footer__link">Maintenance & SAV</Link></li>
                                <li><Link href="/services" className="footer__link">Formation produit</Link></li>
                                <li><Link href="/services" className="footer__link">Assistance technique</Link></li>
                                <li><Link href="/services" className="footer__link">Disponibilité de stock</Link></li>
                            </ul>
                        </div>

                        <div className="footer__col">
                            <h3 className="footer__col-title">Contactez-Nous</h3>
                            <address className="footer__contact">
                                <a
                                    href="https://maps.google.com/?q=409+Ambassadeur+Ben+Aicha+Roches+Noires+Casablanca"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="footer__contact-item"
                                >
                                    <MapPin size={16} className="footer__contact-icon" aria-hidden="true" />
                                    <span>409, Ambassadeur Ben Aicha,<br />Roches Noires, Casablanca – Maroc</span>
                                </a>
                                <a href="tel:+212522309650" className="footer__contact-item">
                                    <Phone size={16} className="footer__contact-icon" aria-hidden="true" />
                                    <span>05 22 30 96 50</span>
                                </a>
                                <a href="mailto:info@aqualab.ma" className="footer__contact-item">
                                    <Mail size={16} className="footer__contact-icon" aria-hidden="true" />
                                    <span>info@aqualab.ma</span>
                                </a>
                            </address>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <p className="footer__copy">
                            &copy; {year} Tous droits réservés — <strong>AQUALAB Technologie</strong>
                        </p>
                        <p className="footer__legal">
                            S.A.R.L au capital de 2M DH&nbsp;·&nbsp;Casablanca, Maroc
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

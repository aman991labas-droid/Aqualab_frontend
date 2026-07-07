'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { FadeUp } from '@/components/ui/Animations'
import './CTABanner.css'

export default function CTABanner() {
    return (
        <section className="cta-banner" aria-labelledby="cta-heading">
            <span className="cta-banner__blob cta-banner__blob--1" aria-hidden="true" />
            <span className="cta-banner__blob cta-banner__blob--2" aria-hidden="true" />

            <div className="container">
                <FadeUp>
                    <div className="cta-banner__inner">
                        <div className="cta-banner__text">
                            <h2 id="cta-heading" className="cta-banner__title">
                                Prêt à équiper votre laboratoire ?
                            </h2>
                            <p className="cta-banner__desc">
                                Contactez nos experts pour un devis personnalisé et bénéficiez de notre conseil technique gratuit.
                            </p>
                        </div>
                        <div className="cta-banner__actions">
                            <Link href="/contact" className="btn btn-primary btn-lg">
                                Demander un devis
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                            <a href="tel:+212522309650" className="btn btn-outline btn-lg cta-banner__phone">
                                <Phone size={18} aria-hidden="true" />
                                05 22 30 96 50
                            </a>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </section>
    )
}

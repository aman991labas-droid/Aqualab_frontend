'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import { getCategoryPath } from '@/lib/products'
import './ProductsHighlight.css'

function getPartnerName(partner = '') {
    return partner.split('—')[0].trim()
}

function PartnerIcon({ logo, partner }) {
    const [failed, setFailed] = useState(false)
    const initials = partner.slice(0, 2).toUpperCase() || '?'

    if (!logo || failed) {
        return <span className="product-card__partner-fallback">{initials}</span>
    }

    return (
        <AppImage
            src={logo}
            alt={partner ? `Logo ${partner}` : 'Logo partenaire'}
            className="product-card__logo"
            width={40}
            height={40}
            sizes="40px"
            onError={() => setFailed(true)}
        />
    )
}

function CategoryImage({ src, alt }) {
    const [failed, setFailed] = useState(false)

    if (!src || failed) return null

    return (
        <div className="product-card__image-wrap">
            <AppImage
                src={src}
                alt={alt}
                className="product-card__image"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setFailed(true)}
            />
        </div>
    )
}

export default function ProductsHighlight({ categories = [] }) {
    const highlighted = categories.slice(0, 6)

    if (highlighted.length === 0) return null

    return (
        <section className="products-hl section-py" aria-labelledby="products-hl-heading">
            <div className="container">
                <FadeUp>
                    <div className="text-center">
                        <span className="section-label">Gamme produits</span>
                        <h2 id="products-hl-heading" className="products-hl__title display-md">
                            Nos <span className="gradient-text">Équipements</span>
                        </h2>
                        <p className="products-hl__desc">
                            Une sélection rigoureuse de matériels de haute précision pour répondre aux exigences
                            de vos laboratoires et sites industriels.
                        </p>
                    </div>
                </FadeUp>

                <StaggerContainer className="products-hl__grid">
                    {highlighted.map((category) => {
                        const partner = getPartnerName(category.partner)

                        return (
                            <StaggerItem key={category.slug}>
                                <Link href={getCategoryPath(category.slug)} className="product-card" aria-label={`En savoir plus sur ${category.title}`}>
                                    <CategoryImage src={category.image} alt={category.title} />
                                    <div className="product-card__body">
                                        <div className="product-card__logo-wrap" aria-hidden="true">
                                            <PartnerIcon logo={category.partnerLogo} partner={partner} />
                                        </div>
                                        {!category.partnerLogo && partner ? (
                                            <span className="product-card__partner badge badge-red">{partner}</span>
                                        ) : null}
                                        <h3 className="product-card__title">{category.title}</h3>
                                        <p className="product-card__desc">{category.shortDesc ?? category.description}</p>
                                        <span className="product-card__arrow" aria-hidden="true">
                                            <ArrowRight size={18} />
                                        </span>
                                    </div>
                                </Link>
                            </StaggerItem>
                        )
                    })}
                </StaggerContainer>

                <FadeUp delay={0.3}>
                    <div className="products-hl__cta">
                        <Link href="/produits" className="btn btn-outline-dark btn-lg">
                            Voir tous nos produits
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </FadeUp>
            </div>
        </section>
    )
}

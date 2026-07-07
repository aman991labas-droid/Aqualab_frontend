'use client'

import Link from 'next/link'
import { ChevronRight, Package, Newspaper } from 'lucide-react'
import { getCategoryPath } from '@/lib/products'
import './CrossLinks.css'

export function RelatedProductLinks({ products = [] }) {
    if (!products.length) return null

    return (
        <div className="cross-links cross-links--products">
            <h3 className="cross-links__title">
                <Package size={18} aria-hidden="true" />
                Produits associés
            </h3>
            <ul className="cross-links__list">
                {products.map(cat => (
                    <li key={cat.slug}>
                        <Link href={getCategoryPath(cat.slug)} className="cross-links__item">
                            <span className="cross-links__item-text">
                                <strong>{cat.title}</strong>
                                <span>{cat.partner.split('—')[0].trim()}</span>
                            </span>
                            <ChevronRight size={16} aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function RelatedArticleLinks({ articles = [] }) {
    if (!articles.length) return null

    return (
        <div className="cross-links cross-links--articles">
            <h3 className="cross-links__title">
                <Newspaper size={18} aria-hidden="true" />
                Articles & guides
            </h3>
            <ul className="cross-links__list">
                {articles.map(article => (
                    <li key={article.slug}>
                        <Link href={`/actualites/${article.slug}`} className="cross-links__item">
                            <span className="cross-links__item-text">
                                <strong>{article.title}</strong>
                                <span>{article.readTime} min de lecture</span>
                            </span>
                            <ChevronRight size={16} aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function RelatedProductBanner({ products = [] }) {
    if (!products.length) return null

    const primary = products[0]

    return (
        <div className="cross-links-banner">
            <p className="cross-links-banner__label">Équipements mentionnés dans cet article</p>
            <div className="cross-links-banner__grid">
                {products.map(cat => (
                    <Link key={cat.slug} href={getCategoryPath(cat.slug)} className="cross-links-banner__card">
                        <span className="cross-links-banner__card-title">{cat.title}</span>
                        <span className="cross-links-banner__card-partner">{cat.partner.split('—')[0].trim()}</span>
                        <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                ))}
            </div>
            {primary && (
                <Link href={getCategoryPath(primary.slug)} className="btn btn-primary cross-links-banner__cta">
                    Voir {primary.title}
                    <ChevronRight size={16} aria-hidden="true" />
                </Link>
            )}
        </div>
    )
}

'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import CTABanner from '@/components/home/CTABanner'
import PartnerLogo from '@/components/ui/PartnerLogo'
import AppImage from '@/components/ui/AppImage'
import { PageTransition, FadeUp } from '@/components/ui/Animations'
import ProductItemCard from '@/components/products/ProductItemCard'
import { getCategoryPath, getProductGroupLabel } from '@/lib/products'
import '@/components/ui/PartnerLogo.css'
import './Products.css'

export default function ProductCategoryPage({
    category,
    allCategories,
    mainCategories = [],
    relatedArticles: relatedArticlesProp,
}) {
    const groupLabel = getProductGroupLabel(category.group, mainCategories)
    const groupCategories = (allCategories ?? []).filter((item) => item.group === category.group)
    const siblings = groupCategories.filter(c => c.slug !== category.slug)
    const relatedArticles = relatedArticlesProp ?? []
    const partnerName = category.partner.split('—')[0].trim()
    const items = category.items ?? []
    const breadcrumbs = [
        { label: 'Produits', path: '/produits' },
        { label: category.title },
    ]

    return (
        <PageTransition>
            <PageHero
                title={category.title}
                subtitle={category.shortDesc}
                tag={groupLabel}
                breadcrumbs={breadcrumbs}
            />

            <section className="products-page section-py">
                <div className="container">
                    <div className="products-panel__grid">
                        <aside className="products-sidebar" aria-label={`Autres catégories ${groupLabel}`}>
                            <p className="products-sidebar__heading">{groupLabel}</p>
                            <ul>
                                {groupCategories.map(cat => (
                                    <li key={cat.slug}>
                                        <Link
                                            href={getCategoryPath(cat.slug)}
                                            className={`products-sidebar__item ${cat.slug === category.slug ? 'products-sidebar__item--active' : ''}`}
                                            aria-current={cat.slug === category.slug ? 'page' : undefined}
                                        >
                                            <ChevronRight size={16} aria-hidden="true" />
                                            {cat.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        <FadeUp>
                            <article className="products-detail">
                                {category.image && (
                                    <AppImage
                                        src={category.image}
                                        alt={category.title}
                                        className="products-detail__hero-img"
                                        width={1280}
                                        height={720}
                                        sizes="(max-width: 768px) 100vw, 800px"
                                        priority
                                        hideOnError
                                        fallbackSrc={null}
                                    />
                                )}

                                <div className="products-detail__header">
                                    <div className="products-detail__partner-row">
                                        <PartnerLogo src={category.partnerLogo} name={partnerName} size="md" />
                                        <span className="products-detail__partner-name">{category.partner}</span>
                                    </div>
                                    <h2 className="products-detail__title">{category.title}</h2>
                                    <div className="divider" />
                                </div>

                                <div className="products-detail__intro">
                                    {category.description.split('\n\n').map((para, i) => (
                                        <p key={i}>{para.trim()}</p>
                                    ))}
                                </div>

                                <h3 className="products-detail__list-title">Équipements disponibles</h3>
                                <ul
                                    className="products-detail__list products-detail__list--grid"
                                    aria-label={`Produits ${category.title}`}
                                >
                                    {items.map((item, index) => (
                                        <ProductItemCard
                                            key={typeof item === 'string' ? item : item.name || index}
                                            item={item}
                                        />
                                    ))}
                                </ul>

                                <div className="products-detail__footer">
                                    <p>Demandez un devis personnalisé pour {category.title}.</p>
                                    <Link href="/contact" className="btn btn-primary">Demander un devis</Link>
                                </div>
                            </article>
                        </FadeUp>
                    </div>

                    {siblings.length > 0 && (
                        <FadeUp delay={0.15}>
                            <div className="products-related">
                                <h2 className="products-related__title">Autres catégories {groupLabel.toLowerCase()}</h2>
                                <div className="products-related__grid">
                                    {siblings.slice(0, 4).map(cat => (
                                        <Link
                                            key={cat.slug}
                                            href={getCategoryPath(cat.slug)}
                                            className="products-related__card"
                                        >
                                            <span className="products-related__card-title">{cat.title}</span>
                                            <span className="products-related__card-desc">{cat.shortDesc}</span>
                                            <ChevronRight size={16} aria-hidden="true" />
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/produits" className="products-related__all">
                                    Voir tout le catalogue →
                                </Link>
                            </div>
                        </FadeUp>
                    )}

                    {relatedArticles.length > 0 && (
                        <FadeUp delay={0.2}>
                            <div className="products-articles">
                                <h2 className="products-articles__title">Guides & articles sur {category.title}</h2>
                                <p className="products-articles__desc">
                                    Approfondissez votre connaissance avec nos articles d'expertise.
                                </p>
                                <div className="products-articles__grid">
                                    {relatedArticles.map(article => (
                                        <Link
                                            key={article.slug}
                                            href={`/actualites/${article.slug}`}
                                            className="products-articles__card"
                                        >
                                            <span className="products-articles__card-title">{article.title}</span>
                                            <span className="products-articles__card-excerpt">{article.excerpt}</span>
                                            <span className="products-articles__card-meta">
                                                Lire l'article · {article.readTime} min
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/actualites" className="products-articles__all">
                                    Voir tous les articles →
                                </Link>
                            </div>
                        </FadeUp>
                    )}
                </div>
            </section>

            <CTABanner />
        </PageTransition>
    )
}

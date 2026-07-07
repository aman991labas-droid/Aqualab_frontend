'use client'

import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Share2 } from 'lucide-react'
import { Facebook, Twitter, Linkedin } from '@/components/ui/SocialIcons'
import { motion } from 'framer-motion'
import { buildCanonicalPath } from '@/data/seo'
import { renderArticleContent } from '@/lib/article-content'
import { RelatedProductLinks, RelatedProductBanner } from '@/components/ui/CrossLinks'
import '@/components/ui/CrossLinks.css'
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AppImage from '@/components/ui/AppImage'
import './Actualites.css'
import './ArticleDetail.css'

export default function ArticleDetailPage({
    article,
    relatedArticles: relatedArticlesProp,
    relatedProducts: relatedProductsProp,
    categories: categoriesProp,
}) {
    const categories = categoriesProp ?? []
    const date = new Date(article.date).toLocaleDateString('fr-MA', {
        year: 'numeric', month: 'long', day: 'numeric',
    })
    const categoryLabel = categories.find(c => c.id === article.category)?.label

    const related = relatedArticlesProp ?? []
    const relatedProducts = relatedProductsProp ?? []

    const shareUrl = buildCanonicalPath(`/actualites/${article.slug}`)
    const shareText = encodeURIComponent(article.title)
    const breadcrumbs = [
        { label: 'Actualités', path: '/actualites' },
        { label: article.title },
    ]

    return (
        <PageTransition>
            <div className="article-hero">
                <AppImage
                    src={article.image}
                    alt={article.title}
                    className="article-hero__img"
                    fill
                    sizes="100vw"
                    priority
                />
                <div className="article-hero__overlay" />
                <div className="container article-hero__inner">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Breadcrumb items={breadcrumbs} />
                        <div className="article-hero__meta">
                            <span className="badge badge-red">{categoryLabel}</span>
                            <span className="article-hero__read"><Clock size={13} /> {article.readTime} min</span>
                            <time dateTime={article.date} className="article-hero__date"><Calendar size={13} /> {date}</time>
                        </div>
                        <h1 className="article-hero__title">{article.title}</h1>
                        <div className="article-hero__author">
                            <AppImage
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="article-hero__avatar"
                                width={40}
                                height={40}
                                sizes="40px"
                                priority
                                hideOnError
                                fallbackSrc={null}
                            />
                            <span>Par <strong>{article.author.name}</strong></span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <section className="article-body-section">
                <div className="container">
                    <div className="article-layout">
                        <FadeUp>
                            <article className="article-content">
                                <p className="article-lead">{article.excerpt}</p>

                                <div
                                    className="article-prose"
                                    dangerouslySetInnerHTML={{
                                        __html: renderArticleContent(article.content),
                                    }}
                                />

                                <RelatedProductBanner products={relatedProducts} />

                                <div className="article-share" aria-label="Partager cet article">
                                    <span className="article-share__label"><Share2 size={16} /> Partager</span>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank" rel="noreferrer"
                                        className="article-share__btn article-share__btn--linkedin"
                                        aria-label="Partager sur LinkedIn"
                                    >
                                        <Linkedin size={16} />
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank" rel="noreferrer"
                                        className="article-share__btn article-share__btn--twitter"
                                        aria-label="Partager sur Twitter/X"
                                    >
                                        <Twitter size={16} />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank" rel="noreferrer"
                                        className="article-share__btn article-share__btn--facebook"
                                        aria-label="Partager sur Facebook"
                                    >
                                        <Facebook size={16} />
                                    </a>
                                </div>
                            </article>
                        </FadeUp>

                        <aside className="article-sidebar" aria-label="Informations complémentaires">
                            <FadeUp delay={0.15}>
                                <div className="article-sidebar-card">
                                    <h3 className="blog-widget__title">À propos de l'auteur</h3>
                                    <div className="article-author-card">
                                        <AppImage
                                            src={article.author.avatar}
                                            alt={article.author.name}
                                            className="article-author-card__avatar"
                                            width={64}
                                            height={64}
                                            sizes="64px"
                                            hideOnError
                                            fallbackSrc={null}
                                        />
                                        <div>
                                            <strong>{article.author.name}</strong>
                                            <p>Expert en équipements scientifiques et industriels chez Aqualab Technologie.</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeUp>

                            {relatedProducts.length > 0 && (
                                <FadeUp delay={0.2}>
                                    <div className="article-sidebar-card">
                                        <RelatedProductLinks products={relatedProducts} />
                                    </div>
                                </FadeUp>
                            )}

                            <FadeUp delay={0.25}>
                                <div className="article-sidebar-card">
                                    <h3 className="blog-widget__title">Articles liés</h3>
                                    {related.length ? (
                                        <ul className="article-related-list">
                                            {related.map(r => (
                                                <li key={r.id}>
                                                    <Link href={`/actualites/${r.slug}`} className="article-related-link">
                                                        <ChevronRight size={14} aria-hidden="true" />
                                                        {r.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="article-sidebar-empty">Pas d'autres articles dans cette catégorie.</p>
                                    )}
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.35}>
                                <div className="article-sidebar-cta">
                                    <p>Besoin d'un équipement ou d'un devis ?</p>
                                    <Link href="/contact" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                                        Demander un devis
                                    </Link>
                                </div>
                            </FadeUp>
                        </aside>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="related-section section-py">
                    <div className="container">
                        <FadeUp>
                            <h2 className="related-section__title">Articles similaires</h2>
                        </FadeUp>
                        <StaggerContainer className="related-grid">
                            {related.map(r => {
                                const rDate = new Date(r.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric' })
                                return (
                                    <StaggerItem key={r.id}>
                                        <article className="article-card">
                                            <Link href={`/actualites/${r.slug}`} className="article-card__img-wrap">
                                                <AppImage
                                                    src={r.image}
                                                    alt={r.title}
                                                    className="article-card__img"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 360px"
                                                />
                                                <span className="article-card__category badge badge-red">{categories.find(c => c.id === r.category)?.label}</span>
                                            </Link>
                                            <div className="article-card__body">
                                                <div className="article-card__meta">
                                                    <span className="article-card__date"><Calendar size={13} /><time dateTime={r.date}>{rDate}</time></span>
                                                    <span className="article-card__read"><Clock size={13} />{r.readTime} min</span>
                                                </div>
                                                <h3 className="article-card__title"><Link href={`/actualites/${r.slug}`}>{r.title}</Link></h3>
                                                <p className="article-card__excerpt">{r.excerpt}</p>
                                                <div className="article-card__footer">
                                                    <span className="article-card__author">{r.author.name}</span>
                                                    <Link href={`/actualites/${r.slug}`} className="article-card__cta">Lire <ChevronRight size={14} /></Link>
                                                </div>
                                            </div>
                                        </article>
                                    </StaggerItem>
                                )
                            })}
                        </StaggerContainer>
                    </div>
                </section>
            )}
        </PageTransition>
    )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Calendar, Clock, ChevronRight, Tag, Mail } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import AppImage from '@/components/ui/AppImage'
import NewsletterForm from '@/components/newsletter/NewsletterForm'
import './Actualites.css'

const PER_PAGE = 4
const breadcrumbs = [{ label: 'Actualités' }]

function ArticleCard({ article, categories }) {
    const date = new Date(article.date).toLocaleDateString('fr-MA', {
        year: 'numeric', month: 'long', day: 'numeric',
    })

    return (
        <StaggerItem>
            <article className="article-card" aria-label={article.title}>
                <Link href={`/actualites/${article.slug}`} className="article-card__img-wrap" tabIndex={-1} aria-hidden="true">
                    <AppImage
                        src={article.image}
                        alt={article.title}
                        className="article-card__img"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <span className="article-card__category badge badge-red">{
                        categories.find(c => c.id === article.category)?.label
                    }</span>
                </Link>
                <div className="article-card__body">
                    <div className="article-card__meta">
                        <span className="article-card__date">
                            <Calendar size={13} aria-hidden="true" />
                            <time dateTime={article.date}>{date}</time>
                        </span>
                        <span className="article-card__read">
                            <Clock size={13} aria-hidden="true" />
                            {article.readTime} min de lecture
                        </span>
                    </div>
                    <h2 className="article-card__title">
                        <Link href={`/actualites/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="article-card__excerpt">{article.excerpt}</p>
                    <div className="article-card__footer">
                        <div className="article-card__author">
                            <AppImage
                                src={article.author.avatar}
                                alt={article.author.name}
                                width={32}
                                height={32}
                                className="article-card__avatar"
                                sizes="32px"
                                hideOnError
                                fallbackSrc={null}
                            />
                            <span>{article.author.name}</span>
                        </div>
                        <Link href={`/actualites/${article.slug}`} className="article-card__cta">
                            Lire l'article <ChevronRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </article>
        </StaggerItem>
    )
}

export default function ActualitesPage({
    articles = [],
    categories = [],
}) {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        return articles.filter(a => {
            const matchesCat = category === 'all' || a.category === category
            const q = search.toLowerCase()
            const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
            return matchesCat && matchesSearch
        })
    }, [articles, search, category])

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const featured = articles.find(a => a.featured)

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1) }
    const handleCategory = (id) => { setCategory(id); setPage(1) }

    const featDate = featured ? new Date(featured.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

    return (
        <PageTransition>
            <PageHero
                title="Actualités & Blog"
                subtitle="Expertise, guides et innovations dans le domaine des équipements scientifiques et industriels."
                tag="Notre blog"
                breadcrumbs={breadcrumbs}
            />

            <section className="actualites section-py">
                <div className="container">
                    {featured && (
                        <FadeUp>
                            <article className="featured-article" aria-label={`Article mis en avant: ${featured.title}`}>
                                <Link href={`/actualites/${featured.slug}`} className="featured-article__img-wrap">
                                    <AppImage
                                        src={featured.image}
                                        alt={featured.title}
                                        className="featured-article__img"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                        priority
                                    />
                                </Link>
                                <div className="featured-article__body">
                                    <div className="featured-article__top">
                                        <span className="badge badge-red">{categories.find(c => c.id === featured.category)?.label}</span>
                                        <span className="featured-article__pin">À la une</span>
                                    </div>
                                    <h2 className="featured-article__title">
                                        <Link href={`/actualites/${featured.slug}`}>{featured.title}</Link>
                                    </h2>
                                    <p className="featured-article__excerpt">{featured.excerpt}</p>
                                    <div className="featured-article__meta">
                                        <span><Calendar size={14} aria-hidden="true" /><time dateTime={featured.date}>{featDate}</time></span>
                                        <span><Clock size={14} aria-hidden="true" />{featured.readTime} min de lecture</span>
                                    </div>
                                    <Link href={`/actualites/${featured.slug}`} className="btn btn-primary">
                                        Lire l'article <ChevronRight size={16} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        </FadeUp>
                    )}

                    <div className="actualites__layout">
                        <div className="actualites__main">
                            <FadeUp>
                                <div className="actualites__search-wrap" role="search">
                                    <Search size={18} className="actualites__search-icon" aria-hidden="true" />
                                    <input
                                        type="search"
                                        placeholder="Rechercher un article..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="actualites__search"
                                        aria-label="Rechercher dans les articles"
                                    />
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.1}>
                                <div className="actualites__cats" role="group" aria-label="Filtrer par catégorie">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`actualites__cat ${category === cat.id ? 'actualites__cat--active' : ''}`}
                                            onClick={() => handleCategory(cat.id)}
                                            aria-pressed={category === cat.id}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </FadeUp>

                            {paged.length > 0 ? (
                                <StaggerContainer className="actualites__grid">
                                    {paged.map(a => <ArticleCard key={a.id} article={a} categories={categories} />)}
                                </StaggerContainer>
                            ) : (
                                <FadeUp>
                                    <div className="actualites__empty" role="status">
                                        <Search size={48} aria-hidden="true" />
                                        <p>Aucun article trouvé pour votre recherche.</p>
                                        <button type="button" className="btn btn-outline-dark" onClick={() => { setSearch(''); setCategory('all') }}>
                                            Effacer les filtres
                                        </button>
                                    </div>
                                </FadeUp>
                            )}

                            {totalPages > 1 && (
                                <div className="actualites__pagination" role="navigation" aria-label="Pagination">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`actualites__page ${page === i + 1 ? 'actualites__page--active' : ''}`}
                                            onClick={() => setPage(i + 1)}
                                            aria-current={page === i + 1 ? 'page' : undefined}
                                            aria-label={`Page ${i + 1}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <aside className="actualites__sidebar" aria-label="Widgets blog">
                            <FadeUp delay={0.2}>
                                <div className="blog-widget">
                                    <h3 className="blog-widget__title">Articles récents</h3>
                                    <ul className="blog-widget__list">
                                        {articles.slice(0, 4).map(a => (
                                            <li key={a.id} className="blog-widget__item">
                                                <Link href={`/actualites/${a.slug}`} className="blog-widget__link">
                                                    <span className="blog-widget__dot" aria-hidden="true" />
                                                    {a.title}
                                                </Link>
                                                <time dateTime={a.date} className="blog-widget__date">
                                                    {new Date(a.date).toLocaleDateString('fr-MA', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </time>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.3}>
                                <div className="blog-widget">
                                    <h3 className="blog-widget__title">Catégories</h3>
                                    <ul className="blog-widget__cats">
                                        {categories.filter(c => c.id !== 'all').map(cat => {
                                            const count = articles.filter(a => a.category === cat.id).length
                                            return (
                                                <li key={cat.id}>
                                                    <button
                                                        type="button"
                                                        className="blog-widget__cat-btn"
                                                        onClick={() => { handleCategory(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                                    >
                                                        <Tag size={14} aria-hidden="true" />
                                                        {cat.label}
                                                        <span className="blog-widget__count">{count}</span>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </FadeUp>

                            <FadeUp delay={0.4}>
                                <div className="blog-widget blog-widget--newsletter">
                                    <Mail size={28} className="blog-newsletter__icon" aria-hidden="true" />
                                    <h3 className="blog-widget__title">Newsletter</h3>
                                    <p>Recevez nos dernières actualités directement dans votre boîte mail.</p>
                                    <NewsletterForm />
                                </div>
                            </FadeUp>
                        </aside>
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}

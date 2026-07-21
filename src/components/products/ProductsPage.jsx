'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, PackageOpen } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import CTABanner from '@/components/home/CTABanner'
import PartnerLogo from '@/components/ui/PartnerLogo'
import AppImage from '@/components/ui/AppImage'
import { PageTransition, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import { getCategoryPath, normalizeProductItem } from '@/lib/products'
import '@/components/ui/PartnerLogo.css'
import './Products.css'

const PER_PAGE = 6
const DROPDOWN_THRESHOLD = 8

function getGroupLabel(groupId, mainCategories) {
    return mainCategories.find((group) => group.id === groupId)?.label ?? groupId
}

const breadcrumbs = [{ label: 'Produits' }]

function CatalogCard({ cat, showGroupBadge, groupLabel }) {
    return (
        <StaggerItem>
            <Link href={getCategoryPath(cat.slug)} className="products-catalog-card">
                {cat.image ? (
                    <AppImage
                        src={cat.image}
                        alt={cat.title}
                        className="products-catalog-card__thumb"
                        width={640}
                        height={400}
                        sizes="(max-width: 768px) 100vw, 320px"
                        hideOnError
                        fallbackSrc={null}
                    />
                ) : null}

                <div className="products-catalog-card__top">
                    {showGroupBadge && groupLabel ? (
                        <span className="badge badge-outline products-catalog-card__group">
                            {groupLabel}
                        </span>
                    ) : null}
                    <PartnerLogo
                        src={cat.partnerLogo}
                        name={cat.partner?.split('—')[0]?.trim() ?? ""}
                        size="sm"
                    />
                    {cat.partner && (
                        <span className="badge badge-red products-catalog-card__partner">
                            {cat.partner?.split('—')[0]?.trim() ?? ""}
                        </span>
                    )}
                </div>
                <h3 className="products-catalog-card__title">{cat.title}</h3>
                <p className="products-catalog-card__desc">{cat.shortDesc}</p>
                <ul className="products-catalog-card__items" aria-label={`Exemples ${cat.title}`}>
                    {cat.items.slice(0, 3).map((item) => {
                        const { name } = normalizeProductItem(item)
                        return <li key={name}>{name}</li>
                    })}
                    {cat.items.length > 3 && (
                        <li className="products-catalog-card__more">
                            +{cat.items.length - 3} autres équipements
                        </li>
                    )}
                </ul>
                <span className="products-catalog-card__cta">
                    Voir la catégorie
                    <ChevronRight size={16} aria-hidden="true" />
                </span>
            </Link>
        </StaggerItem>
    )
}

export default function ProductsPage({ categories: categoriesProp = [], mainCategories = [] }) {
    const [selectedGroup, setSelectedGroup] = useState('all')
    const [page, setPage] = useState(1)

    const categoryTabs = useMemo(
        () => [{ id: 'all', label: 'Tous' }, ...mainCategories],
        [mainCategories],
    )

    const tabsWithCounts = useMemo(
        () =>
            categoryTabs.map((tab) => ({
                ...tab,
                count:
                    tab.id === 'all'
                        ? categoriesProp.length
                        : categoriesProp.filter((c) => c.group === tab.id).length,
            })),
        [categoryTabs, categoriesProp],
    )

    const useDropdown = tabsWithCounts.length > DROPDOWN_THRESHOLD

    const filtered = useMemo(() => {
        if (selectedGroup === 'all') return categoriesProp
        return categoriesProp.filter((category) => category.group === selectedGroup)
    }, [categoriesProp, selectedGroup])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const activeGroup = mainCategories.find((group) => group.id === selectedGroup)

    const handleGroupChange = (groupId) => {
        setSelectedGroup(groupId)
        setPage(1)
    }

    return (
        <PageTransition>
            <PageHero
                title="Nos Produits"
                subtitle="Une gamme rigoureusement sélectionnée d'équipements scientifiques et industriels de haute précision."
                tag="Catalogue produits"
                breadcrumbs={breadcrumbs}
            />

            <section className="products-page section-py">
                <div className="container">
                    {tabsWithCounts.length > 1 && (
                        <FadeUp>
                            {useDropdown ? (
                                <div className="products-filter">
                                    <label htmlFor="products-category-select" className="products-filter__label">
                                        Catégorie principale
                                    </label>
                                    <select
                                        id="products-category-select"
                                        className="products-filter__select"
                                        value={selectedGroup}
                                        onChange={(e) => handleGroupChange(e.target.value)}
                                    >
                                        {tabsWithCounts.map((tab) => (
                                            <option key={tab.id} value={tab.id}>
                                                {tab.label} ({tab.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div
                                    className="products-filter__pills"
                                    role="tablist"
                                    aria-label="Filtrer par catégorie principale"
                                >
                                    {tabsWithCounts.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={selectedGroup === tab.id}
                                            className={`products-filter__pill ${selectedGroup === tab.id ? 'products-filter__pill--active' : ''}`}
                                            onClick={() => handleGroupChange(tab.id)}
                                        >
                                            {tab.label}
                                            <span className="products-filter__count">{tab.count}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </FadeUp>
                    )}

                    {selectedGroup !== 'all' && activeGroup && (
                        <FadeUp delay={0.05}>
                            <div className="products-catalog-group__header products-catalog-group__header--solo">
                                <h2 className="products-catalog-group__title">{activeGroup.label}</h2>
                                <span className="products-catalog-group__count">
                                    {filtered.length} catégorie{filtered.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </FadeUp>
                    )}

                    {paged.length > 0 ? (
                        <StaggerContainer className="products-catalog-grid" key={`${selectedGroup}-${page}`}>
                            {paged.map((cat) => (
                                <CatalogCard
                                    key={cat.slug}
                                    cat={cat}
                                    showGroupBadge={selectedGroup === 'all'}
                                    groupLabel={getGroupLabel(cat.group, mainCategories)}
                                />
                            ))}
                        </StaggerContainer>
                    ) : (
                        <FadeUp>
                            <div className="products-catalog-empty" role="status">
                                <PackageOpen size={40} aria-hidden="true" />
                                <p>Aucune catégorie produit dans cette sélection.</p>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={() => handleGroupChange('all')}
                                >
                                    Voir toutes les catégories
                                </button>
                            </div>
                        </FadeUp>
                    )}

                    {totalPages > 1 && (
                        <div className="products-catalog-pagination" role="navigation" aria-label="Pagination">
                            <button
                                type="button"
                                className="products-catalog-page products-catalog-page--nav"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                aria-label="Page précédente"
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`products-catalog-page ${page === i + 1 ? 'products-catalog-page--active' : ''}`}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? 'page' : undefined}
                                    aria-label={`Page ${i + 1}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="products-catalog-page products-catalog-page--nav"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                aria-label="Page suivante"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <CTABanner />
        </PageTransition>
    )
}

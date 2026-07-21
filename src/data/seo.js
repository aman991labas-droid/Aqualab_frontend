/**
 * SEO constants & schema builders — Laravel-ready.
 * Future: metadata fields come from API responses.
 */

export const SITE_URL = 'https://aqualab.ma'
export const SITE_NAME = 'Aqualab Technologie'
export const DEFAULT_OG_IMAGE = '/images/og-image.png'

/** Resolve relative paths to absolute URLs for OG/Twitter/canonical */
export function resolveAbsoluteUrl(url) {
    if (!url) return `${SITE_URL}${DEFAULT_OG_IMAGE}`
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

export function buildCanonicalPath(path) {
    if (!path || path === '/') return `${SITE_URL}/`
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'Aqualab Technologie S.A.R.L',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    email: 'info@aqualab.ma',
    telephone: '+212522309650',
    foundingDate: '2006',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '409, Ambassadeur Ben Aicha, Roches Noires',
        addressLocality: 'Casablanca',
        addressCountry: 'MA',
    },
    sameAs: ['https://www.linkedin.com/company/aqualab-technologie/'],
}

export const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: 'Distributeur et installateur de matériels industriels, scientifiques et de laboratoire au Maroc.',
    url: SITE_URL,
    telephone: '+212522309650',
    email: 'info@aqualab.ma',
    foundingDate: '2006',
    legalName: 'Aqualab Technologie S.A.R.L',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '409, Ambassadeur Ben Aicha, Roches Noires',
        addressLocality: 'Casablanca',
        addressCountry: 'MA',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: '33.5731',
        longitude: '-7.5898',
    },
    sameAs: ['https://www.linkedin.com/company/aqualab-technologie/'],
    priceRange: '$$',
    currenciesAccepted: 'MAD',
}

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'fr-MA',
    publisher: { '@type': 'Organization', name: SITE_NAME },
}

/** Breadcrumb items: [{ label, path? }] — Accueil is prepended automatically */
export function buildBreadcrumbSchema(items = []) {
    const all = [{ label: 'Accueil', path: '/' }, ...items]
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            ...(item.path ? { item: buildCanonicalPath(item.path) } : {}),
        })),
    }
}

/** Product category schema — Laravel: built from API category object */
export function buildProductSchema(category) {
    const url = buildCanonicalPath(`/produits/${category.slug}`)
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: category.title,
        description: category.seo?.description ?? category.shortDesc,
        image: category.image ? resolveAbsoluteUrl(category.image) : undefined,
        brand: { '@type': 'Brand',   name: category.partner?.split('—')[0]?.trim() ?? ""},
        url,
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: SITE_NAME },
        },
    }
}

/** Article schema — Laravel: built from API article object */
export function buildArticleSchema(article, categoryLabel) {
    const url = buildCanonicalPath(`/actualites/${article.slug}`)
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: resolveAbsoluteUrl(article.image),
        author: { '@type': 'Person', name: article.author.name },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
        },
        datePublished: article.date,
        articleSection: categoryLabel,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }
}

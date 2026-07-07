import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  resolveAbsoluteUrl,
  buildCanonicalPath,
} from '@/data/seo'

/**
 * Parse robots directive string into Next.js Metadata robots object.
 * @param {string} robots - e.g. "noindex, nofollow"
 */
function parseRobots(robots) {
  if (!robots) return undefined
  const lower = robots.toLowerCase()
  return {
    index: !lower.includes('noindex'),
    follow: !lower.includes('nofollow'),
  }
}

/**
 * Build Next.js Metadata object from page SEO props.
 * Replaces react-helmet-async PageSEO — Laravel: pass fields from API response.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.description]
 * @param {string} [options.path]
 * @param {string} [options.canonical]
 * @param {string} [options.ogType]
 * @param {string} [options.ogTitle]
 * @param {string} [options.ogDescription]
 * @param {string} [options.ogImage]
 * @param {string} [options.ogUrl]
 * @param {string} [options.twitterCard]
 * @param {string} [options.robots]
 * @param {object} [options.article]
 */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  canonical,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  robots,
  article,
}) {
  const canonicalUrl = canonical
    ? resolveAbsoluteUrl(canonical)
    : buildCanonicalPath(path)

  const ogImageUrl = resolveAbsoluteUrl(ogImage || DEFAULT_OG_IMAGE)
  const finalOgTitle = ogTitle || title
  const finalOgDescription = ogDescription || description
  const finalOgUrl = ogUrl ? resolveAbsoluteUrl(ogUrl) : canonicalUrl

  /** @type {import('next').Metadata} */
  const metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: 'fr_MA',
      siteName: SITE_NAME,
      title: finalOgTitle,
      description: finalOgDescription,
      url: finalOgUrl,
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: twitterCard,
      title: finalOgTitle,
      description: finalOgDescription,
      images: [ogImageUrl],
    },
  }

  const robotsConfig = parseRobots(robots)
  if (robotsConfig) metadata.robots = robotsConfig

  if (article?.publishedTime) {
    metadata.openGraph.publishedTime = article.publishedTime
  }
  if (article?.author) {
    metadata.openGraph.authors = [article.author]
  }
  if (article?.section) {
    metadata.openGraph.section = article.section
  }

  return metadata
}

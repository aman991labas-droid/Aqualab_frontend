import { SITE_URL } from '@/data/seo'
import { getAllArticles, getAllCategories } from '@/lib/server-data'

/** Static public routes */
const STATIC_ROUTES = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/produits', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/a-propos', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/actualites', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/recrutement', changeFrequency: 'monthly', priority: 0.6 },
]

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const [productCategories, articles] = await Promise.all([
    getAllCategories(),
    getAllArticles(),
  ])

  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  const productEntries = productCategories.map((category) => ({
    url: `${SITE_URL}/produits/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/actualites/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...productEntries, ...articleEntries]
}

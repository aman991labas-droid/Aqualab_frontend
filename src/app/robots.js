import { SITE_URL } from '@/data/seo'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

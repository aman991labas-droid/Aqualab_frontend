import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import { getAllArticles, getBlogCategories } from '@/lib/server-data'
import ActualitesPage from '@/components/actualites/ActualitesPage'

const breadcrumbs = [{ label: 'Actualités' }]

export const metadata = buildPageMetadata({
  title: 'Actualités & Blog – Expertise Laboratoire | Aqualab Technologie',
  description:
    "Retrouvez les dernières actualités, guides et articles d'expertise d'Aqualab Technologie sur les équipements de laboratoire, la métrologie et les solutions industrielles.",
  path: '/actualites',
})

export default async function Page() {
  const [articles, blogCategories] = await Promise.all([
    getAllArticles(),
    getBlogCategories(),
  ])

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <ActualitesPage articles={articles} categories={blogCategories} />
    </>
  )
}

import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import ServicesPage from '@/components/services/ServicesPage'

const breadcrumbs = [{ label: 'Services' }]

export const metadata = buildPageMetadata({
  title: 'Nos Services – Installation, Maintenance & Formation | Aqualab Technologie',
  description:
    'Aqualab Technologie offre une gamme complète de services : installation, maintenance SAV, formation produit, assistance technique, et disponibilité de stock au Maroc.',
  path: '/services',
})

export default function Page() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <ServicesPage />
    </>
  )
}

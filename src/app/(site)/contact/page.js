import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import ContactPage from '@/components/contact/ContactPage'

const breadcrumbs = [{ label: 'Contact' }]

export const metadata = buildPageMetadata({
  title: 'Contact – Demandez un devis | Aqualab Technologie',
  description:
    "Contactez Aqualab Technologie pour toute demande de devis, d'information ou d'assistance technique. Tél: 05 22 30 96 50 – Casablanca, Maroc.",
  path: '/contact',
})

export default function Page() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <ContactPage />
    </>
  )
}

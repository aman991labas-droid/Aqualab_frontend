import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import RecrutementPage from '@/components/recrutement/RecrutementPage'

const breadcrumbs = [{ label: 'Recrutement' }]

export const metadata = buildPageMetadata({
  title: 'Recrutement & Candidature Spontanée | Aqualab Technologie',
  description:
    "Rejoignez l'équipe Aqualab Technologie. Envoyez votre candidature spontanée pour participer à notre développement au Maroc.",
  path: '/recrutement',
  ogTitle: 'Recrutement – Rejoignez Aqualab Technologie',
  ogDescription:
    "Ingénieurs, techniciens, profils commerciaux : déposez votre candidature spontanée chez Aqualab Technologie, Casablanca.",
})

export default function Page() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <RecrutementPage />
    </>
  )
}

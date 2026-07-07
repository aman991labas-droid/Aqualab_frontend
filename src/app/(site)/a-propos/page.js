import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import AboutPage from '@/components/about/AboutPage'

const breadcrumbs = [{ label: 'À Propos' }]

export const metadata = buildPageMetadata({
  title: 'À Propos – Histoire & Valeurs | Aqualab Technologie',
  description:
    "Découvrez l'histoire d'Aqualab Technologie depuis 2006 : notre mission, nos valeurs et notre engagement envers l'excellence dans la distribution d'équipements industriels et scientifiques au Maroc.",
  path: '/a-propos',
})

export default function Page() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <AboutPage />
    </>
  )
}

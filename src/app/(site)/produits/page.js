import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema } from '@/data/seo'
import { getAllCategories, getMainCategories } from '@/lib/server-data'
import ProductsPage from '@/components/products/ProductsPage'

const breadcrumbs = [{ label: 'Produits' }]

export const metadata = buildPageMetadata({
  title: 'Produits – Équipements de Laboratoire & Industriels | Aqualab Technologie',
  description:
    'Découvrez la gamme complète d\'équipements Aqualab : microscopie Leica, essais mécaniques Tinius Olsen, métallographie Metkon, métrologie Vogel, simulation climatique Climats et solutions industrielles.',
  path: '/produits',
  ogTitle: 'Produits – Équipements Laboratoire & Industriels | Aqualab',
  ogDescription:
    'Catalogue complet d\'équipements scientifiques et industriels au Maroc : Leica, Tinius Olsen, Metkon, Vogel, Climats et solutions industrielles.',
})

export default async function Page() {
  const [categories, mainCategories] = await Promise.all([
    getAllCategories(),
    getMainCategories(),
  ])

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      <ProductsPage categories={categories} mainCategories={mainCategories} />
    </>
  )
}

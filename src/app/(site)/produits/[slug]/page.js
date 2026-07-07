import { redirect } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbSchema, buildProductSchema } from '@/data/seo'
import {
  getAllArticles,
  getAllCategories,
  getArticleBySlug,
  getArticlesForProduct,
  getCategoryBySlug,
  getCategorySlugs,
  getMainCategories,
} from '@/lib/server-data'
import ProductCategoryPage from '@/components/products/ProductCategoryPage'

export async function generateStaticParams() {
  return getCategorySlugs()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return buildPageMetadata({
      title: 'Produit introuvable | Aqualab Technologie',
      description: 'La catégorie produit demandée est introuvable.',
      path: '/produits',
      robots: 'noindex, nofollow',
    })
  }

  return buildPageMetadata({
    title: category.seo.title,
    description: category.seo.description,
    path: `/produits/${category.slug}`,
    ogImage: category.image || undefined,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const [category, allCategories, allArticles, mainCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories(),
    getAllArticles(),
    getMainCategories(),
  ])

  if (!category) {
    redirect('/produits')
  }

  const breadcrumbs = [
    { label: 'Produits', path: '/produits' },
    { label: category.title },
  ]

  return (
    <>
      <JsonLd data={[buildProductSchema(category), buildBreadcrumbSchema(breadcrumbs)]} />
      <ProductCategoryPage
        category={category}
        allCategories={allCategories}
        mainCategories={mainCategories}
        relatedArticles={getArticlesForProduct(slug, allArticles)}
      />
    </>
  )
}

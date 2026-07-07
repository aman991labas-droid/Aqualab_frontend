import { redirect } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/data/seo'
import {
  getAllArticles,
  getAllCategories,
  getArticleBySlug,
  getArticleSlugs,
  getBlogCategories,
  getCategoriesForSlugs,
  getRelatedArticles,
} from '@/lib/server-data'
import ArticleDetailPage from '@/components/actualites/ArticleDetailPage'

export async function generateStaticParams() {
  return getArticleSlugs()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return buildPageMetadata({
      title: 'Article introuvable | Aqualab Technologie',
      description: "L'article demandé est introuvable.",
      path: '/actualites',
      robots: 'noindex, nofollow',
    })
  }

  const blogCategories = await getBlogCategories()
  const categoryLabel = blogCategories.find((c) => c.id === article.category)?.label

  return buildPageMetadata({
    title: `${article.title} | Blog Aqualab Technologie`,
    description: article.excerpt,
    path: `/actualites/${slug}`,
    ogType: 'article',
    ogTitle: article.title,
    ogDescription: article.excerpt,
    ogImage: article.image,
    article: {
      publishedTime: article.date,
      author: article.author.name,
      section: categoryLabel,
    },
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const [article, allArticles, allCategories, blogCategories] = await Promise.all([
    getArticleBySlug(slug),
    getAllArticles(),
    getAllCategories(),
    getBlogCategories(),
  ])

  if (!article) {
    redirect('/actualites')
  }

  const categoryLabel = blogCategories.find((c) => c.id === article.category)?.label
  const breadcrumbs = [
    { label: 'Actualités', path: '/actualites' },
    { label: article.title },
  ]

  return (
    <>
      <JsonLd data={[buildArticleSchema(article, categoryLabel), buildBreadcrumbSchema(breadcrumbs)]} />
      <ArticleDetailPage
        article={article}
        relatedArticles={getRelatedArticles(article, allArticles)}
        relatedProducts={getCategoriesForSlugs(article.relatedProductSlugs ?? [], allCategories)}
        categories={blogCategories}
      />
    </>
  )
}

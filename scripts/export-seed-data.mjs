import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PARTNER_LOGOS, productCategories } from '../src/data/products.js'
import { articles, categories } from '../src/data/articles.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../../aqualab-api/database/seeders/data')

fs.mkdirSync(outDir, { recursive: true })

const categoriesPayload = productCategories.map((category, index) => ({
  slug: category.slug,
  title: category.title,
  group: category.group,
  partner: category.partner,
  partner_logo: PARTNER_LOGOS[category.slug] ?? null,
  short_desc: category.shortDesc,
  description: category.description,
  image: `/images/products/${category.slug}.jpg`,
  items: category.items,
  seo_title: category.seo?.title ?? null,
  seo_description: category.seo?.description ?? null,
  sort_order: index + 1,
}))

const articlesPayload = articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  content: article.content,
  category: article.category,
  image: article.image,
  author_name: article.author?.name ?? 'Équipe Aqualab',
  author_avatar: article.author?.avatar ?? null,
  published_at: article.date,
  read_time: article.readTime,
  featured: Boolean(article.featured),
  related_product_slugs: article.relatedProductSlugs ?? [],
}))

const blogCategoriesPayload = categories
  .filter((category) => category.id !== 'all')
  .map((category) => ({
    key: category.id,
    label: category.label,
  }))

fs.writeFileSync(path.join(outDir, 'categories.json'), JSON.stringify(categoriesPayload, null, 2))
fs.writeFileSync(path.join(outDir, 'articles.json'), JSON.stringify(articlesPayload, null, 2))
fs.writeFileSync(path.join(outDir, 'blog_categories.json'), JSON.stringify(blogCategoriesPayload, null, 2))

console.log('Exported seed data to', outDir)

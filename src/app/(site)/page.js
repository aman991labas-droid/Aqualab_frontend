import { buildPageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { localBusinessSchema } from '@/data/seo'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import Partners from '@/components/home/Partners'
import ProductsHighlight from '@/components/home/ProductsHighlight'
import ServicesSection from '@/components/home/ServicesSection'
import WhyUs from '@/components/home/WhyUs'
import CTABanner from '@/components/home/CTABanner'
import { getAllCategories, getPartners } from '@/lib/server-data'

export const metadata = buildPageMetadata({
  title: 'Aqualab Technologie – Matériels Industriels & Scientifiques au Maroc',
  description:
    'Aqualab Technologie est votre partenaire de confiance en importation et distribution de matériels industriels, scientifiques et de laboratoire au Maroc. Casablanca depuis 2006.',
  path: '/',
  ogTitle: 'Aqualab Technologie – Matériels Industriels & Scientifiques',
})

export default async function HomePage() {
  const [categories, partners] = await Promise.all([getAllCategories(), getPartners()])

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <Stats />
      <Partners partners={partners} />
      <ProductsHighlight categories={categories} />
      <ServicesSection />
      <WhyUs />
      <CTABanner />
    </>
  )
}

import { Inter, Poppins } from 'next/font/google'
import AppProviders from '@/components/providers/AppProviders'
import Script from "next/script";
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/metadata'
import { organizationSchema, websiteSchema } from '@/data/seo'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = buildPageMetadata({
  title: 'Aqualab Technologie – Matériels Industriels & Scientifiques au Maroc',
  description:
    'Aqualab Technologie est votre partenaire de confiance en importation et distribution de matériels industriels, scientifiques et de laboratoire au Maroc. Casablanca depuis 2006.',
  path: '/',
  ogTitle: 'Aqualab Technologie – Matériels Industriels & Scientifiques',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${poppins.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
  <Script
    id="theme-init"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem('aqualab-theme');document.documentElement.setAttribute('data-theme',t==='dark'||t==='light'?t:'light');document.documentElement.style.colorScheme=t==='dark'?'dark':'light';}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}})();`,
    }}
  />

  <link rel="icon" href="/logoicone.jpg" type="image/jpeg" />
  <link rel="apple-touch-icon" href="/logoicone.jpg" />
</head>
      <body suppressHydrationWarning>
        <JsonLd data={[organizationSchema, websiteSchema]} idPrefix="site-json-ld" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

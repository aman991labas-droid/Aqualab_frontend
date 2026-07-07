import { buildPageMetadata } from '@/lib/metadata'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SkipToContent from '@/components/layout/SkipToContent'
import NotFoundPage from '@/components/pages/NotFoundPage'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata = buildPageMetadata({
  title: '404 – Page introuvable | Aqualab Technologie',
  description: "La page que vous recherchez n'existe pas ou a été déplacée.",
  path: '/404',
  robots: 'noindex, nofollow',
})

export default function NotFound() {
  return (
    <ThemeProvider>
      <SkipToContent />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <NotFoundPage />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

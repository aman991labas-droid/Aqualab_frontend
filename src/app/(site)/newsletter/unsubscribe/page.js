import { Suspense } from 'react'
import UnsubscribePage from '@/components/newsletter/UnsubscribePage'

export const metadata = {
  title: 'Désinscription newsletter | Aqualab Technologie',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container section">Chargement...</div>}>
      <UnsubscribePage />
    </Suspense>
  )
}

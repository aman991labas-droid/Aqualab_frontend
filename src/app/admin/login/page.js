import { Suspense } from 'react'
import LoginPage from '@/admin/pages/LoginPage'
import LoadingSpinner from '@/admin/components/ui/LoadingSpinner'

export const metadata = {
  title: 'Connexion Admin | Aqualab',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage label="Chargement..." />}>
      <LoginPage />
    </Suspense>
  )
}

import '@/styles/admin.css'
import AdminProviders from '@/admin/components/providers/AdminProviders'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }) {
  return <AdminProviders>{children}</AdminProviders>
}

import ProtectedAdminLayout from '@/admin/components/layout/ProtectedAdminLayout'

export const metadata = {
  title: 'Administration | Aqualab',
  robots: { index: false, follow: false },
}

export default function AdminPanelLayout({ children }) {
  return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
}

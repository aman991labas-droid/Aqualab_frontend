'use client'

import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/admin/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

export default function AdminProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#b30006', secondary: '#fff' } },
            error: { iconTheme: { primary: '#b30006', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}

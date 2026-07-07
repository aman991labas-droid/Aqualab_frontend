'use client'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/context/ThemeContext'

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

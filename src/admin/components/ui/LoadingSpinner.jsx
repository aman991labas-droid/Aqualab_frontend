'use client'

export default function LoadingSpinner({ label = 'Chargement...', fullPage = false }) {
  return (
    <div className={`admin-spinner-wrap ${fullPage ? 'admin-spinner-wrap--full' : ''}`} role="status" aria-live="polite">
      <span className="admin-spinner" />
      <span>{label}</span>
    </div>
  )
}


'use client'

export default function EmptyState({ title = 'Aucune donnee', message = 'Aucun element ne correspond a votre recherche.' }) {
  return (
    <div className="admin-state admin-state--empty">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}


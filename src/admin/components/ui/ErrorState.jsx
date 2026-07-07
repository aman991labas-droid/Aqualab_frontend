'use client'

export default function ErrorState({ message = "Une erreur s'est produite.", onRetry }) {
  return (
    <div className="admin-state admin-state--error">
      <h3>Erreur</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary btn-sm" onClick={onRetry}>
          Reessayer
        </button>
      )}
    </div>
  )
}


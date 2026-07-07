'use client'

export default function Modal({ open, title, onClose, children, width = '680px' }) {
  if (!open) return null
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__head">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  )
}


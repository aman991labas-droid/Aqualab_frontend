'use client'

import Modal from './Modal'

export default function ConfirmationDialog({ open, title = 'Confirmation', message, onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width="480px">
      <p>{message}</p>
      <div className="admin-actions">
        <button className="btn btn-outline-dark btn-sm" onClick={onCancel}>
          Annuler
        </button>
        <button className="btn btn-primary btn-sm" onClick={onConfirm} disabled={loading}>
          {loading ? 'Suppression...' : 'Confirmer'}
        </button>
      </div>
    </Modal>
  )
}


'use client'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="admin-pagination">
      <button className="btn btn-sm btn-outline-dark" onClick={() => onChange(Math.max(page - 1, 1))} disabled={page === 1}>
        Precedent
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button className="btn btn-sm btn-outline-dark" onClick={() => onChange(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
        Suivant
      </button>
    </div>
  )
}


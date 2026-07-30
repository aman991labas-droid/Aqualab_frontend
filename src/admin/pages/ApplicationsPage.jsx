'use client'

import { useEffect, useMemo, useState } from 'react'
import { applicationService } from '../services/applicationService'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import Select from '../components/ui/Select'
import FilterBar from '../components/ui/FilterBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'

const PAGE_SIZE = 6

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]



export default function ApplicationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [details, setDetails] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [actionLoading, setActionLoading] = useState(false)


  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await applicationService.getApplications())
    } catch {
      setError('Erreur de chargement des candidatures.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items.filter((i) => {
      const byText =
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.jobType || '').toLowerCase().includes(q)
      const byStatus = status === 'all' || i.status === status
      return byText && byStatus
    })
  }, [items, query, status])

  const onSelect = (id, checked) => {
    if (checked) setSelectedIds((prev) => [...prev, id])
    else setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  const onSelectAll = (checked, currentRows) => {
    if (checked) {
      const newIds = currentRows.map((r) => r.id).filter((id) => !selectedIds.includes(id))
      setSelectedIds((prev) => [...prev, ...newIds])
    } else {
      const rowIds = currentRows.map((r) => r.id)
      setSelectedIds((prev) => prev.filter((id) => !rowIds.includes(id)))
    }
  }

  const sortedRows = [...filtered]
  const rows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))



  const setRowStatus = async (id, nextStatus) => {
    setActionLoading(true)
    try {
      await applicationService.updateApplicationStatus(id, nextStatus)
      Toast.success('Statut mis à jour.')
      load()
      if (details?.id === id) {
        setDetails(prev => ({ ...prev, status: nextStatus }))
      }
    } finally {
      setActionLoading(false)
    }
  }

  const remove = async () => {
    if (!deleting && !deletingMultiple) return
    setActionLoading(true)
    try {
      if (deletingMultiple) {
        for (const id of selectedIds) {
          await applicationService.deleteApplication(id)
        }
        Toast.success('Candidatures supprimées.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await applicationService.deleteApplication(deleting.id)
        Toast.success('Candidature supprimée.')
        setDeleting(null)
      }
      load()
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={load} />


  return (
    <section className="admin-page">
      <div className="admin-page__head">
        <h1>Candidatures spontanées</h1>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Nom, email, spécialité..." />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[{ value: 'all', label: 'Tous statuts' }, ...statusOptions]}
        />
      </FilterBar>
      
      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState title="Aucune candidature" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              { key: 'name', label: 'name' },
              { key: 'email', label: 'email' },
              { key: 'jobType', label: 'jobType' },
              { key: 'submittedAt', label: 'submittedAt' },
              {
                key: 'status',
                label: 'status',
                render: (value, row) => (
                  <select value={value} onChange={(e) => setRowStatus(row.id, e.target.value)} disabled={actionLoading}>
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                ),
              },
            ]}
            rows={rows}
            sortKey="submittedAt"
            sortDir="desc"
            onSort={() => {}}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setDetails(row)}>
                  Détails
                </button>
                {row.cvUrl && (
                  <a className="btn btn-sm btn-outline-dark" href={row.cvUrl} download={row.cvFile || 'cv.pdf'}>
                    Télécharger CV
                  </a>
                )}
                {/* <button className="btn btn-sm btn-primary" onClick={() => setDeleting(row)}>
                  Supprimer
                </button> */}
              </>
            )}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title="Détails candidature">
        {details && (
          <div className="admin-details">

            <p><strong>name:</strong> {details.name}</p>
            <p><strong>email:</strong> {details.email}</p>
            <p><strong>tel:</strong> {details.tel || '—'}</p>
            <p><strong>jobType:</strong> {details.jobType || '—'}</p>
            <p><strong>cvFile:</strong> {details.cvFile || '—'}</p>
            <p><strong>submittedAt:</strong> {details.submittedAt}</p>
            <p><strong>status:</strong> {details.status}</p>
            <p><strong>message:</strong></p>
            <p>{details.message}</p>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer cette candidature ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} élément(s).` : (deleting ? deleting.name : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={remove}
        loading={actionLoading}
      />
    </section>
  )
}

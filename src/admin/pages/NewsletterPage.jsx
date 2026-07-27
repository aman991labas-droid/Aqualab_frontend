'use client'

import { useEffect, useState } from 'react'
import { newsletterService } from '../services/newsletterService'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import Select from '../components/ui/Select'
import FilterBar from '../components/ui/FilterBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'

const statusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Inscrit' },
  { value: 'unsubscribed', label: 'Désinscrits' },
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function NewsletterPage() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 })
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deactivating, setDeactivating] = useState(null)
  const [reactivating, setReactivating] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await newsletterService.getSubscribers({
        q: query,
        status,
        page,
        perPage: 15,
        sort: 'subscribed_at',
        dir: 'desc',
      })
      setItems(result.data || [])
      setStats(result.stats || { total: 0, active: 0, unsubscribed: 0 })
      setMeta(result.meta || { current_page: 1, last_page: 1, per_page: 15, total: 0 })
    } catch {
      setError('Erreur de chargement des abonnés.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, status])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      load()
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleDeactivate = async () => {
    if (!deactivating) return
    setActionLoading(true)
    try {
      await newsletterService.deactivateSubscriber(deactivating.id)
      Toast.success('Abonné désinscrit.')
      setDeactivating(null)
      load()
    } catch {
      Toast.error('Impossible de désinscrire.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReactivate = async () => {
    if (!reactivating) return
    setActionLoading(true)
    try {
      await newsletterService.reactivateSubscriber(reactivating.id)
      Toast.success('Abonné réinscrit.')
      setReactivating(null)
      load()
    } catch {
      Toast.error('Impossible de réinscrire.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting && !deletingMultiple) return
    setActionLoading(true)
    try {
      if (deletingMultiple) {
        for (const id of selectedIds) {
          await newsletterService.deleteSubscriber(id)
        }
        Toast.success('Abonnés supprimés.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await newsletterService.deleteSubscriber(deleting.id)
        Toast.success('Abonné supprimé.')
        setDeleting(null)
      }
      load()
    } catch {
      Toast.error('Impossible de supprimer.')
    } finally {
      setActionLoading(false)
    }
  }

  const onSelect = (id, checked) => {
    if (checked) setSelectedIds(prev => [...prev, id])
    else setSelectedIds(prev => prev.filter(i => i !== id))
  }

  const onSelectAll = (checked, currentRows) => {
    if (checked) {
      const newIds = currentRows.map(r => r.id).filter(id => !selectedIds.includes(id))
      setSelectedIds(prev => [...prev, ...newIds])
    } else {
      const rowIds = currentRows.map(r => r.id)
      setSelectedIds(prev => prev.filter(id => !rowIds.includes(id)))
    }
  }

  const openAddModal = () => {
    setAddEmail('')
    setAddError('')
    setAddModalOpen(true)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const trimmed = addEmail.trim()
    if (!trimmed) { setAddError('Veuillez saisir un email.'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) { setAddError('Email invalide.'); return }
    setAddLoading(true)
    setAddError('')
    try {
      const res = await newsletterService.addSubscriber(trimmed)
      Toast.success(res?.message || 'Abonné ajouté avec succès.')
      setAddModalOpen(false)
      load()
    } catch (err) {
      setAddError(err?.message || "Impossible d'ajouter cet abonné.")
    } finally {
      setAddLoading(false)
    }
  }

  if (loading && items.length === 0) return <LoadingSpinner label="Chargement newsletter..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="admin-page">
      <div className="admin-page__head">
        <h1>Newsletter</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Ajouter un abonné
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat card"><div className="card-body"><p>Total</p><strong>{stats.total}</strong></div></div>
        <div className="admin-stat card"><div className="card-body"><p>Actifs</p><strong>{stats.active}</strong></div></div>
        <div className="admin-stat card"><div className="card-body"><p>Désinscrits</p><strong>{stats.unsubscribed}</strong></div></div>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher par email..." />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} options={statusOptions} />
      </FilterBar>

      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState title="Aucun abonné" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              { key: 'email', label: 'Email' },
              {
                key: 'isActive',
                label: 'Statut',
                render: (value) => (value ? 'Inscrit' : 'Désinscrit'),
              },
              {
                key: 'subscribedAt',
                label: 'Inscrit le',
                render: (value) => formatDate(value),
              },
              {
                key: 'unsubscribedAt',
                label: 'Désinscrit le',
                render: (value) => formatDate(value),
              },
            ]}
            rows={items}
            sortKey="subscribedAt"
            sortDir="desc"
            onSort={() => {}}
            actions={(row) => (
              <>
                {row.isActive ? (
                  <button className="btn btn-sm btn-outline-dark" style={{ marginRight: '8px' }} onClick={() => setDeactivating(row)}>
                    Se désinscrire
                  </button>
                ) : (
                  <button className="btn btn-sm btn-outline-dark" style={{ marginRight: '8px' }} onClick={() => setReactivating(row)}>
                    S'inscrire  
                  </button>
                )}
                {/* <button className="btn btn-sm btn-primary" onClick={() => setDeleting(row)}>
                  Supprimer
                </button> */}
              </>
            )}
          />
          <Pagination page={meta.current_page} totalPages={meta.last_page} onChange={setPage} />
        </>
      )}

      <ConfirmationDialog
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer cet abonné ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} abonné(s).` : (deleting ? deleting.email : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={handleDelete}
        loading={actionLoading}
      />

      <ConfirmationDialog
        open={!!deactivating}
        title="Désinscrire cet abonné ?"
        message={deactivating ? deactivating.email : ''}
        onCancel={() => setDeactivating(null)}
        onConfirm={handleDeactivate}
        loading={actionLoading}
      />

      <ConfirmationDialog
        open={!!reactivating}
        title="Réinscrire cet abonné ?"
        message={reactivating ? reactivating.email : ''}
        onCancel={() => setReactivating(null)}
        onConfirm={handleReactivate}
        loading={actionLoading}
      />

      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Ajouter un abonné à la newsletter"
        width="440px"
      >
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Adresse email"
            type="email"
            required
            value={addEmail}
            onChange={(e) => { setAddEmail(e.target.value); setAddError('') }}
            placeholder="exemple@email.com"
            error={addError}
          />
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => setAddModalOpen(false)}
              disabled={addLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={addLoading}
            >
              {addLoading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

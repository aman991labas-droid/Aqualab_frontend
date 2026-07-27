'use client'

import { useEffect, useMemo, useState } from 'react'
import { contactService } from '../services/contactService'
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

const PAGE_SIZE = 8

const readFilterOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'unread', label: 'Non lus' },
  { value: 'read', label: 'Lus' },
]

export default function ContactMessagesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [readFilter, setReadFilter] = useState('all')
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
      setItems(await contactService.getMessages())
    } catch {
      setError('Erreur de chargement des messages contact.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items.filter((item) => {
      const byText =
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.company || '').toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      const byRead =
        readFilter === 'all' ||
        (readFilter === 'read' && item.isRead) ||
        (readFilter === 'unread' && !item.isRead)
      return byText && byRead
    })
  }, [items, query, readFilter])

  
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


  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const unreadCount = items.filter((item) => !item.isRead).length

  const openDetails = async (row) => {
    setActionLoading(true)
    try {
      const message = await contactService.getMessage(row.id)
      setDetails(message)
      setItems((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, ...message } : item))
      )
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleRead = async (row) => {
    setActionLoading(true)
    try {
      const updated = await contactService.markAsRead(row.id, !row.isRead)
      setItems((prev) => prev.map((item) => (item.id === row.id ? { ...item, ...updated } : item)))
      if (details?.id === row.id) setDetails(updated)
      Toast.success(updated.isRead ? 'Message marqué comme lu.' : 'Message marqué comme non lu.')
    } catch (err) {
      Toast.error(err.message)
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
          await contactService.deleteMessage(id)
        }
        Toast.success('Éléments supprimés.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await contactService.deleteMessage(deleting.id)
        Toast.success('Élément supprimé.')
        setDeleting(null)
      }
      load()
      Toast.success('Message supprimé.')
      if (details?.id === deleting.id) setDetails(null)
      setDeleting(null)
      load()
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Messages contact</h1>
          {unreadCount > 0 && (
            <p style={{ margin: '0.25rem 0 0', color: '#b30006', fontWeight: 600 }}>
              {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Nom, email, entreprise, message..." />
        <Select
          value={readFilter}
          onChange={(e) => {
            setReadFilter(e.target.value)
            setPage(1)
          }}
          options={readFilterOptions}
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
        <EmptyState title="Aucun message contact" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              {
                key: 'name',
                label: 'Nom',
                render: (value, row) => (
                  <span style={{ fontWeight: row.isRead ? 500 : 700 }}>
                    {!row.isRead && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#b30006',
                          marginRight: 8,
                        }}
                        aria-hidden="true"
                      />
                    )}
                    {value}
                  </span>
                ),
              },
              { key: 'email', label: 'Email' },
              { key: 'company', label: 'Entreprise', render: (v) => v || '—' },
              { key: 'submittedAt', label: 'Reçu le' },
              {
                key: 'isRead',
                label: 'Statut',
                render: (value) => (
                  <span style={value ? { color: '#64748b' } : { color: '#b30006', fontWeight: 600 }}>
                    {value ? 'Lu' : 'Non lu'}
                  </span>
                ),
              },
            ]}
            rows={rows}
            sortKey="submittedAt"
            sortDir="desc"
            onSort={() => {}}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => openDetails(row)} disabled={actionLoading}>
                  Détails
                </button>
                <a className="btn btn-sm btn-outline-dark" href={`mailto:${row.email}`}>
                  Répondre
                </a>
                <button className="btn btn-sm btn-outline-dark" onClick={() => toggleRead(row)} disabled={actionLoading}>
                  {row.isRead ? 'Non lu' : 'Marquer lu'}
                </button>
                {/* <button className="btn btn-sm btn-primary" onClick={() => setDeleting(row)}>
                  Supprimer
                </button> */}
              </>
            )}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={!!details} onClose={() => setDetails(null)} title="Détail du message">
        {details && (
          <div className="admin-details">
            <p><strong>Nom :</strong> {details.name}</p>
            <p><strong>Email :</strong> <a href={`mailto:${details.email}`}>{details.email}</a></p>
            <p><strong>Téléphone :</strong> {details.tel || '—'}</p>
            <p><strong>Entreprise :</strong> {details.company || '—'}</p>
            <p><strong>Reçu le :</strong> {details.submittedAt}</p>
            <p><strong>Statut :</strong> {details.isRead ? 'Lu' : 'Non lu'}</p>
            <p><strong>Message :</strong></p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{details.message}</p>
            <div className="admin-actions" style={{ marginTop: '1rem' }}>
              <a className="btn btn-primary" href={`mailto:${details.email}`}>
                Répondre par email
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer ce message ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} élément(s).` : (deleting ? deleting.name : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={remove}
        loading={actionLoading}
      />
    </section>
  )
}

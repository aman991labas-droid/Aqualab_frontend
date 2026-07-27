'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { applicationService } from '../services/applicationService'
import { priorityClass, priorityLabel, cvStatusClass, cvStatusLabel } from '../utils/aiHelpers'
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

function PriorityBadge({ score, priority }) {
  if (score == null) return <span className="admin-priority admin-priority--none">—</span>
  return (
    <span className={`admin-priority ${priorityClass(priority)}`}>
      {score}/100 · {priorityLabel(priority)}
    </span>
  )
}

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
  const [scores, setScores] = useState({})
  const [scoringId, setScoringId] = useState(null)

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

  const sortedRows = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const scoreA = scores[a.id]?.score ?? -1
      const scoreB = scores[b.id]?.score ?? -1
      return scoreB - scoreA
    })
  }, [filtered, scores])

  const rows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const scoreApplication = async (row, { openDetails = false } = {}) => {
    setScoringId(row.id)
    try {
      const result = await applicationService.scoreApplication(row.id)
      setScores((prev) => ({ ...prev, [row.id]: result }))
      if (openDetails) {
        setDetails({ ...row, priorityScore: result })
      }
      Toast.success(result.source === 'gemini' ? 'Score IA Gemini calculé.' : 'Score calculé.')
    } catch {
      Toast.error('Impossible de calculer le score.')
    } finally {
      setScoringId(null)
    }
  }

  const setRowStatus = async (id, nextStatus) => {
    setActionLoading(true)
    try {
      await applicationService.updateApplicationStatus(id, nextStatus)
      Toast.success('Statut mis à jour.')
      load()
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

  const activeScore = details?.priorityScore || (details ? scores[details.id] : null)

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
              {
                key: 'priority',
                label: 'Score IA',
                render: (_, row) => (
                  <PriorityBadge
                    score={scores[row.id]?.score}
                    priority={scores[row.id]?.priority}
                  />
                ),
              },
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
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => scoreApplication(row)}
                  disabled={scoringId === row.id}
                >
                  <Sparkles size={13} aria-hidden="true" />
                  {scoringId === row.id ? 'Analyse...' : 'Analyser'}
                </button>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setDetails({ ...row, priorityScore: scores[row.id] })}>
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
            {activeScore && (
              <div className="admin-ai-panel">
                <div className="admin-ai-panel__head">
                  <h3>Score de priorité</h3>
                  <PriorityBadge score={activeScore.score} priority={activeScore.priority} />
                </div>
                {activeScore.cv_status && (
                  <p className="admin-ai-panel__cv">
                    Fichier joint :{' '}
                    <span className={`admin-cv-status ${cvStatusClass(activeScore.cv_status)}`}>
                      {cvStatusLabel(activeScore.cv_status)}
                    </span>
                    {details.cvFile ? ` — ${details.cvFile}` : ''}
                  </p>
                )}
                <p>{activeScore.summary}</p>
                {activeScore.strengths?.length > 0 && (
                  <>
                    <strong>Points forts</strong>
                    <ul>
                      {activeScore.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {activeScore.concerns?.length > 0 && (
                  <>
                    <strong>Points d&apos;attention</strong>
                    <ul>
                      {activeScore.concerns.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="admin-ai-panel__source">
                  {activeScore.source === 'gemini' ? 'Analysé par Gemini (Google AI)' : 'Analyse automatique (sans clé API)'}
                </p>
              </div>
            )}
            {!activeScore && (
              <button
                type="button"
                className="btn btn-sm btn-outline-dark admin-ai-panel__action"
                onClick={() => scoreApplication(details, { openDetails: true })}
                disabled={scoringId === details.id}
              >
                <Sparkles size={14} aria-hidden="true" />
                {scoringId === details.id ? 'Analyse en cours...' : 'Analyser avec Gemini'}
              </button>
            )}
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

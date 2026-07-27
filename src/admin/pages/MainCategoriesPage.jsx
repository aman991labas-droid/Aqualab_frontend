'use client'

import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import FilterBar from '../components/ui/FilterBar'
import Modal from '../components/ui/Modal'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import Input from '../components/ui/Input'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'
import { mainCategoryService } from '../services/mainCategoryService'

const PAGE_SIZE = 8

const generateId = (label) => label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function MainCategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ id: '', label: '', sortOrder: 0 })
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await mainCategoryService.getMainCategories())
    } catch {
      setError('Impossible de charger les catégories principales.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const list = items.filter(
      (i) => i.label.toLowerCase().includes(q)
    )
    return list.sort((a, b) => {
      if (a.sortOrder < b.sortOrder) return -1
      if (a.sortOrder > b.sortOrder) return 1
      return 0
    })
  }, [items, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  
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

  const validate = () => {
    const next = {}
    if (!form.label.trim()) next.label = 'Libellé requis.'
    return next
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ id: '', label: '', sortOrder: items.length })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ id: row.id, label: row.label, sortOrder: row.sortOrder ?? 0 })
    setErrors({})
    setModalOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setSubmitting(true)
    try {
      if (editing) {
        await mainCategoryService.updateMainCategory(editing.id, {
          label: form.label,
          sortOrder: Number(form.sortOrder) || 0,
        })
        Toast.success('Catégorie principale mise à jour.')
      } else {
        await mainCategoryService.createMainCategory({
          id: generateId(form.label),
          label: form.label,
          sortOrder: Number(form.sortOrder) || 0,
        })
        Toast.success('Catégorie principale créée.')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteItem = async () => {
    if (!deleting && !deletingMultiple) return
    setSubmitting(true)
    try {
      if (deletingMultiple) {
        for (const id of selectedIds) {
          await mainCategoryService.deleteMainCategory(id)
        }
        Toast.success('Éléments supprimés.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await mainCategoryService.deleteMainCategory(deleting.id)
        Toast.success('Élément supprimé.')
        setDeleting(null)
      }
      load()
      Toast.success('Catégorie principale supprimée.')
      setDeleting(null)
      load()
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="admin-page">
      <div className="admin-page__head">
        <h1>Catégories principales</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Ajouter une catégorie principale
        </button>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher par libellé..." />
      </FilterBar>

      
      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState title="Aucune catégorie principale" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              { key: 'label', label: 'Libellé' },
              // { key: 'sortOrder', label: 'Ordre' },
            ]}
            rows={rows}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => openEdit(row)}>
                  Modifier
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la catégorie principale' : 'Ajouter une catégorie principale'}
      >
        <form className="admin-form-grid" onSubmit={save}>
          <Input
            label="Libellé"
            required
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            error={errors.label}
            placeholder="ex: Laboratoire"
          />
          {/* <Input
            label="Ordre d'affichage"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
          /> */}
          <div className="admin-actions">
            <button type="button" className="btn btn-outline-dark" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer cette catégorie principale ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} élément(s).` : (deleting ? `Cette action supprimera "${deleting.label}" (id: ${deleting.id}).` : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={deleteItem}
        loading={submitting}
      />
    </section>
  )
}

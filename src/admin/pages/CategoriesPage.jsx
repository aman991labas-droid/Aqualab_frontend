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
import { categoryService } from '../services/categoryService'

const PAGE_SIZE = 8

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'label', dir: 'asc' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ id: '', label: '' })
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await categoryService.getCategories())
    } catch {
      setError('Impossible de charger les catégories.')
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
      (i) => i.id.toLowerCase().includes(q) || i.label.toLowerCase().includes(q)
    )
    return list.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
  }, [items, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const onSort = (key) => {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  const validate = () => {
    const next = {}
    if (!editing && !form.id.trim()) next.id = 'Identifiant requis.'
    if (!form.label.trim()) next.label = 'Libellé requis.'
    return next
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ id: '', label: '' })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ id: row.id, label: row.label })
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
        await categoryService.updateCategory(editing.id, { label: form.label })
        Toast.success('Catégorie mise à jour.')
      } else {
        await categoryService.createCategory({ id: form.id, label: form.label })
        Toast.success('Catégorie créée.')
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
    if (!deleting) return
    setSubmitting(true)
    try {
      await categoryService.deleteCategory(deleting.id)
      Toast.success('Catégorie supprimée.')
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
        <h1>Catégories blog</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Ajouter une catégorie
        </button>
      </div>
     
      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher par id ou label..." />
      </FilterBar>
      {rows.length === 0 ? (
        <EmptyState title="Aucune catégorie" />
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'id', sortable: true },
              { key: 'label', label: 'label', sortable: true },
            ]}
            rows={rows}
            sortKey={sort.key}
            sortDir={sort.dir}
            onSort={onSort}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => openEdit(row)}>
                  Modifier
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => setDeleting(row)}>
                  Supprimer
                </button>
              </>
            )}
          />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}>
        <form className="admin-form-grid" onSubmit={save}>
          <Input
            label="id"
            required
            value={form.id}
            disabled={!!editing}
            onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
            error={errors.id}
            placeholder="ex: laboratoire"
          />
          <Input
            label="label"
            required
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            error={errors.label}
            placeholder="ex: Laboratoire"
          />
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
        open={!!deleting}
        title="Supprimer cette catégorie ?"
        message={deleting ? `Cette action supprimera "${deleting.label}" (id: ${deleting.id}).` : ''}
        onCancel={() => setDeleting(null)}
        onConfirm={deleteItem}
        loading={submitting}
      />
    </section>
  )
}

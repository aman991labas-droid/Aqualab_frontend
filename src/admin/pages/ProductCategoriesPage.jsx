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
import { productCategoryService } from '../services/productCategoryService'

const PAGE_SIZE = 8

export default function ProductCategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  // const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await productCategoryService.getProductCategories())
    } catch {
      setError('Impossible de charger les catégories produits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

const filtered = useMemo(() => {
  const q = query.toLowerCase()

  return items.filter((i) =>
    i.name.toLowerCase().includes(q)
  )
}, [items, query])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // const onSort = (key) => {
  //   setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
  // }

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

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Nom requis.'
    return next
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '' })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ name: row.name })
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
        await productCategoryService.updateProductCategory(editing.id, {
          name: form.name,
        })
        Toast.success('Catégorie produit mise à jour.')
      } else {
        await productCategoryService.createProductCategory({
          name: form.name,
        })
        Toast.success('Catégorie produit créée.')
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
          await productCategoryService.deleteProductCategory(id)
        }
        Toast.success('Catégories produits supprimées.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await productCategoryService.deleteProductCategory(deleting.id)
        Toast.success('Catégorie produit supprimée.')
        setDeleting(null)
      }
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
        <h1>Catégories produits</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Ajouter une catégorie produit
        </button>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher par nom..." />
      </FilterBar>

      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState title="Aucune catégorie produit" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              // { key: 'id', label: 'ID', sortable: true },
              // { key: 'label', label: 'Libellé' },
              { key: 'name', label: 'Libellé' },
            ]}
            rows={rows}
            // sortKey={sort.key}
            // sortDir={sort.dir}
            // onSort={onSort}
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
        title={editing ? 'Modifier la catégorie produit' : 'Ajouter une catégorie produit'}
      >
        <form className="admin-form-stack" onSubmit={save}>
          <Input
            label="Nom de la catégorie produit"
            required
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            error={errors.name}
            placeholder="Ex: Stéréomicroscopes Série M"
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
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer cette catégorie produit ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} catégorie(s).` : (deleting ? `Cette action supprimera "${deleting.name}".` : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={deleteItem}
        loading={submitting}
      />
    </section>
  )
}

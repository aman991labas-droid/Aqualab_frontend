'use client'

import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import FilterBar from '../components/ui/FilterBar'
import Modal from '../components/ui/Modal'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import Input from '../components/ui/Input'
import FormFileField from '../components/ui/FormFileField'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'
import { partnerService } from '../services/partnerService'
import { normalizePartnerLogoFile } from '../utils/compressImage'

const PAGE_SIZE = 8

const emptyForm = {
  name: '',
  specialty: '',
  url: '',
  logo: '',
  sortOrder: 0,
  preserveContrast: false,
  isActive: true,
}

export default function PartnersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  // const [sort, setSort] = useState({ key: 'sortOrder', dir: 'asc' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deletingMultiple, setDeletingMultiple] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await partnerService.getPartners())
    } catch {
      setError('Impossible de charger les partenaires.')
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
    (i) => i.name.toLowerCase().includes(q)
  )
  return list.sort((a, b) => {
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
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

  // const onSort = (key) => {
  //   setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
  // }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Nom requis.'
    if (!form.specialty.trim()) next.specialty = 'Spécialité requise.'
    return next
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, sortOrder: items.length })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      name: row.name,
      specialty: row.specialty,
      url: row.url ?? '',
      logo: row.logo ?? '',
      sortOrder: row.sortOrder ?? 0,
      preserveContrast: !!row.preserveContrast,
      isActive: row.isActive !== false,
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await normalizePartnerLogoFile(file)
      setForm((prev) => ({ ...prev, logo: base64 }))
    } catch {
      Toast.error('Erreur lors du chargement du logo.')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)

    setSubmitting(true)
    try {
      if (editing) {
        await partnerService.updatePartner(editing.id, form)
        Toast.success('Partenaire mis à jour.')
      } else {
        await partnerService.createPartner(form)
        Toast.success('Partenaire ajouté.')
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
          await partnerService.deletePartner(id)
        }
        Toast.success('Éléments supprimés.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        await partnerService.deletePartner(deleting.id)
        Toast.success('Élément supprimé.')
        setDeleting(null)
      }
      load()
      Toast.success('Partenaire supprimé.')
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
        <h1>Partenaires exclusifs</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Ajouter un partenaire
        </button>
      </div>

      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher par nom ou spécialité..." />
      </FilterBar>

      
      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState title="Aucun partenaire" />
      ) : (
        <>
          <DataTable
            selectable
            selectedIds={selectedIds}
            onSelect={onSelect}
            onSelectAll={onSelectAll}
            columns={[
              {
                key: 'logo',
                label: 'Logo',
                render: (_, row) =>
                  row.logo ? (
                    <img src={row.logo} alt={row.name} className="admin-image-preview admin-image-preview--logo" />
                  ) : (
                    '—'
                  ),
              },
              { key: 'name', label: 'Nom',  },
              { key: 'specialty', label: 'Spécialité',  },
              // { key: 'sortOrder', label: 'Ordre',  },
              {
                key: 'isActive',
                label: 'Actif',
                render: (_, row) => (row.isActive !== false ? 'Oui' : 'Non'),
              },
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
        title={editing ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
      >
        <form className="admin-form-grid" onSubmit={save}>
          <Input
            label="Nom"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            error={errors.name}
            placeholder="ex: Leica Microsystems"
          />
          <Input
            label="Spécialité"
            required
            value={form.specialty}
            onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
            error={errors.specialty}
            placeholder="ex: Microscopie"
          />
          <Input
            label="Site web"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
          />
          {/* <Input
            label="Ordre d'affichage"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
          /> */}
          <FormFileField
            label="Logo"
            accept="image/*"
            onChange={handleLogoUpload}
            preview={form.logo}
            previewClassName="admin-image-preview--logo"
          />
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.preserveContrast}
              onChange={(e) => setForm((p) => ({ ...p, preserveContrast: e.target.checked }))}
            />
            Préserver le contraste du logo (fond clair)
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Afficher sur la page d&apos;accueil
          </label>
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
        title={deletingMultiple ? "Supprimer la sélection ?" : "Supprimer ce partenaire ?"}
        message={deletingMultiple ? `Cette action supprimera ${selectedIds.length} élément(s).` : (deleting ? `Cette action supprimera "${deleting.name}".` : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}
        onConfirm={deleteItem}
        loading={submitting}
      />
    </section>
  )
}

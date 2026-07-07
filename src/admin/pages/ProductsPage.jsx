'use client'

import { useEffect, useMemo, useState } from 'react'
import { productService } from '../services/productService'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import Select from '../components/ui/Select'
import FilterBar from '../components/ui/FilterBar'
import Pagination from '../components/ui/Pagination'
import Modal from '../components/ui/Modal'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'
import { compressImageFile } from '../utils/compressImage'

const PAGE_SIZE = 8

// Helper function to turn "Stéréomicroscopes Série M!" into "stereomicroscopes-serie-m"
const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

const emptyForm = { 
  tabId: 'laboratoire', 
  title: '', 
  slug: '',
  metaTitle: '',
  metaDescription: '',
  groupImage: '',      
  groupImageAlt: '',   
  partner: '', 
  partnerLogo: '', 
  partnerLogoAlt: '', 
  items: [{ name: '', image: '', imageAlt: '', details: '' }] 
}

export default function ProductsPage() {
  const [tabs, setTabs] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tabFilter, setTabFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const load = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const { tabs: tabsData, groups } = await productService.getCategoriesBundle()
      setTabs(tabsData)
      setItems(groups)
    } catch {
      setError('Erreur de chargement du catalogue produits.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // CENTRAL SEO AUTOMATION ENGINE
  // Whenever the worker edits regular text, we reconstruct professional SEO data out of sight
  const updateSEOData = (updatedForm) => {
    const { title, partner, groupImage, partnerLogo, items } = updatedForm
    
    const slug = generateSlug(title)
    const metaTitle = title && partner ? `${title} - ${partner}` : title
    
    // Builds a natural Google snippet under 160 characters
    const metaDescription = title && partner 
      ? `Découvrez notre gamme de ${title} de la marque ${partner}. Matériel de laboratoire de haute qualité adapté à vos exigences professionnelles.`
      : ''

    const groupImageAlt = groupImage && title ? `Présentation visuelle de la gamme ${title}` : ''
    const partnerLogoAlt = partnerLogo && partner ? `Logo officiel de la marque ${partner}` : ''

    const optimizedItems = items.map(item => ({
      ...item,
      imageAlt: item.image && item.name ? `Photo de l'appareil ${item.name}` : ''
    }))

    return {
      ...updatedForm,
      slug,
      metaTitle,
      metaDescription,
      groupImageAlt,
      partnerLogoAlt,
      items: optimizedItems
    }
  }

  const handleFieldChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      return updateSEOData(next)
    })
  }

  const handleItemFieldChange = (index, field, value) => {
    setForm(prev => {
      const updatedItems = [...prev.items]
      updatedItems[index][field] = value
      const next = { ...prev, items: updatedItems }
      return updateSEOData(next)
    })
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items.filter((i) => {
      const byTab = tabFilter === 'all' || i.tabId === tabFilter
      const byText =
        i.title.toLowerCase().includes(q) ||
        i.partner.toLowerCase().includes(q) ||
        i.items.some((item) => (typeof item === 'string' ? item : item.name).toLowerCase().includes(q))
      return byTab && byText
    })
  }, [items, query, tabFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fileToBase64 = (file, options) => compressImageFile(file, options)

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const options = fieldName === 'partnerLogo'
          ? { maxWidth: 400, maxHeight: 400, quality: 0.85 }
          : { maxWidth: 1200, maxHeight: 800, quality: 0.82 }
        const base64 = await fileToBase64(file, options)
        setForm(prev => {
          const next = { ...prev, [fieldName]: base64 }
          return updateSEOData(next)
        })
      } catch {
        Toast.error("Erreur lors du chargement du fichier.")
      }
    }
  }

  const handleItemImageUpload = async (index, file) => {
    if (file) {
      try {
        const base64 = await fileToBase64(file, { maxWidth: 800, maxHeight: 800, quality: 0.82 })
        setForm(prev => {
          const updatedItems = [...prev.items]
          updatedItems[index]['image'] = base64
          const next = { ...prev, items: updatedItems }
          return updateSEOData(next)
        })
      } catch {
        Toast.error("Erreur lors du chargement de l'image.")
      }
    }
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Titre requis.'
    if (!form.partner.trim()) next.partner = 'Partenaire requis.'
    
    const itemErrors = form.items.map((item) => {
      const err = {}
      if (!item.name.trim()) err.name = 'Nom requis.'
      return err
    })
    
    if (itemErrors.some(err => Object.keys(err).length > 0)) {
      next.items = itemErrors
    }
    return next
  }

  const startCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, tabId: tabs[0]?.id || 'laboratoire' })
    setErrors({})
    setModalOpen(true)
  }

  const startEdit = (row) => {
    setEditing(row)
    setForm({
      tabId: row.tabId,
      title: row.title,
      slug: row.slug || generateSlug(row.title),
      metaTitle: row.metaTitle || '',
      metaDescription: row.metaDescription || '',
      groupImage: row.groupImage || '',
      groupImageAlt: row.groupImageAlt || '',
      partner: row.partner,
      partnerLogo: row.partnerLogo || '',
      partnerLogoAlt: row.partnerLogoAlt || '',
      items: row.items.map(item => typeof item === 'string'
        ? { name: item, image: '', imageAlt: '', details: '' }
        : { name: item.name ?? '', image: item.image ?? '', imageAlt: item.imageAlt ?? '', details: item.details ?? '' }),
    })
    setErrors({})
    setModalOpen(true)
  }

  const addItemField = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { name: '', image: '', imageAlt: '', details: '' }] }))
  }

  const removeItemField = (index) => {
    if (form.items.length === 1) return
    setForm(prev => {
      const updatedItems = prev.items.filter((_, i) => i !== index)
      const next = { ...prev, items: updatedItems }
      return updateSEOData(next)
    })
  }

  const save = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      return setErrors(nextErrors)
    }
    
    setSubmitting(true)
    try {
      if (editing) {
        await productService.updateCategoryGroup(editing.tabId, editing.categoryIndex, form, editing.slug)
        Toast.success('Catégorie produit mise à jour avec succès.')
      } else {
        await productService.createCategoryGroup(form)
        Toast.success('Catégorie produit créée avec succès.')
      }
      setModalOpen(false)
      await load({ silent: true })
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await productService.deleteCategoryGroup(deleting.tabId, deleting.categoryIndex, deleting.slug)
      Toast.success('Catégorie produit supprimée.')
      setDeleting(null)
      await load({ silent: true })
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
        <button className="btn btn-primary" onClick={startCreate}>
          Ajouter une catégorie produit
        </button>
      </div>
    
      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher..." />
        <Select
          value={tabFilter}
          onChange={(e) => setTabFilter(e.target.value)}
          options={[
            { value: 'all', label: 'Toutes les catégories principales' },
            ...tabs.map((t) => ({ value: t.id, label: t.label })),
          ]}
        />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title="Aucune catégorie produit" />
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'tabLabel', label: 'Catégorie principale' },
              { 
                key: 'title', 
                label: 'Titre',
                render: (v, row) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {row.groupImage && <img src={row.groupImage} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />}
                      <span style={{ fontWeight: '600' }}>{v}</span>
                    </div>
                    <small style={{ color: '#28a745', fontSize: '11px', fontWeight: '500' }}>🔗 /{row.slug}</small>
                  </div>
                )
              },
              { 
                key: 'partner', 
                label: 'Partenaire',
                render: (v, row) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {row.partnerLogo && <img src={row.partnerLogo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
                    <span>{v}</span>
                  </div>
                )
              },
              { key: 'items', label: 'Produits', render: (v) => v.length },
            ]}
            rows={rows.map((r) => ({ ...r, id: `${r.tabId}-${r.categoryIndex}` }))}
            sortKey="title"
            sortDir="asc"
            onSort={() => {}}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => startEdit(row)}>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la catégorie produit' : 'Ajouter une catégorie produit'}>
        <form className="admin-form-grid" onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Select
            label="Catégorie principale"
            value={form.tabId}
            onChange={(e) => handleFieldChange('tabId', e.target.value)}
            options={tabs.map((t) => ({ value: t.id, label: t.label }))}
          />
          
          <Input
            label="Nom de la catégorie produit"
            required
            placeholder="Ex: Stéréomicroscopes Série M"
            value={form.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={errors.title}
          />

          {/* Group Image Block */}
          <div style={{ background: '#f4f6f8', padding: '14px', borderRadius: '6px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '600' }}>Image principale de la catégorie</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'groupImage')}
              style={{ display: 'block', width: '100%' }}
            />
            {form.groupImage && (
              <img src={form.groupImage} alt="Preview" style={{ height: '60px', borderRadius: '4px', marginTop: '8px', objectFit: 'cover' }} />
            )}
          </div>
          
          {/* Partner Block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f9f9f9', padding: '14px', borderRadius: '6px' }}>
            <Input
              label="Marque / Partenaire"
              required
              placeholder="Leica Microsystems"
              value={form.partner}
              onChange={(e) => handleFieldChange('partner', e.target.value)}
              error={errors.partner}
            />
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>Logo du partenaire</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, 'partnerLogo')}
                style={{ display: 'block', width: '100%', padding: '6px 0' }}
              />
              {form.partnerLogo && (
                <img src={form.partnerLogo} alt="Preview" style={{ height: '30px', marginTop: '4px', objectFit: 'contain' }} />
              )}
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '5px 0' }} />
          
          {/* Products Dynamic Section */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block', fontSize: '16px' }}>Liste des modèles de produits</label>
            
            {form.items.map((item, index) => (
              <div key={index} style={{ borderLeft: '3px solid #007bff', paddingLeft: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500', fontSize: '14px', color: '#555' }}>Modèle #{index + 1}</span>
                  {form.items.length > 1 && (
                    <button 
                      type="button" 
                      style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                      onClick={() => removeItemField(index)}
                    >
                      Enlever ce produit
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Nom du modèle"
                    required
                    placeholder="Ex: Leica M60"
                    value={item.name}
                    onChange={(e) => handleItemFieldChange(index, 'name', e.target.value)}
                    error={errors.items?.[index]?.name}
                  />
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: '500' }}>Photo du modèle</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleItemImageUpload(index, e.target.files[0])}
                      style={{ display: 'block', width: '100%', padding: '6px 0' }}
                    />
                    {item.image && (
                      <img src={item.image} alt="Preview" style={{ height: '35px', marginTop: '4px', objectFit: 'contain' }} />
                    )}
                  </div>
                </div>

                <Textarea
                  label="Détails du modèle"
                  placeholder="Ex: Microscope stéréo avec grossissement 6.3x à 40x, éclairage LED..."
                  value={item.details ?? ''}
                  onChange={(e) => handleItemFieldChange(index, 'details', e.target.value)}
                  rows={3}
                />
              </div>
            ))}

            <button 
              type="button" 
              className="btn btn-outline-dark" 
              style={{ marginTop: '8px', width: '100%', borderStyle: 'dashed' }} 
              onClick={addItemField}
            >
              + Ajouter un autre modèle à ce groupe
            </button>
          </div>

          <div className="admin-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-outline-dark" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Enregistrer la catégorie produit'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={!!deleting}
        title="Supprimer cette catégorie produit ?"
        message={deleting ? `${deleting.title}` : ''}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
        loading={submitting}
      />
    </section>
  )
}
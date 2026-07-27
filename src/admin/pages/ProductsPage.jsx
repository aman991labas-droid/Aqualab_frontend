'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
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
import FormFileField from '../components/ui/FormFileField'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'
import { compressImageFile } from '../utils/compressImage'
import { categories } from '@/data/articles'

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
  tabId: '', 
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
  const [generatingDesc, setGeneratingDesc] = useState(false)

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
    const { title, partner, groupImage, partnerLogo, items, tabId } = updatedForm
    
    const slug = generateSlug(title)
    const metaTitle = title && partner ? `${title} - ${partner}`: tabId || ''     
    
    // Builds a natural Google snippet under 160 characters
    const metaDescription = title && partner 
      ? `Découvrez notre gamme de ${title} de la marque ${partner}. Matériel ${tabId} de haute qualité adapté à vos exigences professionnelles.`
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
    // if (!form.partner.trim()) next.partner = 'Partenaire requis.'
    
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

  const handleGenerateDescriptions = async () => {
    if (!form.title?.trim()) {
      Toast.error('Renseignez le nom de la catégorie produit.')
      return
    }
    if (!form.items.some((item) => item.name?.trim())) {
      Toast.error('Ajoutez au moins un modèle avec un nom.')
      return
    }

    setGeneratingDesc(true)
    try {
      const categoryLabel = tabs.find((t) => t.id === form.tabId)?.label
      const result = await productService.generateDescription({
        title: form.title,
        partner: form.partner,
        tabId: form.tabId,
        categoryLabel,
        items: form.items,
      })

      setForm((prev) => ({
        ...prev,
        metaTitle: result.seo_title || prev.metaTitle,
        metaDescription: result.seo_description || result.short_desc || prev.metaDescription,
        items: prev.items.map((item, index) => ({
          ...item,
          details: result.items?.[index]?.details || item.details,
        })),
      }))

      Toast.success(
        result.source === 'gemini'
          ? 'Descriptions générées avec Gemini.'
          : 'Descriptions générées automatiquement.'
      )
    } catch {
      Toast.error('Impossible de générer les descriptions.')
    } finally {
      setGeneratingDesc(false)
    }
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
        <form className="admin-form-stack" onSubmit={save}>
          
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

          <FormFileField
            label="Image principale de la catégorie"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'groupImage')}
            preview={form.groupImage}
          />

          <div className="admin-grid-2">
            <Input
              label="Marque / Partenaire"
              placeholder="Leica Microsystems"
              value={form.partner}
              onChange={(e) => handleFieldChange('partner', e.target.value)}
              error={errors.partner}
            />
            <FormFileField
              label="Logo du partenaire"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'partnerLogo')}
              preview={form.partnerLogo}
              previewClassName="admin-image-preview--logo"
            />
          </div>

          <div className="admin-ai-action">
            <button
              type="button"
              className="btn btn-sm btn-outline-dark"
              onClick={handleGenerateDescriptions}
              disabled={generatingDesc || !form.title?.trim()}
            >
              <Sparkles size={14} aria-hidden="true" />
              {generatingDesc ? 'Génération...' : 'Générer descriptions avec Gemini'}
            </button>
            <p className="admin-ai-action__hint">
              Rédige les détails des modèles et le texte SEO. Gratuit avec la clé Gemini (aistudio.google.com).
            </p>
          </div>

          <hr className="admin-form-divider" />
          
          <div>
            <label className="admin-form-section-title">Liste des modèles de produits</label>
            
            {form.items.map((item, index) => (
              <div key={index} className="admin-product-item">
                <div className="admin-product-item__header">
                  <span className="admin-product-item__title">Modèle #{index + 1}</span>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      className="admin-form-remove-btn"
                      onClick={() => removeItemField(index)}
                    >
                      Enlever ce produit
                    </button>
                  )}
                </div>

                <div className="admin-grid-2">
                  <Input
                    label="Nom du modèle"
                    required
                    placeholder="Ex: Leica M60"
                    value={item.name}
                    onChange={(e) => handleItemFieldChange(index, 'name', e.target.value)}
                    error={errors.items?.[index]?.name}
                  />
                  <FormFileField
                    label="Photo du modèle"
                    accept="image/*"
                    onChange={(e) => handleItemImageUpload(index, e.target.files?.[0])}
                    preview={item.image}
                    previewClassName="admin-image-preview--model"
                  />
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
              className="btn btn-outline-dark admin-form-add-btn"
              onClick={addItemField}
            >
              + Ajouter un autre modèle à ce groupe
            </button>
          </div>

          <div className="admin-actions">
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
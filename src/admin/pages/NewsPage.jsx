'use client'

import { useEffect, useMemo, useState } from 'react'
import { newsService } from '../services/newsService'
import { categoryService } from '../services/categoryService'
import DataTable from '../components/ui/DataTable'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import FilterBar from '../components/ui/FilterBar'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import RichTextEditor from '../components/ui/RichTextEditor'
import ImageUpload from '../components/ui/ImageUpload'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import { Toast } from '../components/ui/Toast'

const PAGE_SIZE = 6

const emptyForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'laboratoire',
  image: '',
  author: { name: 'Equipe Aqualab', avatar: '/images/logo.png' },
  date: '',
  readTime: 5,
  featured: false,
}

function validateArticle(form) {
  const errors = {}
  if (!form.title?.trim()) errors.title = 'Titre requis.'
  if (!form.slug?.trim()) errors.slug = 'Slug requis.'
  if (!form.excerpt?.trim()) errors.excerpt = 'Idée générale requise.'
  if (!form.content?.trim()) errors.content = 'Contenu requis.'
  if (!form.category) errors.category = 'Catégorie requise.'
  if (!form.image?.trim()) errors.image = 'Image requise.'
  if (!form.author?.name?.trim()) errors.authorName = 'Nom auteur requis.'
  if (!form.date) errors.date = 'Date requise.'
  if (!form.readTime || Number(form.readTime) < 1) errors.readTime = 'Durée de lecture requise.'
  return errors
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export default function NewsPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [previewImg, setPreviewImg] = useState('')
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [news, cats] = await Promise.all([
        newsService.getNews(),
        categoryService.getCategories(),
      ])
      setItems(news)
      setCategories(cats)
    } catch {
      setError('Erreur de chargement des actualités.')
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
      const byText = i.title.toLowerCase().includes(q) || (i.excerpt && i.excerpt.toLowerCase().includes(q))
      const byCategory = categoryFilter === 'all' || i.category === categoryFilter
      const byFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'yes' && i.featured) ||
        (featuredFilter === 'no' && !i.featured)
      return byText && byCategory && byFeatured
    })
  }, [items, query, categoryFilter, featuredFilter])

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const categoryLabel = (id) => categories.find((c) => c.id === id)?.label || id

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, category: categories[0]?.id || 'laboratoire' })
    setPreviewImg('')
    setPreviewAvatar('/images/logo.png')
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      image: item.image,
      author: { ...item.author },
      date: item.date,
      readTime: item.readTime,
      featured: item.featured,
    })
    setPreviewImg(item.image)
    setPreviewAvatar(item.author?.avatar || '/images/logo.png')
    setErrors({})
    setModalOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    const nextErrors = validateArticle(form)
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setSubmitting(true)
    try {
      if (editing) {
        await newsService.updateNews(editing.id, form)
        Toast.success('Article modifié.')
      } else {
        await newsService.createNews(form)
        Toast.success('Article créé.')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      Toast.error(err.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await newsService.deleteNews(deleting.id)
      Toast.success('Article supprimé.')
      setDeleting(null)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="admin-page">
      <div className="admin-page__head">
        <h1>Actualités</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          Nouvel actualité
        </button>
      </div>
      
      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher titre ou extrait..." />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: 'all', label: 'Toutes catégories' },
            ...categories.map((c) => ({ value: c.id, label: c.label })),
          ]}
        />
      </FilterBar>
      <div className="admin-filterbar admin-filterbar--single">
        <Select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          options={[
            { value: 'all', label: 'Tous les articles' },
            { value: 'yes', label: 'À la une' },
            { value: 'no', label: 'Non mis en avant' },
          ]}
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Aucun article" />
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'title', label: 'title' },
              { key: 'slug', label: 'slug' },
              { key: 'category', label: 'category', render: (v) => categoryLabel(v) },
              { key: 'date', label: 'date' },
              { key: 'readTime', label: 'readTime', render: (v) => `${v} min` },
              { key: 'featured', label: 'featured', render: (v) => (v ? 'Oui' : 'Non') },
              { key: 'author', label: 'author', render: (v) => v?.name },
            ]}
            rows={rows}
            sortKey="title"
            sortDir="asc"
            onSort={() => {}}
            actions={(row) => (
              <>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setPreviewOpen(row)}>
                  Aperçu
                </button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier l\'actualité' : 'Créer une actualité'} width="760px">
        <form className="admin-form-grid" onSubmit={save}>
          <Input label="title" required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} error={errors.title} />
          <Input label="slug" required value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} error={errors.slug} />
          <Textarea label="Idée générale" required value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} error={errors.excerpt} rows={3} />
          <RichTextEditor label="content" required value={form.content} onChange={(value) => setForm((p) => ({ ...p, content: value }))} error={errors.content} />
          <Select
            label="category"
            required
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            options={categories.map((c) => ({ value: c.id, label: c.label }))}
            error={errors.category}
          />
          <ImageUpload
            preview={previewImg}
            onFileChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const dataUrl = await fileToBase64(file)
                setPreviewImg(dataUrl)
                setForm((p) => ({ ...p, image: dataUrl }))
              } catch {
                Toast.error("Erreur lors du chargement de l'image.")
              }
            }}
          />
          {errors.image && <span className="form-error">{errors.image}</span>}
          <div className="admin-grid-2">
            <Input label="author.name" required value={form.author.name} onChange={(e) => setForm((p) => ({ ...p, author: { ...p.author, name: e.target.value } }))} error={errors.authorName} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="admin-label">author.avatar</label>
              <ImageUpload
                preview={previewAvatar}
                onFileChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    const dataUrl = await fileToBase64(file)
                    setPreviewAvatar(dataUrl)
                    setForm((p) => ({ ...p, author: { ...p.author, avatar: dataUrl } }))
                  } catch {
                    Toast.error("Erreur lors du chargement de l'image.")
                  }
                }}
              />
            </div>
          </div>
          <div className="admin-grid-2">
            <Input label="date" type="date" required value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} error={errors.date} />
            <Input label="readTime (minutes)" type="number" min="1" required value={form.readTime} onChange={(e) => setForm((p) => ({ ...p, readTime: e.target.value }))} error={errors.readTime} />
          </div>
          <label className="admin-check">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            featured (à la une)
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

      <Modal open={!!previewOpen} onClose={() => setPreviewOpen(null)} title="Aperçu article">
        {previewOpen && (
          <div className="admin-preview">
            <h2>{previewOpen.title}</h2>
            <p>{previewOpen.excerpt}</p>
            {previewOpen.image && <img src={previewOpen.image} alt={previewOpen.title} className="admin-preview__img" />}
            <pre>{previewOpen.content}</pre>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        open={!!deleting}
        title="Supprimer cet article ?"
        message={deleting ? deleting.title : ''}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
        loading={submitting}
      />
    </section>
  )
}

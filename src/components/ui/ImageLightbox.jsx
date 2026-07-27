'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import './ImageLightbox.css'

function buildGallery(images, src, alt) {
  if (Array.isArray(images) && images.length > 0) {
    return images.filter((img) => img?.url)
  }
  if (src) return [{ url: src, alt: alt ?? '' }]
  return []
}

export default function ImageLightbox({
  open,
  onClose,
  src,
  alt,
  caption,
  images,
  initialIndex = 0,
}) {
  const gallery = useMemo(() => buildGallery(images, src, alt), [images, src, alt])
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && gallery.length > 1) {
        setIndex((i) => (i - 1 + gallery.length) % gallery.length)
      }
      if (event.key === 'ArrowRight' && gallery.length > 1) {
        setIndex((i) => (i + 1) % gallery.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, gallery.length])

  if (!open || gallery.length === 0) return null

  const current = gallery[index] ?? gallery[0]
  const hasMultiple = gallery.length > 1

  const goPrev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length)
  const goNext = () => setIndex((i) => (i + 1) % gallery.length)

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || caption || 'Agrandir l\'image'}
      onClick={onClose}
    >
      <button
        type="button"
        className="image-lightbox__close"
        onClick={onClose}
        aria-label="Fermer l'image agrandie"
      >
        <X size={22} />
      </button>

      {hasMultiple && (
        <button
          type="button"
          className="image-lightbox__nav image-lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          aria-label="Image précédente"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <figure className="image-lightbox__content" onClick={(event) => event.stopPropagation()}>
        <div className="image-lightbox__frame">
          <AppImage
            key={current.url}
            src={current.url}
            alt={current.alt || caption || ''}
            className="image-lightbox__img"
            width={1400}
            height={1050}
            sizes="(max-width: 1200px) 95vw, 1200px"
            priority
          />
        </div>

        {hasMultiple && (
          <div className="image-lightbox__thumbs" role="tablist" aria-label="Miniatures">
            {gallery.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1}`}
                className={`image-lightbox__thumb${i === index ? ' image-lightbox__thumb--active' : ''}`}
                onClick={() => setIndex(i)}
              >
                <AppImage src={img.url} alt="" width={64} height={48} sizes="64px" />
              </button>
            ))}
          </div>
        )}

        <figcaption className="image-lightbox__caption">
          {caption ? <span>{caption}</span> : null}
          {hasMultiple ? (
            <span className="image-lightbox__counter">{index + 1} / {gallery.length}</span>
          ) : null}
        </figcaption>
      </figure>

      {hasMultiple && (
        <button
          type="button"
          className="image-lightbox__nav image-lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          aria-label="Image suivante"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  )
}

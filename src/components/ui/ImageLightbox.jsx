'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import './ImageLightbox.css'

export default function ImageLightbox({ open, onClose, src, alt, caption }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || caption || 'Agrandir l\'image'}
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

      <figure className="image-lightbox__content" onClick={(event) => event.stopPropagation()}>
        <div className="image-lightbox__frame">
          <AppImage
            src={src}
            alt={alt || caption || ''}
            className="image-lightbox__img"
            width={1400}
            height={1050}
            sizes="(max-width: 1200px) 95vw, 1200px"
            priority
          />
        </div>
        {caption ? <figcaption className="image-lightbox__caption">{caption}</figcaption> : null}
      </figure>
    </div>
  )
}

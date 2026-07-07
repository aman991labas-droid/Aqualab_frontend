'use client'

import { useState } from 'react'
import { Package, ZoomIn } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { normalizeProductItem } from '@/lib/products'

export default function ProductItemCard({ item }) {
    const { name, image, imageAlt, details } = normalizeProductItem(item)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    return (
        <>
            <li className="products-detail__item-card">
                {image ? (
                    <button
                        type="button"
                        className="products-detail__item-card-media products-detail__item-card-media--clickable"
                        onClick={() => setLightboxOpen(true)}
                        aria-label={`Agrandir l'image de ${name}`}
                    >
                        <AppImage
                            src={image}
                            alt={imageAlt || name}
                            className="products-detail__item-card-img"
                            fill
                            sizes="(max-width: 768px) 100vw, 260px"
                            hideOnError
                            fallbackSrc={null}
                        />
                        <span className="products-detail__item-card-zoom" aria-hidden="true">
                            <ZoomIn size={18} />
                        </span>
                    </button>
                ) : (
                    <div className="products-detail__item-card-media">
                        <div className="products-detail__item-card-placeholder" aria-hidden="true">
                            <Package size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                )}
                <div className="products-detail__item-card-body">
                    <h4 className="products-detail__item-card-title">{name}</h4>
                    {details ? (
                        <p className="products-detail__item-card-details">{details}</p>
                    ) : null}
                </div>
            </li>

            <ImageLightbox
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                src={image}
                alt={imageAlt || name}
                caption={name}
            />
        </>
    )
}

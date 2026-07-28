'use client'

import { useState, useRef } from 'react'
import { Images, Package, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { normalizeProductItem } from '@/lib/products'

export default function ProductItemCard({ item }) {
    const { name, images, image, imageAlt, details } = normalizeProductItem(item)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const hasImages = images.length > 0
    const primary = images[activeIndex] ?? images[0]

    const openLightbox = (index = activeIndex) => {
        setActiveIndex(index)
        setLightboxOpen(true)
    }

    return (
        <>
            <li className="products-detail__item-card">
                {hasImages ? (
                    <div className="products-detail__item-card-gallery">
                        <button
                            type="button"
                            className="products-detail__item-card-media products-detail__item-card-media--clickable"
                            onClick={() => openLightbox(activeIndex)}
                            aria-label={`Agrandir l'image de ${name}`}
                        >
                            <AppImage
                                src={primary.url}
                                alt={primary.alt || imageAlt || name}
                                className="products-detail__item-card-img"
                                fill
                                sizes="(max-width: 768px) 100vw, 260px"
                                hideOnError
                                fallbackSrc={null}
                            />
                            <span className="products-detail__item-card-zoom" aria-hidden="true">
                                <ZoomIn size={18} />
                            </span>
                            {images.length > 1 && (
                                <span className="products-detail__item-card-count" aria-hidden="true">
                                    <Images size={14} />
                                    {images.length}
                                </span>
                            )}
                        </button>

                        {images.length > 1 && (
                            <div className="products-detail__item-card-thumbs-wrapper">
                                <button
                                    type="button"
                                    className="products-detail__item-card-thumbs-nav products-detail__item-card-thumbs-nav--prev"
                                    onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
                                    disabled={activeIndex === 0}
                                    aria-label="Photo précédente"
                                >
                                    <ChevronLeft size={14} />
                                </button>

                                <div className="products-detail__item-card-thumbs" role="tablist" aria-label={`Photos de ${name}`}>
                                    {images.map((img, index) => (
                                        <button
                                            key={`${img.url}-${index}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={index === activeIndex}
                                            aria-label={`Photo ${index + 1} de ${name}`}
                                            className={`products-detail__item-card-thumb${index === activeIndex ? ' products-detail__item-card-thumb--active' : ''}`}
                                            onClick={() => setActiveIndex(index)}
                                            onDoubleClick={() => openLightbox(index)}
                                        >
                                            <AppImage
                                                src={img.url}
                                                alt=""
                                                fill
                                                sizes="56px"
                                                hideOnError
                                                fallbackSrc={null}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="products-detail__item-card-thumbs-nav products-detail__item-card-thumbs-nav--next"
                                    onClick={() => setActiveIndex(i => Math.min(images.length - 1, i + 1))}
                                    disabled={activeIndex === images.length - 1}
                                    aria-label="Photo suivante"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
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
                images={images}
                src={image}
                alt={imageAlt || name}
                caption={name}
                initialIndex={activeIndex}
            />
        </>
    )
}

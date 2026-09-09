'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Images, Package, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import AppImage from '@/components/ui/AppImage'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { normalizeProductItem } from '@/lib/products'

export default function ProductItemCard({ item, id }) {
    const { name, images, image, imageAlt, details } = normalizeProductItem(item)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const thumbsRef = useRef(null)

    const hasImages = images.length > 0
    const hasMultiple = images.length > 1
    const primary = images[activeIndex] ?? images[0]

    const goTo = useCallback((index) => {
        setActiveIndex((index + images.length) % images.length)
    }, [images.length])

    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

    const openLightbox = (index = activeIndex) => {
        setActiveIndex(index)
        setLightboxOpen(true)
    }

    useEffect(() => {
        const strip = thumbsRef.current
        if (!strip) return
        const active = strip.querySelector('.products-detail__item-card-thumb--active')
        active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, [activeIndex])

    const scrollThumbs = (direction) => {
        const strip = thumbsRef.current
        if (!strip) return
        strip.scrollBy({ left: direction * 120, behavior: 'smooth' })
    }

    return (
        <>
            <li id={id} className="products-detail__item-card">
                {hasImages ? (
                    <div className="products-detail__item-card-gallery">
                        <div className="products-detail__item-card-stage">
                            <button
                                type="button"
                                className="products-detail__item-card-media products-detail__item-card-media--clickable"
                                onClick={() => openLightbox(activeIndex)}
                                aria-label={`Agrandir l'image de ${name}`}
                            >
                                <div key={activeIndex} className="products-detail__item-card-slide">
                                    <AppImage
                                        src={primary.url}
                                        alt={primary.alt || imageAlt || name}
                                        className="products-detail__item-card-img"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 260px"
                                        hideOnError
                                        fallbackSrc={null}
                                    />
                                </div>
                                <span className="products-detail__item-card-zoom" aria-hidden="true">
                                    <ZoomIn size={18} />
                                </span>
                                {hasMultiple && (
                                    <span className="products-detail__item-card-count" aria-hidden="true">
                                        <Images size={14} />
                                        {activeIndex + 1}/{images.length}
                                    </span>
                                )}
                            </button>

                            {hasMultiple && (
                                <>
                                    <button
                                        type="button"
                                        className="products-detail__item-card-arrow products-detail__item-card-arrow--prev"
                                        onClick={(e) => { e.stopPropagation(); goPrev() }}
                                        aria-label="Photo précédente"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className="products-detail__item-card-arrow products-detail__item-card-arrow--next"
                                        onClick={(e) => { e.stopPropagation(); goNext() }}
                                        aria-label="Photo suivante"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {hasMultiple && (
                            <div className="products-detail__item-card-rail">
                                <div className="products-detail__item-card-progress" aria-hidden="true">
                                    {images.map((_, index) => (
                                        <button
                                            key={`seg-${index}`}
                                            type="button"
                                            className={`products-detail__item-card-progress-seg${index === activeIndex ? ' products-detail__item-card-progress-seg--active' : ''}${index < activeIndex ? ' products-detail__item-card-progress-seg--past' : ''}`}
                                            onClick={() => setActiveIndex(index)}
                                            aria-label={`Photo ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className="products-detail__item-card-strip">
                                    <button
                                        type="button"
                                        className="products-detail__item-card-strip-btn"
                                        onClick={() => scrollThumbs(-1)}
                                        aria-label="Défiler les miniatures vers la gauche"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <div
                                        className="products-detail__item-card-thumbs"
                                        ref={thumbsRef}
                                        role="tablist"
                                        aria-label={`Photos de ${name}`}
                                    >
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
                                                <span className="products-detail__item-card-thumb-frame">
                                                    <AppImage
                                                        src={img.url}
                                                        alt=""
                                                        fill
                                                        sizes="64px"
                                                        hideOnError
                                                        fallbackSrc={null}
                                                    />
                                                </span>
                                                {index === activeIndex && (
                                                    <span className="products-detail__item-card-thumb-ring" aria-hidden="true" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="products-detail__item-card-strip-btn"
                                        onClick={() => scrollThumbs(1)}
                                        aria-label="Défiler les miniatures vers la droite"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
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

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { isExternalMediaUrl, resolveMediaUrl } from '@/lib/media'

const DEFAULT_FALLBACK = '/images/blog/default.jpg'

/**
 * next/image wrapper with optional fallback and hide-on-error behavior.
 */
export default function AppImage({
    src,
    alt = '',
    className,
    width,
    height,
    fill,
    sizes,
    priority = false,
    loading,
    fallbackSrc = DEFAULT_FALLBACK,
    hideOnError = false,
    hideParentSelector,
    onError,
    unoptimized,
    ...rest
}) {
    const resolvedSrc = resolveMediaUrl(src)
    const [imgSrc, setImgSrc] = useState(resolvedSrc)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        setImgSrc(resolveMediaUrl(src))
        setHidden(false)
    }, [src])

    const handleError = (event) => {
        if (hideOnError || hideParentSelector) {
            if (hideParentSelector) {
                event.currentTarget.closest(hideParentSelector)?.style.setProperty('display', 'none')
            }
            setHidden(true)
        } else if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc)
        }

        onError?.(event)
    }

    if (hidden || !imgSrc) return null

    const useUnoptimized = unoptimized ?? isExternalMediaUrl(imgSrc)

    const imageProps = {
        src: imgSrc,
        alt,
        className,
        onError: handleError,
        priority,
        unoptimized: useUnoptimized,
        sizes: sizes ?? (fill ? '100vw' : undefined),
        ...rest,
    }

    if (fill) {
        return <Image {...imageProps} fill />
    }

    return (
        <Image
            {...imageProps}
            width={width}
            height={height}
            loading={priority ? undefined : (loading ?? 'lazy')}
        />
    )
}

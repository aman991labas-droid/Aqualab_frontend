'use client'

import AppImage from '@/components/ui/AppImage'
import './PartnerLogo.css'

const LOGO_SIZES = { sm: 32, md: 48, lg: 72 }

/**
 * Small partner brand logo — used on product pages.
 * Laravel: partner_logo URL from API.
 */
export default function PartnerLogo({ src, name, size = 'md' }) {
    if (!src) return null

    const dimension = LOGO_SIZES[size] ?? LOGO_SIZES.md

    return (
        <span className={`partner-logo partner-logo--${size}`} title={name}>
            <AppImage
                src={src}
                alt={name ? `Logo ${name}` : 'Logo partenaire'}
                className="partner-logo__img"
                width={dimension}
                height={dimension}
                sizes={`${dimension}px`}
                hideParentSelector=".partner-logo"
                fallbackSrc={null}
            />
        </span>
    )
}

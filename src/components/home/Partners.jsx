'use client'

import { useState } from 'react'
import AppImage from '@/components/ui/AppImage'
import { FadeUp } from '@/components/ui/Animations'
import './Partners.css'

const defaultPartners = [
    { name: 'Leica Microsystems', specialty: 'Microscopie', logo: '/images/partners/leica_logo.png', url: 'https://www.leica-microsystems.com/' },
    { name: 'Tinius Olsen', specialty: 'Essais mécaniques', logo: '/images/partners/to_logo.png', url: 'https://www.tiniusolsen.com/' },
    { name: 'Metkon', specialty: 'Métallographie', logo: '/images/partners/metkon_logo.png', url: 'https://www.metkon.com/' },
    { name: 'Vogel Germany', specialty: 'Métrologie', logo: '/images/partners/vogel_logo.png', url: 'https://www.vogel.de/' },
    { name: 'Climats', specialty: 'Simulation climatique', logo: '/images/partners/climats_logo.png', url: 'https://www.climats.com/' },
    { name: 'Desco', specialty: 'Automatisation industrielle', logo: '/images/partners/desco_logo.png', url: 'https://www.desco.com/' },
    { name: 'Fetefilter', specialty: 'Filtration', logo: '/images/partners/fetefilter_logo.png', url: 'https://www.fetefilter.com/' },
    { name: 'Vaisala', specialty: 'Météorologie', logo: '/images/partners/vaisala_logo.png', url: 'https://www.vaisala.com/' },
    { name: 'Baltimore Aircoil Company', specialty: 'Refroidissement industriel', logo: '/images/partners/bac_logo.png', url: 'https://www.baltimoreaircoil.com/', preserveContrast: true },
]

function PartnerLogoItem({ partner }) {
    const [logoFailed, setLogoFailed] = useState(false)
    const href = partner.url || '#'

    return (
        <div className="partners__logo-box">
            <a
                className="partners__logo-link"
                href={href}
                target={partner.url ? '_blank' : undefined}
                rel={partner.url ? 'noopener noreferrer' : undefined}
                aria-label={`En savoir plus sur ${partner.name}`}
            >
                {logoFailed ? (
                    <div className="partners__logo-fallback">
                        <span>{partner.name}</span>
                    </div>
                ) : (
                    <AppImage
                        src={partner.logo}
                        alt={`${partner.name} – ${partner.specialty}`}
                        className={`partners__logo${partner.preserveContrast ? ' partners__logo--preserve' : ''}`}
                        fill
                        sizes="128px"
                        fallbackSrc={null}
                        hideOnError
                        onError={() => setLogoFailed(true)}
                    />
                )}
            </a>
        </div>
    )
}

export default function Partners({ partners = defaultPartners }) {
    const visiblePartners = (partners?.length ? partners : defaultPartners).filter(
        (partner) => partner.isActive !== false
    )

    if (visiblePartners.length === 0) return null

    const useMarquee = visiblePartners.length >= 5
    const displayPartners = useMarquee ? [...visiblePartners, ...visiblePartners] : visiblePartners

    return (
        <section className="partners section-py" aria-labelledby="partners-heading">
            <div className="container">
                <FadeUp>
                    <div className="text-center">
                        <span className="section-label">Partenaires exclusifs</span>
                        <h2 id="partners-heading" className="partners__title display-md">
                            Nos Partenaires <span className="gradient-text">Technologiques</span>
                        </h2>
                        <p className="partners__desc">
                            Distributeur exclusif de marques mondiales de référence en équipements scientifiques et industriels.
                        </p>
                    </div>
                </FadeUp>

                <div
                    className={`partners__track-wrap${useMarquee ? '' : ' partners__track-wrap--static'}`}
                    aria-label="Logos partenaires"
                >
                    <div className={`partners__track${useMarquee ? '' : ' partners__track--static'}`}>
                        {displayPartners.map((p, i) => (
                            <div key={`${p.id ?? p.name}-${i}`} className="partners__item" aria-label={p.name}>
                                <PartnerLogoItem partner={p} />
                                <span className="partners__specialty">{p.specialty}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

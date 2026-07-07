'use client'

import { Settings, Wrench, BookOpen, Headphones, Package, CheckCircle } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import CTABanner from '@/components/home/CTABanner'
import { PageTransition, FadeUp } from '@/components/ui/Animations'
import './Services.css'

const services = [
    {
        icon: Settings,
        title: 'Installation & Mise en service',
        desc: 'Notre équipe technique assure l\'installation complète et la mise en service de vos équipements selon les normes du fabricant.',
        details: [
            'Déballage et vérification des équipements',
            'Installation selon les spécifications techniques',
            'Calibration et réglage initial',
            'Tests de fonctionnement complets',
            'Remise de documentation technique',
        ],
    },
    {
        icon: Wrench,
        title: 'Maintenance & SAV',
        desc: 'Service après-vente réactif avec des techniciens certifiés pour la maintenance préventive et corrective.',
        details: [
            'Contrats de maintenance préventive',
            'Interventions correctives rapides',
            'Maintenance sur site ou en atelier',
            'Remplacement de pièces d\'origine',
            'Rapports d\'intervention détaillés',
        ],
    },
    {
        icon: BookOpen,
        title: 'Formation produit',
        desc: 'Formations personnalisées dispensées par nos experts en collaboration avec les fabricants.',
        details: [
            'Formations sur site ou en salle',
            'Sessions pratiques sur équipement réel',
            'Supports de formation fournis',
            'Attestation de formation délivrée',
            'Formations de remise à niveau',
        ],
    },
    {
        icon: Headphones,
        title: 'Assistance technique',
        desc: 'Support technique dédié disponible pour répondre à vos questions et vous guider.',
        details: [
            'Hotline technique dédiée',
            'Support par email et visio',
            'Télémaintenance sécurisée',
            'Guide de dépannage',
            'Accès à la documentation en ligne',
        ],
    },
    {
        icon: Package,
        title: 'Disponibilité de stock',
        desc: 'Stock permanent de consommables, pièces de rechange et équipements pour garantir la continuité.',
        details: [
            'Stock local de pièces détachées',
            'Consommables toujours disponibles',
            'Délais de livraison optimisés',
            'Gestion des commandes simplifiée',
            'Livraison express possible',
        ],
    },
]

const breadcrumbs = [{ label: 'Services' }]

export default function ServicesPage() {
    return (
        <PageTransition>
            <PageHero
                title="Nos Services"
                subtitle="Un accompagnement complet tout au long du cycle de vie de vos équipements."
                tag="Services & Support"
                breadcrumbs={breadcrumbs}
            />

            <section className="services-page section-py">
                <div className="container">
                    <div className="services-page__grid">
                        {services.map(({ icon: Icon, title, desc, details }, i) => (
                            <FadeUp key={title} delay={i * 0.1}>
                                <article className="service-card" aria-labelledby={`svc-${i}`}>
                                    <div className="service-card__header">
                                        <div className="service-card__icon" aria-hidden="true">
                                            <Icon size={28} />
                                        </div>
                                        <h2 id={`svc-${i}`} className="service-card__title">{title}</h2>
                                    </div>
                                    <p className="service-card__desc">{desc}</p>
                                    <ul className="service-card__list" aria-label={`Détails de ${title}`}>
                                        {details.map(d => (
                                            <li key={d} className="service-card__list-item">
                                                <CheckCircle size={16} className="service-card__check" aria-hidden="true" />
                                                <span>{d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner />
        </PageTransition>
    )
}

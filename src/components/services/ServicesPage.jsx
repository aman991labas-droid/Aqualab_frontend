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
        desc: 'Notre équipe technique assure l\'installation, la mise en service et la validation de vos équipements conformément aux recommandations des fabricants et aux normes en vigueur, afin de garantir des performances optimales dès leur mise en exploitation.',
        details: [
            'Déballage, contrôle et vérification des équipements à la réception',
            'Installation et intégration selon les spécifications techniques du fabricant',
            'Configuration, paramétrage, calibration et réglages initiaux',
            'Réalisation des essais, tests de fonctionnement et validation des performances',
            'Remise de la documentation technique et des rapports d\'intervention',
        ],
    },
    {
        icon: BookOpen,
        title: 'Formation à l\'utilisation des équipements',
        desc: 'Afin de garantir une prise en main rapide et une utilisation optimale des équipements fournis, AQUALAB assure des formations pratiques dispensées par ses ingénieurs, avec l\'appui de ses partenaires fabricants lorsque nécessaire.',
        details: [
            'Formation à l\'utilisation et au fonctionnement des équipements installés',
            'Sessions pratiques réalisées sur les équipements du client',
            'Présentation des bonnes pratiques d\'utilisation et de sécurité',
            'Conseils pour l\'entretien courant et l\'optimisation des performances',
            'Remise des supports d\'utilisation et de la documentation technique',
            'Délivrance d\'une attestation de formation sur demande'
        ],
    },
    {
        icon: Wrench,
        title: 'Maintenance & Service Après-Vente',
        desc: 'AQUALAB assure un service après-vente réactif et un accompagnement technique de proximité afin de garantir la disponibilité, la fiabilité et la performance de vos équipements tout au long de leur cycle de vie.',
        details: [
            'Contrats de maintenance préventive et plans d\'entretien personnalisés',
            'Interventions de maintenance corrective réalisées par des techniciens qualifiés',
            'Assistance technique sur site ou dans nos ateliers',
            'Diagnostic, dépannage et remise en service des équipements',
            'Fourniture et remplacement de pièces de rechange d\'origine',
            'Rapports d\'intervention détaillés et recommandations techniques'
        ],
    },
    {
        icon: Headphones,
        title: 'Assistance technique',
        desc: 'Notre équipe d\'experts vous accompagne au quotidien en vous apportant un support technique réactif pour assurer le bon fonctionnement de vos équipements et répondre à toutes vos demandes.',
        details: [
            'Assistance technique par téléphone, e-mail et visioconférence',
            'Diagnostic et résolution des incidents à distance lorsque cela est possible',
            'Téléassistance sécurisée pour les équipements compatibles',
            'Conseils d\'utilisation et accompagnement technique',
            'Aide au diagnostic et à l\'identification des pannes',
            'Accès à la documentation technique et aux manuels d\'utilisation'
        ],
    },
    {
        icon: Package,
        title: 'Gestion des consommables & stocks personnalisés',
        desc: 'AQUALAB met en place des solutions d\'approvisionnement adaptées à vos besoins afin de garantir la continuité de vos activités. Grâce à notre stock local et à nos services de gestion de stock personnalisé, nous assurons une disponibilité optimale de vos consommables et pièces de rechange.',
        details: [
            'Stock permanent de consommables et de pièces de rechange',
            'Mise en place de stocks personnalisés selon vos besoins de consommation',
            'Gestion des réapprovisionnements pour éviter toute rupture de stock',
            'Délais de livraison optimisés sur l\'ensemble du territoire',
            'Solutions logistiques adaptées aux demandes urgentes',
            'Réseau de partenaires internationaux garantissant un approvisionnement rapide'
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

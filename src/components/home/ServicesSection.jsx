'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Wrench, BookOpen, Headphones, Package, ChevronDown } from 'lucide-react'
import { FadeUp } from '@/components/ui/Animations'
import './ServicesSection.css'

const services = [
    {
        icon: Settings,
        title: 'Installation & Mise en service',
        desc: 'Notre équipe technique assure l\'installation complète et la mise en service de vos équipements selon les normes du fabricant. Nous vérifions chaque paramètre pour garantir un fonctionnement optimal dès le premier jour.',
    },
    {
        icon: Wrench,
        title: 'Maintenance & SAV',
        desc: 'Service après-vente réactif avec des techniciens certifiés pour la maintenance préventive et corrective. Interventions rapides sur site ou en atelier pour minimiser les temps d\'arrêt.',
    },
    {
        icon: BookOpen,
        title: 'Formation produit',
        desc: 'Formations personnalisées dispensées par nos experts en collaboration avec les fabricants. Maîtrisez vos équipements et optimisez leur utilisation avec des sessions pratiques adaptées à vos équipes.',
    },
    {
        icon: Headphones,
        title: 'Assistance technique',
        desc: 'Support technique dédié par téléphone, email ou télémaintenance. Notre équipe est disponible pour répondre à vos questions et vous guider dans l\'utilisation optimale de vos équipements.',
    },
    {
        icon: Package,
        title: 'Disponibilité de stock',
        desc: 'Stock permanent de consommables, pièces de rechange et équipements pour garantir la continuité de votre activité. Livraison rapide dans tout le Maroc.',
    },
]

function ServiceItem({ service, index }) {
    const [open, setOpen] = useState(index === 0)
    const Icon = service.icon

    return (
        <div className={`service-item ${open ? 'service-item--open' : ''}`}>
            <button
                type="button"
                className="service-item__header"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-controls={`service-content-${index}`}
                id={`service-btn-${index}`}
            >
                <span className="service-item__icon-wrap" aria-hidden="true">
                    <Icon size={20} />
                </span>
                <span className="service-item__title">{service.title}</span>
                <motion.span
                    className="service-item__chevron"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden="true"
                >
                    <ChevronDown size={18} />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={`service-content-${index}`}
                        role="region"
                        aria-labelledby={`service-btn-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="service-item__body-wrap"
                    >
                        <p className="service-item__body">{service.desc}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function ServicesSection() {
    return (
        <section className="services-section section-py" aria-labelledby="services-heading">
            <div className="container">
                <div className="services-section__grid">
                    <FadeUp>
                        <div className="services-section__left">
                            <span className="section-label">Ce que nous offrons</span>
                            <h2 id="services-heading" className="services-section__title display-md">
                                Des Services <span className="gradient-text">d'Excellence</span>
                            </h2>
                            <div className="divider" />
                            <p className="services-section__desc">
                                Au-delà de la simple fourniture d'équipements, Aqualab Technologie vous accompagne
                                tout au long du cycle de vie de vos matériels avec une gamme complète de services
                                techniques et de support.
                            </p>
                            <div className="services-section__badge-row">
                                <span className="badge badge-red">ISO 9001</span>
                                <span className="badge badge-red">+18 ans d'expertise</span>
                                <span className="badge badge-red">Techniciens certifiés</span>
                            </div>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.15}>
                        <div className="services-section__right">
                            {services.map((s, i) => (
                                <ServiceItem key={s.title} service={s} index={i} />
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </div>
        </section>
    )
}

'use client'

import { Shield, Award, Clock, Truck, Users, Globe } from 'lucide-react'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import './WhyUs.css'

const reasons = [
    { icon: Shield, title: 'Qualité garantie', desc: 'Uniquement des marques certifiées et reconnues mondialement.' },
    { icon: Award, title: 'Expertise reconnue', desc: 'Plus de 18 ans d\'expérience dans les secteurs industriel et scientifique.' },
    { icon: Clock, title: 'Réactivité SAV', desc: 'Techniciens certifiés disponibles pour des interventions rapides.' },
    { icon: Truck, title: 'Livraison nationale', desc: 'Stock permanent et livraison rapide dans tout le Maroc.' },
    { icon: Users, title: 'Équipe dédiée', desc: 'Une équipe de 32 experts passionnés à votre service.' },
    { icon: Globe, title: 'Partenariats exclusifs', desc: 'Distributeurs agréés des meilleures marques mondiales.' },
]

export default function WhyUs() {
    return (
        <section className="whyus section-py" aria-labelledby="whyus-heading">
            <div className="whyus__bg" aria-hidden="true" />

            <div className="container">
                <FadeUp>
                    <div className="text-center">
                        <span className="section-label">Pourquoi nous choisir</span>
                        <h2 id="whyus-heading" className="whyus__title display-md">
                            L'<span className="gradient-text">Excellence</span> à votre service
                        </h2>
                        <p className="whyus__subtitle">
                            Aqualab Technologie s'engage à fournir les meilleures solutions avec un service irréprochable.
                        </p>
                    </div>
                </FadeUp>

                <StaggerContainer className="whyus__grid">
                    {reasons.map(({ icon: Icon, title, desc }) => (
                        <StaggerItem key={title}>
                            <div className="whyus-card">
                                <div className="whyus-card__icon" aria-hidden="true">
                                    <Icon size={26} />
                                </div>
                                <h3 className="whyus-card__title">{title}</h3>
                                <p className="whyus-card__desc">{desc}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

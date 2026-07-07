'use client'

import { Target, Eye, Award, Globe } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import CTABanner from '@/components/home/CTABanner'
import { PageTransition, FadeUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import './About.css'

const timeline = [
    {
      year: '2006',
      title: 'Fondation',
      desc: "Création d'Aqualab Technologie S.A.R.L à Casablanca, avec pour mission la distribution d'équipements scientifiques de qualité au Maroc."
    },
    {
      year: '2010',
      title: 'Développement',
      desc: 'Extension du portefeuille produits et signature des premiers partenariats exclusifs avec des marques mondiales de référence.'
    },
    {
      year: '2015',
      title: 'Leader national',
      desc: "Aqualab devient un acteur majeur dans la distribution de matériels industriels et scientifiques au Maroc, répondant aux attentes des plus grandes industries."
    },
    {
      year: '2020',
      title: 'Expansion',
      desc: 'Augmentation de la capacité de stockage à 1200 m² et renforcement des équipes techniques pour répondre à la demande croissante.'
    },
    {
      year: '2026',
      title: 'Excellence continue',
      desc: "Plus de 32 experts, 62M DH de chiffre d'affaires et des partenariats exclusifs avec les meilleurs fabricants mondiaux. L'intégration de nouvelles technologies renforce notre leadership."
    },
    {
      year: '2031',
      title: "Garantir l'excellence et l'innovation",
      desc: "Nous continuerons à renforcer nos compétences techniques, à diversifier notre offre pour répondre aux besoins spécifiques du marché industriel et à élargir notre présence locale. Nous nous engageons à offrir des solutions sur mesure à nos clients, en intégrant les dernières avancées technologiques et en favorisant des relations clients solides et durables. Notre objectif est d'être un leader reconnu dans l'industrie, en offrant un service exceptionnel, des produits de qualité supérieure et une expertise inégalée."
    }
]

const values = [
    { icon: Target, title: 'Mission', desc: 'Fournir des solutions industrielles et scientifiques de haute qualité pour accompagner le développement du tissu industriel marocain.' },
    { icon: Eye, title: 'Vision', desc: 'Être le partenaire de référence en matière d\'équipements scientifiques et industriels au Maroc et en Afrique du Nord à l\'horizon 2030.' },
    { icon: Award, title: 'Valeurs', desc: 'Excellence, intégrité, réactivité et engagement client. Chaque décision est guidée par la satisfaction et la fidélité de nos partenaires.' },
    { icon: Globe, title: 'Portée', desc: 'Présents sur l\'ensemble du territoire marocain avec un réseau logistique optimisé pour garantir des délais de livraison compétitifs.' },
]

const breadcrumbs = [{ label: 'À Propos' }]

export default function AboutPage() {
    return (
        <PageTransition>
            <PageHero
                title="À Propos d'Aqualab"
                subtitle="Depuis 2006, nous transformons les défis industriels en opportunités de croissance pour nos clients."
                tag="Notre histoire"
                breadcrumbs={breadcrumbs}
            />

            <section className="about-intro section-py">
                <div className="container">
                    <div className="about-intro__grid">
                        <SlideInLeft>
                            <div>
                                <span className="section-label">Qui sommes-nous</span>
                                <h2 className="about-intro__title display-md">
                                    Votre partenaire de confiance <span className="gradient-text">depuis 2006</span>
                                </h2>
                                <div className="divider" />
                                <p>
                                    Aqualab Technologie est une société marocaine S.A.R.L spécialisée dans l'importation,
                                    la distribution et l'installation de matériels industriels, scientifiques et de laboratoire.
                                </p>
                                <p>
                                    Avec plus de 18 ans d'expérience, nous sommes devenus un acteur incontournable dans notre domaine au Maroc,
                                    en représentant exclusivement certaines des plus grandes marques mondiales.
                                </p>
                                <p>
                                    Notre équipe de 32 experts passionnés met tout en œuvre pour offrir à nos clients les meilleures
                                    solutions tecniques, adaptées à leurs besoins spécifiques.
                                </p>
                            </div>
                        </SlideInLeft>
                        <SlideInRight delay={0.15}>
                            <div className="about-intro__stats-box">
                                {[
                                    { label: 'Années d\'expertise', val: '18+' },
                                    { label: 'Employés experts', val: '32' },
                                    { label: 'Chiffre d\'affaires', val: '62M DH' },
                                    { label: 'Surface de stockage', val: '1200 m²' },
                                ].map(s => (
                                    <div key={s.label} className="about-stat">
                                        <strong>{s.val}</strong>
                                        <span>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </SlideInRight>
                    </div>
                </div>
            </section>

            <section className="about-values section-py">
                <div className="container">
                    <FadeUp>
                        <div className="text-center">
                            <span className="section-label">Ce qui nous guide</span>
                            <h2 className="display-md">Mission, Vision & <span className="gradient-text">Valeurs</span></h2>
                        </div>
                    </FadeUp>
                    <StaggerContainer className="about-values__grid">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <StaggerItem key={title}>
                                <div className="about-value-card">
                                    <div className="about-value-card__icon" aria-hidden="true"><Icon size={26} /></div>
                                    <h3>{title}</h3>
                                    <p>{desc}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            <section className="about-timeline section-py">
                <div className="container">
                    <FadeUp>
                        <div className="text-center">
                            <span className="section-label">Notre parcours</span>
                            <h2 className="display-md">Notre <span className="gradient-text">Timeline</span></h2>
                        </div>
                    </FadeUp>
                    <div className="timeline">
                        {timeline.map(({ year, title, desc }, i) => (
                            <FadeUp key={year} delay={i * 0.12}>
                                <div className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}>
                                    <div className="timeline-item__card">
                                        <span className="timeline-item__year">{year}</span>
                                        <h3 className="timeline-item__title">{title}</h3>
                                        <p className="timeline-item__desc">{desc}</p>
                                    </div>
                                    <div className="timeline-item__dot" aria-hidden="true" />
                                </div>
                            </FadeUp>
                        ))}
                        <div className="timeline__line" aria-hidden="true" />
                    </div>
                </div>
            </section>

            <CTABanner />
        </PageTransition>
    )
}

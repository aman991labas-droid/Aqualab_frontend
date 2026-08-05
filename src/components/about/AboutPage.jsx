'use client'

import { Target, Eye, Award, Globe } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'
import CTABanner from '@/components/home/CTABanner'
import { PageTransition, FadeUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import './About.css'

const timeline = [
    {
      year: '2010',
      title: 'Développement',
      desc: "Élargissement de notre offre de solutions et signature de nos premiers partenariats exclusifs avec des fabricants internationaux de renom, renforçant ainsi notre expertise et notre présence sur le marché marocain."
    },
    {
      year: '2015',
      title: 'Croissance',
      desc: "AQUALAB s'impose comme un partenaire de confiance des industriels, laboratoires et centres de recherche, en développant son expertise et en accompagnant les plus grands acteurs du marché marocain."
    },
    {
      year: '2019',
      title: 'Expansion',
      desc: "Renforcement de nos capacités opérationnelles avec l'extension de notre espace de stockage et le développement de nos équipes techniques, afin d'accompagner notre croissance et de répondre plus efficacement aux besoins de nos clients."
    },
    {
      year: '2026',
      title: 'Excellence continue',
      desc: "Forts de plus de 32 collaborateurs, d'un réseau de partenaires internationaux et d'une expertise reconnue depuis plus de 18 ans, nous poursuivons notre développement en intégrant continuellement de nouvelles technologies et en renforçant notre offre de solutions au service de nos clients."
    },
    {
      year: '2031',
      title: 'Innovation & Excellence',
      desc: "Poursuivre notre croissance en renforçant notre expertise technique, en développant des solutions toujours plus innovantes et en consolidant notre présence sur le marché. Notre ambition est de devenir le partenaire de référence en solutions industrielles, didactiques et de laboratoire, grâce à un service d'excellence, des technologies de pointe et un accompagnement durable de nos clients."
    }
]

const values = [
    { icon: Target, title: 'Mission', desc: 'Accompagner nos clients avec des solutions industrielles, didactiques et de laboratoire innovantes, en leur offrant un accompagnement complet, de l\'étude à la maintenance, pour garantir la performance, la fiabilité et la pérennité de leurs installations.' },
    { icon: Eye, title: 'Vision', desc: 'Être le partenaire de référence en solutions industrielles, didactiques et de laboratoire au Maroc, et un acteur reconnu en Afrique' },
    { icon: Award, title: 'Valeur', desc: 'Excellence, intégrité, réactivité, innovation et engagement client. Ces valeurs guident chacune de nos actions et reflètent notre volonté d\'offrir des solutions fiables, un accompagnement de proximité et un service de qualité, dans une relation de confiance durable avec nos clients et partenaires.' },
    { icon: Globe, title: 'Portée', desc: 'Présents sur l\'ensemble du territoire marocain, nous accompagnons nos clients grâce à une organisation logistique performante, garantissant des interventions rapides et des délais d\'approvisionnement optimisés.' },
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
                                    AQUALAB Technologie est une société marocaine spécialisée dans les solutions industrielles, scientifiques, didactiques et de laboratoire.
                                </p>
                                <p>
                                    Depuis plus de 18 ans, nous accompagnons les industriels, les laboratoires, les établissements d'enseignement et les centres de recherche dans la réalisation de leurs projets, en proposant des solutions complètes allant de l'étude et du conseil à la fourniture des équipements, l'installation, la mise en service, la formation, le service après-vente et la maintenance.
                                </p>
                                <p>
                                    Grâce à un réseau de partenaires internationaux et à la représentation exclusive de plusieurs marques de renommée mondiale, nous mettons à la disposition de nos clients des technologies innovantes, fiables et performantes. Forte d'une équipe de 32 collaborateurs qualifiés, AQUALAB s'engage à fournir un accompagnement technique de proximité, des solutions sur mesure et un service de qualité, répondant aux exigences les plus élevées de ses clients.
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

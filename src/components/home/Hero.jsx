'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import './Hero.css'

export default function Hero() {
    return (
        <section className="hero" aria-label="Section principale">
            <div className="hero__bg" aria-hidden="true">
                <Image
                    src="/ous.webp"
                    alt=""
                    className="hero__bg-img"
                    fill
                    priority
                    quality={70}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
                <div className="hero__overlay" />
            </div>

            <span className="hero__blob hero__blob--1" aria-hidden="true" />
            <span className="hero__blob hero__blob--2" aria-hidden="true" />
            <span className="hero__blob hero__blob--3" aria-hidden="true" />

            <div className="hero__particles" aria-hidden="true">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className={`hero__particle hero__particle--${i + 1}`} />
                ))}
            </div>

            <div className="container hero__inner">
                <div className="hero__content">
                    <motion.div
                        className="hero__label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="hero__label-dot" aria-hidden="true" />
                        Depuis 2006 — Casablanca, Maroc
                    </motion.div>

                    <motion.h1
                        className="hero__title"
                        initial={{ opacity: 1, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="hero__title-line">AQUALAB</span>
                        <span className="hero__title-line hero__title-accent">TECHNOLOGIE</span>
                    </motion.h1>

                    <motion.div
                        className="hero__subtitle"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <strong>Votre partenaire de confiance pour des solutions industrielles, didactiques, scientifiques et de laboratoire au Maroc.</strong>
                        <p>
                            AQUALAB vous accompagne à chaque étape de vos projets, de l'étude et du conseil jusqu'à la fourniture des équipements, l'installation, la mise en service, la formation, 
                            le service après-vente, la maintenance préventive et corrective, ainsi que le support technique. 
                            Nous proposons des solutions complètes, innovantes et sur mesure, parfaitement adaptées à vos exigences et 
                            aux enjeux de votre activité.
                        </p>
                    </motion.div>

                    <motion.div
                        className="hero__actions"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.65 }}
                    >
                        <Link href="/produits" className="btn btn-primary btn-lg hero__cta-primary">
                            Découvrez nos produits
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <Link href="/contact" className="btn btn-outline btn-lg">
                            Contactez-nous
                        </Link>
                    </motion.div>

                    <motion.div
                        className="hero__trust"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.85 }}
                    >
                        {[
                            { label: '+18 ans', desc: "d'expertise" },
                            { label: '62M DH', desc: "de chiffre d'affaire" },
                            { label: '32 experts', desc: 'à votre service' },
                        ].map(({ label, desc }) => (
                            <div key={label} className="hero__trust-item">
                                <strong>{label}</strong>
                                <span>{desc}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <motion.a
                href="#stats"
                className="hero__scroll-cue"
                aria-label="Défiler vers le bas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <ChevronDown size={22} />
            </motion.a>
        </section>
    )
}

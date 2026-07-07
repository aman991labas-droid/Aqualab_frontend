'use client'

import { motion } from 'framer-motion'
import Breadcrumb from '@/components/ui/Breadcrumb'
import './PageHero.css'

export default function PageHero({ title, subtitle, breadcrumbs = [], tag = null, bg = null }) {
    return (
        <section
            className="page-hero"
            style={bg ? { backgroundImage: `url(${bg})` } : {}}
            aria-label={`En-tête de la page ${title}`}
        >
            <span className="page-hero__blob page-hero__blob--1" aria-hidden="true" />
            <span className="page-hero__blob page-hero__blob--2" aria-hidden="true" />

            <div className="container page-hero__inner">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                >
                    {tag && <span className="section-label">{tag}</span>}
                    <h1 className="page-hero__title display-md">{title}</h1>
                    {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
                    {breadcrumbs.length > 0 && (
                        <div className="page-hero__bc">
                            <Breadcrumb items={breadcrumbs} />
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

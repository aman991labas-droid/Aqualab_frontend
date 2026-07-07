'use client'

import CountUpModule from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { Calendar, Building2, Warehouse, TrendingUp, Coins, Users } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/Animations'
import './Stats.css'

const CountUp = CountUpModule.default || CountUpModule

const stats = [
    { icon: Calendar, value: 2006, suffix: '', label: 'Année de Création', decimal: 0 },
    { icon: Building2, value: 'S.A.R.L', suffix: '', label: 'Forme Juridique', isText: true },
    { icon: Warehouse, value: 1200, suffix: ' M²', label: 'Surface de stockage', decimal: 0 },
    { icon: TrendingUp, value: 62, suffix: 'M DH', label: "Chiffre d'affaires", decimal: 0 },
    { icon: Coins, value: 2, suffix: 'M DH', label: 'Capital Social', decimal: 0 },
    { icon: Users, value: 32, suffix: '+', label: "Nombre d'employés", decimal: 0 },
]

function StatCard({ icon: Icon, value, suffix, label, decimal, isText, index }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

    return (
        <StaggerItem>
            <div className="stat-card" ref={ref}>
                <div className="stat-card__icon-wrap" aria-hidden="true">
                    <Icon size={24} className="stat-card__icon" />
                </div>
                <div className="stat-card__value" aria-label={`${isText ? value : value + suffix}`}>
                    {isText
                        ? <span>{value}</span>
                        : inView
                            ? <CountUp end={value} duration={2.4} decimals={decimal} suffix={suffix} delay={index * 0.1} />
                            : '0'
                    }
                </div>
                <p className="stat-card__label">{label}</p>
            </div>
        </StaggerItem>
    )
}

export default function Stats() {
    return (
        <section id="stats" className="stats section-py" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Chiffres clés d'Aqualab Technologie</h2>
            <div className="container">
                <StaggerContainer className="stats__grid">
                    {stats.map((s, i) => (
                        <StatCard key={s.label} {...s} index={i} />
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

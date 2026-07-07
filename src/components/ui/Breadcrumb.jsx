import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import './Breadcrumb.css'

export default function Breadcrumb({ items = [] }) {
    const allItems = [{ label: 'Accueil', path: '/' }, ...items]

    return (
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <ol className="breadcrumb__list">
                {allItems.map((item, i) => (
                    <li key={i} className="breadcrumb__item">
                        {i > 0 && (
                            <ChevronRight size={14} className="breadcrumb__sep" aria-hidden="true" />
                        )}
                        {i === 0 && <Home size={14} className="breadcrumb__home-icon" aria-hidden="true" />}
                        {item.path && i < allItems.length - 1 ? (
                            <Link href={item.path} className="breadcrumb__link">{item.label}</Link>
                        ) : (
                            <span className="breadcrumb__current" aria-current="page">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

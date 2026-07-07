'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { PageTransition, FadeUp } from '@/components/ui/Animations'

export default function NotFoundPage() {
    return (
        <PageTransition>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-subtle)',
                padding: '2rem',
            }}>
                <FadeUp>
                    <div style={{ textAlign: 'center', maxWidth: 480 }}>
                        <div style={{
                            fontSize: '7rem',
                            fontWeight: 900,
                            lineHeight: 1,
                            background: 'linear-gradient(135deg, var(--red-700), var(--red-400))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-display)',
                        }}>404</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Page introuvable
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                            La page que vous recherchez n'existe pas ou a été déplacée.
                            Retournez à l'accueil pour continuer votre navigation.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/" className="btn btn-primary btn-lg">
                                <Home size={18} aria-hidden="true" />
                                Accueil
                            </Link>
                            <button type="button" onClick={() => window.history.back()} className="btn btn-outline-dark btn-lg" aria-label="Retour à la page précédente">
                                <ArrowLeft size={18} aria-hidden="true" />
                                Retour
                            </button>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </PageTransition>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { unsubscribeNewsletter } from '@/services/api/newsletter'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('processing')
  const [errorType, setErrorType] = useState('generic')

  useEffect(() => {
    if (!token) {
      setErrorType('invalid')
      setStatus('error')
      return
    }

    let cancelled = false

    unsubscribeNewsletter(token)
      .then(() => {
        if (!cancelled) setStatus('success')
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorType(error?.status === 422 || error?.status === 404 ? 'invalid' : 'generic')
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="container section-py" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <h1 className="display-md" style={{ marginBottom: '1rem' }}>Désinscription newsletter</h1>

      {status === 'processing' && (
        <p role="status">Désinscription en cours...</p>
      )}

      {status === 'success' && (
        <p role="status" style={{ marginBottom: '2rem' }}>Vous avez été désinscrit de la newsletter.</p>
      )}

      {status === 'error' && (
        <p role="alert" style={{ marginBottom: '2rem', color: 'var(--red-600)' }}>
          {errorType === 'invalid'
            ? 'Lien de désinscription invalide ou déjà utilisé.'
            : 'Une erreur est survenue. Veuillez réessayer.'}
        </p>
      )}

      {status !== 'processing' && (
        <Link href="/" className="btn btn-primary">
          Retour à l&apos;accueil
        </Link>
      )}
    </div>
  )
}

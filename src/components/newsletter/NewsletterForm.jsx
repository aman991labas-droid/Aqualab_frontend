'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { subscribeNewsletter } from '@/services/api/newsletter'

export default function NewsletterForm({ className = '', inputClassName = 'form-input', buttonClassName = 'btn btn-primary w-full' }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const result = await subscribeNewsletter(email)
      toast.success(result?.message || 'Inscription réussie.')
      setEmail('')
    } catch (error) {
      toast.error(error?.message || 'Impossible de finaliser l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit} aria-label="Inscription newsletter">
      <input
        type="email"
        placeholder="votre@email.com"
        className={inputClassName}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={loading}
        aria-label="Votre email"
      />
      <button
        type="submit"
        className={buttonClassName}
        style={{ marginTop: '0.75rem' }}
        disabled={loading}
      >
        {loading ? 'Inscription...' : 'S\'abonner'}
      </button>
    </form>
  )
}

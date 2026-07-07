'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/admin/components/ui/Input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useAuth } from '@/admin/context/AuthContext'
import { Toast } from '@/admin/components/ui/Toast'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await forgotPassword(email)
      Toast.success(res.message)
    } catch (err) {
      Toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth">
      <ThemeToggle className="admin-auth__theme" />
      <form className="admin-auth__card" onSubmit={submit}>
        <h1>Mot de passe oublie</h1>
        <p>Entrez votre email pour recevoir un lien de reinitialisation (placeholder).</p>
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
        <Link href="/admin/login" className="admin-auth__link">
          Retour a la connexion
        </Link>
      </form>
    </div>
  )
}

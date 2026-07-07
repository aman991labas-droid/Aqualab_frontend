'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/admin/components/ui/Input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useAuth } from '@/admin/context/AuthContext'
import { Toast } from '@/admin/components/ui/Toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email requis.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Email invalide.'
    if (!form.password.trim()) next.password = 'Mot de passe requis.'
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setLoading(true)
    setErrors({})
    try {
      await login(form)
      Toast.success('Connexion reussie.')
      const from = searchParams.get('from') || '/admin/dashboard'
      router.replace(from)
    } catch (err) {
      Toast.error(err.message || 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth">
      <ThemeToggle className="admin-auth__theme" />
      <form className="admin-auth__card" onSubmit={submit}>
        <h1>Connexion Admin</h1>
        <Input
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          error={errors.email}
        />
        <Input
          label="Mot de passe"
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          error={errors.password}
        />
        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
          />
          Se souvenir de moi
        </label>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <Link href="/admin/forgot-password" className="admin-auth__link">
          Mot de passe oublie ?
        </Link>
      </form>
    </div>
  )
}

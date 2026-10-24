import { useEffect, type FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import {
  ADMIN_EMAIL,
  AUTH_CONSOLE_URL,
  OPEN_DATABASE_RULES,
  RULES_CONSOLE_URL,
} from '@/lib/adminConfig'

export function AdminLoginPage() {
  const { user, authReady, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (authReady && user) navigate('/admin', { replace: true })
  }, [authReady, navigate, user])

  if (authReady && user) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  async function copyRules() {
    await navigator.clipboard.writeText(OPEN_DATABASE_RULES)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8">
      <div className="glass relative w-full max-w-lg rounded-2xl p-6">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-white/45">
              DIGITAL ONE BOX
            </div>
            <h1 className="text-xl font-bold text-white">Admin Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label>
            <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Email</span>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Password</span>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-[12.5px] text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 space-y-2 text-[12px] leading-relaxed text-white/45">
          <p>
            Pehli baar: Firebase → Authentication → Sign-in method →{' '}
            <a className="text-violet-300 hover:underline" href={AUTH_CONSOLE_URL} target="_blank" rel="noreferrer">
              Email/Password enable
            </a>{' '}
            kijiye.
          </p>
          <p>
            Database rules bhi publish karni zaroori hain, warna admin data save nahi hoga.
          </p>
          <a className="text-violet-300 hover:underline" href={RULES_CONSOLE_URL} target="_blank" rel="noreferrer">
            Open Realtime Database Rules
          </a>
          <pre className="overflow-x-auto rounded-xl bg-black/40 p-3 font-mono text-[10.5px] text-violet-100">
            {OPEN_DATABASE_RULES}
          </pre>
          <button
            type="button"
            onClick={() => void copyRules()}
            className="rounded-xl border border-white/10 px-3 py-2 text-[12px] font-semibold text-white/70"
          >
            {copied ? 'Copied' : 'Copy rules'}
          </button>
        </div>
      </div>
    </div>
  )
}

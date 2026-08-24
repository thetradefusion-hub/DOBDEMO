import { Database } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import {
  parseFirebaseConfigText,
  saveStoredFirebaseConfig,
  type FirebaseWebConfig,
} from '@/lib/firebaseConfig'

export function FirebaseGate({ children }: { children: ReactNode }) {
  const { firebaseConfigured } = useApp()
  if (!firebaseConfigured) return <FirebaseSetupScreen />
  return children
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      {children}
    </div>
  )
}

function FirebaseSetupScreen() {
  const [paste, setPaste] = useState('')
  const [form, setForm] = useState<FirebaseWebConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  })
  const [error, setError] = useState('')

  function applyPaste() {
    const parsed = parseFirebaseConfigText(paste)
    if (!parsed) {
      setError('Config parse nahi hui. Firebase console wala object paste kijiye.')
      return
    }
    setForm(parsed)
    setError('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.apiKey || !form.projectId || !form.appId) {
      setError('apiKey, projectId aur appId zaroori hain.')
      return
    }
    saveStoredFirebaseConfig({
      ...form,
      authDomain: form.authDomain || `${form.projectId}.firebaseapp.com`,
      storageBucket: form.storageBucket || `${form.projectId}.appspot.com`,
    })
    window.location.reload()
  }

  return (
    <Shell>
      <div className="glass w-full max-w-2xl rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Connect Firebase</h1>
            <p className="text-[13px] text-white/50">
              Demo data Firebase Realtime Database mein save hoga.
            </p>
          </div>
        </div>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">
            Firebase config paste kijiye
          </span>
          <textarea
            className="field min-h-[120px] font-mono text-[12px]"
            placeholder={'const firebaseConfig = {\n  apiKey: "...",\n  projectId: "...",\n  appId: "..."\n}'}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={applyPaste}
          className="mb-5 rounded-xl border border-white/10 px-4 py-2 text-[12.5px] font-semibold text-white/80"
        >
          Parse config
        </button>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ['apiKey', 'API Key'],
              ['authDomain', 'Auth Domain'],
              ['projectId', 'Project ID'],
              ['storageBucket', 'Storage Bucket'],
              ['messagingSenderId', 'Messaging Sender ID'],
              ['appId', 'App ID'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className={key === 'apiKey' || key === 'appId' ? 'sm:col-span-2' : ''}>
              <span className="mb-1.5 block text-[12px] font-semibold text-white/60">{label}</span>
              <input
                className="field"
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                required={key === 'apiKey' || key === 'projectId' || key === 'appId'}
              />
            </label>
          ))}
          {error ? <p className="sm:col-span-2 text-[12.5px] text-rose-300">{error}</p> : null}
          <button
            type="submit"
            className="sm:col-span-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Save & Connect
          </button>
        </form>
      </div>
    </Shell>
  )
}

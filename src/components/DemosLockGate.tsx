import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { LockKeyhole } from 'lucide-react'
import {
  DEFAULT_DEMOS_LOCK,
  fetchDemosLockSettings,
  isDemosVaultUnlocked,
  markDemosVaultUnlocked,
  subscribeDemosLockSettings,
  verifyDemosVaultPassword,
  type DemosLockSettings,
} from '@/lib/vaultLock'
import { isFirebaseConfigured } from '@/lib/firebaseConfig'
import { initFirebase } from '@/lib/firebase'

interface DemosLockContextValue {
  ready: boolean
  enabled: boolean
  unlocked: boolean
  canViewVault: boolean
  passwordHash: string
  unlockWithPassword: (password: string) => Promise<boolean>
}

const DemosLockContext = createContext<DemosLockContextValue>({
  ready: true,
  enabled: false,
  unlocked: true,
  canViewVault: true,
  passwordHash: '',
  unlockWithPassword: async () => true,
})

export function useDemosLock() {
  return useContext(DemosLockContext)
}

export function DemosLockProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DemosLockSettings>(DEFAULT_DEMOS_LOCK)
  const [ready, setReady] = useState(!isFirebaseConfigured())
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true)
      setUnlocked(true)
      return
    }

    let unsub = () => {}
    ;(async () => {
      try {
        initFirebase()
        const current = await fetchDemosLockSettings()
        setSettings(current)
        setUnlocked(!current.enabled || isDemosVaultUnlocked(current.passwordHash))
        unsub = subscribeDemosLockSettings((next) => {
          setSettings(next)
          setUnlocked((prev) => {
            if (!next.enabled) return true
            if (prev && isDemosVaultUnlocked(next.passwordHash)) return true
            return isDemosVaultUnlocked(next.passwordHash)
          })
        })
      } catch {
        setUnlocked(true)
      } finally {
        setReady(true)
      }
    })()

    return () => unsub()
  }, [])

  const canViewVault = !settings.enabled || unlocked

  const unlockWithPassword = useCallback(async (password: string) => {
    const ok = await verifyDemosVaultPassword(password, settings.passwordHash)
    if (!ok) return false
    markDemosVaultUnlocked(settings.passwordHash)
    setUnlocked(true)
    return true
  }, [settings.passwordHash])

  const ctx = useMemo(
    () => ({
      ready,
      enabled: settings.enabled,
      unlocked,
      canViewVault,
      passwordHash: settings.passwordHash,
      unlockWithPassword,
    }),
    [ready, settings.enabled, settings.passwordHash, unlocked, canViewVault, unlockWithPassword],
  )

  return <DemosLockContext.Provider value={ctx}>{children}</DemosLockContext.Provider>
}

export function DemosLockScreen() {
  const { ready, canViewVault, unlockWithPassword } = useDemosLock()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-white/50">
        Checking vault access…
      </div>
    )
  }

  if (canViewVault) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const ok = await unlockWithPassword(password)
      if (!ok) {
        setError('Incorrect password. Try again.')
        return
      }
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="glass w-full rounded-2xl p-6 sm:p-8">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-white">Demo Vault Locked</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-white/50">
          Enter the vault password to view demos, credentials, and panel links.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left">
          <label>
            <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Password</span>
            <input
              className="field"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter vault password"
              required
            />
          </label>
          {error ? <p className="text-[12px] text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Unlocking…' : 'Unlock Demos'}
          </button>
        </form>
      </div>
    </div>
  )
}

/** Standalone gate used when provider is not already above. */
export function DemosLockGate({ children }: { children: ReactNode }) {
  return (
    <DemosLockProvider>
      <DemosLockGateBody>{children}</DemosLockGateBody>
    </DemosLockProvider>
  )
}

function DemosLockGateBody({ children }: { children: ReactNode }) {
  const { ready, canViewVault } = useDemosLock()
  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-white/50">
        Checking vault access…
      </div>
    )
  }
  if (!canViewVault) return <DemosLockScreen />
  return <>{children}</>
}

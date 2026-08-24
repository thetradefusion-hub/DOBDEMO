import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { AUTH_CONSOLE_URL, RULES_CONSOLE_URL } from '@/lib/adminConfig'
import { getEnvFirebaseConfig } from '@/lib/firebaseConfig'

export function AdminSettingsPage() {
  const { showToast, firebaseProjectId, firebaseConfigured } = useApp()
  const { user, seedDatabase } = useAuth()
  const [compactCards, setCompactCards] = useState(true)
  const [showInactive, setShowInactive] = useState(false)
  const [brandName, setBrandName] = useState('Digital One Box')
  const [seeding, setSeeding] = useState(false)
  const envConfigured = Boolean(getEnvFirebaseConfig())

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Vault data is stored in Firebase Realtime Database and syncs across devices.
        </p>
      </div>

      <div className="glass mb-4 max-w-xl rounded-2xl p-5">
        <div className="text-[12px] font-semibold tracking-wide text-white/40 uppercase">
          Firebase
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-semibold text-white">
              {firebaseConfigured ? 'Connected' : 'Not connected'}
            </div>
            <div className="text-[12px] text-white/45">
              {firebaseProjectId ? `Project: ${firebaseProjectId}` : 'No project linked'}
              {user?.email ? ` · ${user.email}` : ''}
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={AUTH_CONSOLE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-3 py-2 text-[12px] text-white/70"
          >
            Auth providers
          </a>
          <a
            href={RULES_CONSOLE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-3 py-2 text-[12px] text-white/70"
          >
            Database rules
          </a>
          <button
            type="button"
            disabled={seeding}
            onClick={async () => {
              setSeeding(true)
              try {
                const seeded = await seedDatabase()
                showToast(seeded ? 'Starter demos seeded to Firebase' : 'Database already has demos')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Seed failed', 'error')
              } finally {
                setSeeding(false)
              }
            }}
            className="rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
          >
            {seeding ? 'Seeding…' : 'Seed starter demos'}
          </button>
        </div>
        {envConfigured ? (
          <p className="mt-3 text-[12px] text-white/40">
            This app is using `.env.local` Firebase keys.
          </p>
        ) : null}
      </div>

      <div className="glass max-w-xl space-y-5 rounded-2xl p-5">
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Brand Name</span>
          <input className="field" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
        </label>

        <Toggle
          label="Compact demo cards"
          checked={compactCards}
          onChange={setCompactCards}
        />
        <Toggle
          label="Show inactive demos in vault"
          checked={showInactive}
          onChange={setShowInactive}
        />

        <button
          type="button"
          onClick={() => showToast('Settings saved locally')}
          className="rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] px-3 py-3"
    >
      <span className="text-[13px] text-white/80">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          checked ? 'bg-violet-500' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  )
}

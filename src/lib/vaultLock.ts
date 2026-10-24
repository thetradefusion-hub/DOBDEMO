import { get, onValue, ref, set } from 'firebase/database'
import { getDb } from '@/lib/firebase'

export interface DemosLockSettings {
  enabled: boolean
  /** SHA-256 hex of the vault password. Never store plaintext. */
  passwordHash: string
  updatedAt?: string
}

/** Uses categories path so existing RTDB rules (public read + auth write) apply. */
export const DEMOS_LOCK_PATH = 'categories/_demos_lock'
const SESSION_KEY = 'dob-demos-vault-unlocked'

export const DEFAULT_DEMOS_LOCK: DemosLockSettings = {
  enabled: false,
  passwordHash: '',
}

export function isDemosLockCategoryId(id: string | undefined | null) {
  return id === '_demos_lock'
}

export async function hashVaultPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password.trim())
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function parseSettings(value: unknown): DemosLockSettings {
  if (!value || typeof value !== 'object') return { ...DEFAULT_DEMOS_LOCK }
  const raw = value as Partial<DemosLockSettings>
  return {
    enabled: Boolean(raw.enabled),
    passwordHash: typeof raw.passwordHash === 'string' ? raw.passwordHash : '',
    updatedAt: raw.updatedAt,
  }
}

export async function fetchDemosLockSettings(): Promise<DemosLockSettings> {
  const snap = await get(ref(getDb(), DEMOS_LOCK_PATH))
  return parseSettings(snap.val())
}

export function subscribeDemosLockSettings(onChange: (settings: DemosLockSettings) => void) {
  return onValue(ref(getDb(), DEMOS_LOCK_PATH), (snap) => {
    onChange(parseSettings(snap.val()))
  })
}

export async function saveDemosLockSettings(input: {
  enabled: boolean
  password?: string
  existingHash?: string
}) {
  const passwordHash = input.password?.trim()
    ? await hashVaultPassword(input.password)
    : input.existingHash || ''

  if (input.enabled && !passwordHash) {
    throw new Error('Lock enable karne se pehle password set kijiye')
  }

  const payload = {
    id: '_demos_lock',
    // Keep category-shaped fields so list mappers never crash.
    label: '__system_demos_lock__',
    shortLabel: 'lock',
    accent: 'navy',
    description: 'System record for /demos screen lock',
    enabled: input.enabled,
    passwordHash,
    updatedAt: new Date().toISOString(),
  }

  await set(ref(getDb(), DEMOS_LOCK_PATH), payload)
  clearDemosVaultUnlock()
  return parseSettings(payload)
}

export function isDemosVaultUnlocked(passwordHash: string): boolean {
  if (!passwordHash) return false
  try {
    return sessionStorage.getItem(SESSION_KEY) === passwordHash
  } catch {
    return false
  }
}

export function markDemosVaultUnlocked(passwordHash: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, passwordHash)
  } catch {
    // Ignore private-mode failures; unlock still works for this render.
  }
}

export function clearDemosVaultUnlock() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore.
  }
}

export async function verifyDemosVaultPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (!passwordHash) return false
  const hashed = await hashVaultPassword(password)
  return hashed === passwordHash
}

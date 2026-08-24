const STORAGE_KEY = 'dob-demo-vault-v1'

export function loadJson<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<T>
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

export function loadStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function saveStringArray(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore.
  }
}

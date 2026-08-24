export interface FirebaseWebConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  databaseURL?: string
  measurementId?: string
}

const CONFIG_KEY = 'dob-firebase-web-config'

export function getEnvFirebaseConfig(): FirebaseWebConfig | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim()
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim()
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim()
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim()
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim()
  const appId = import.meta.env.VITE_FIREBASE_APP_ID?.trim()
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim()
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim()

  if (!apiKey || !projectId || !appId) return null

  return {
    apiKey,
    authDomain: authDomain || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: storageBucket || `${projectId}.appspot.com`,
    messagingSenderId: messagingSenderId || '',
    appId,
    databaseURL: databaseURL || undefined,
    measurementId: measurementId || undefined,
  }
}

export function getStoredFirebaseConfig(): FirebaseWebConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FirebaseWebConfig>
    if (!parsed.apiKey || !parsed.projectId || !parsed.appId) return null
    return parsed as FirebaseWebConfig
  } catch {
    return null
  }
}

export function saveStoredFirebaseConfig(config: FirebaseWebConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function clearStoredFirebaseConfig() {
  localStorage.removeItem(CONFIG_KEY)
}

export function getFirebaseConfig(): FirebaseWebConfig | null {
  return getEnvFirebaseConfig() ?? getStoredFirebaseConfig()
}

export function isFirebaseConfigured(): boolean {
  return Boolean(getFirebaseConfig())
}

export function parseFirebaseConfigText(input: string): FirebaseWebConfig | null {
  const source = input.trim()
  if (!source) return null

  const pick = (key: string) => {
    const match = source.match(new RegExp(`${key}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`, 'i'))
    return match?.[1]?.trim() ?? ''
  }

  try {
    const asJson = JSON.parse(source) as Partial<FirebaseWebConfig>
    if (asJson.apiKey && asJson.projectId && asJson.appId) {
      return {
        apiKey: asJson.apiKey,
        authDomain: asJson.authDomain || `${asJson.projectId}.firebaseapp.com`,
        projectId: asJson.projectId,
        storageBucket: asJson.storageBucket || `${asJson.projectId}.appspot.com`,
        messagingSenderId: asJson.messagingSenderId || '',
        appId: asJson.appId,
        databaseURL: asJson.databaseURL,
        measurementId: asJson.measurementId,
      }
    }
  } catch {
    // Fall through to object-literal parsing.
  }

  const apiKey = pick('apiKey')
  const projectId = pick('projectId')
  const appId = pick('appId')
  if (!apiKey || !projectId || !appId) return null

  return {
    apiKey,
    authDomain: pick('authDomain') || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: pick('storageBucket') || `${projectId}.appspot.com`,
    messagingSenderId: pick('messagingSenderId'),
    appId,
    databaseURL: pick('databaseURL') || undefined,
    measurementId: pick('measurementId') || undefined,
  }
}

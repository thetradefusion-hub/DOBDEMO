import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ADMIN_EMAIL } from '@/lib/adminConfig'
import { getFirebaseAuth, initFirebase } from '@/lib/firebase'
import { isFirebaseConfigured } from '@/lib/firebaseConfig'
import { seedVaultIfEmpty } from '@/lib/firestore'

interface AuthContextValue {
  user: User | null
  authReady: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  seedDatabase: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function authMessage(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('operation-not-allowed')) {
    return 'Firebase Authentication mein Email/Password enable kijiye.'
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Email ya password galat hai.'
  }
  if (code.includes('email-already-in-use')) {
    return 'Yeh admin account pehle se maujood hai. Sahi password se login kijiye.'
  }
  if (code.includes('weak-password')) {
    return 'Password kam se kam 6 characters ka hona chahiye.'
  }
  if (error instanceof Error) return error.message
  return 'Login failed'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured())

  useEffect(() => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const unsub = onAuthStateChanged(getFirebaseAuth(), (next) => {
      setUser(next)
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  const seedDatabase = useCallback(async () => {
    return seedVaultIfEmpty()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    initFirebase()
    const auth = getFirebaseAuth()
    const normalized = email.trim().toLowerCase()
    try {
      await signInWithEmailAndPassword(auth, normalized, password)
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
      const canCreate =
        normalized === ADMIN_EMAIL.toLowerCase() &&
        (code.includes('user-not-found') || code.includes('invalid-credential'))
      if (canCreate) {
        try {
          await createUserWithEmailAndPassword(auth, normalized, password)
        } catch (createError) {
          const createCode =
            typeof createError === 'object' && createError && 'code' in createError
              ? String(createError.code)
              : ''
          if (createCode.includes('email-already-in-use')) {
            throw new Error('Email ya password galat hai.')
          }
          throw new Error(authMessage(createError))
        }
      } else {
        throw new Error(authMessage(error))
      }
    }
    await seedVaultIfEmpty().catch(() => {
      // Rules may still be locked; admin can retry seed from settings.
    })
  }, [])

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth())
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authReady,
      isAdmin: Boolean(user),
      login,
      logout,
      seedDatabase,
    }),
    [authReady, login, logout, seedDatabase, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getDatabase, type Database } from 'firebase/database'
import { getFirebaseConfig } from '@/lib/firebaseConfig'

let app: FirebaseApp | null = null
let db: Database | null = null
let auth: Auth | null = null

export function initFirebase(): Database {
  if (db && auth) return db
  const config = getFirebaseConfig()
  if (!config) {
    throw new Error('Firebase is not configured')
  }
  app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    databaseURL: config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`,
  })
  db = getDatabase(app)
  auth = getAuth(app)
  return db
}

export function getDb(): Database {
  if (db) return db
  return initFirebase()
}

export function getFirebaseAuth(): Auth {
  if (!auth) initFirebase()
  if (!auth) throw new Error('Firebase Auth is not initialized')
  return auth
}

export function getFirebaseProjectId(): string | null {
  return getFirebaseConfig()?.projectId ?? null
}

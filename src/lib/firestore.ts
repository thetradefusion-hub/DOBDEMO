import {
  get,
  increment,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { INITIAL_CATEGORIES, INITIAL_DEMOS } from '@/data/mock'
import { getDb } from '@/lib/firebase'
import { loadJson } from '@/lib/storage'
import type { Category, Demo, DemoRequest, PersistedState } from '@/types'

const LOCAL_KEY_HINT = 'dob-demo-vault-v1'

export interface VaultState {
  favorites: string[]
  recentlyViewed: string[]
  seeded: boolean
}

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function asList<T extends { id: string }>(value: unknown): T[] {
  if (!value || typeof value !== 'object') return []
  return Object.entries(value as Record<string, T>).map(([id, item]) => ({
    ...item,
    id: item?.id || id,
  }))
}

export async function seedVaultIfEmpty(): Promise<boolean> {
  const db = getDb()
  const demosSnap = await get(ref(db, 'demos'))
  if (demosSnap.exists()) return false

  const local = loadJson<Partial<PersistedState>>({})
  const demos = local.demos?.length ? local.demos : INITIAL_DEMOS
  const categories = local.categories?.length ? local.categories : INITIAL_CATEGORIES

  await set(ref(db, 'demos'), Object.fromEntries(demos.map((item) => [item.id, clean(item)])))
  await set(
    ref(db, 'categories'),
    Object.fromEntries(categories.map((item) => [item.id, clean(item)])),
  )
  await set(ref(db, 'vault/state'), {
    seeded: true,
    seededAt: new Date().toISOString(),
  })

  try {
    localStorage.removeItem(LOCAL_KEY_HINT)
  } catch {
    // Ignore.
  }

  return true
}

export async function fetchVaultData() {
  const db = getDb()
  const [demosSnap, categoriesSnap] = await Promise.all([
    get(ref(db, 'demos')),
    get(ref(db, 'categories')),
  ])

  let requests: DemoRequest[] = []
  try {
    const requestsSnap = await get(ref(db, 'requests'))
    requests = asList<DemoRequest>(requestsSnap.val())
  } catch {
    requests = []
  }

  return {
    demos: asList<Demo>(demosSnap.val()),
    categories: asList<Category>(categoriesSnap.val()),
    requests,
    favorites: [] as string[],
    recentlyViewed: [] as string[],
  }
}

export function subscribeVaultData(handlers: {
  onDemos: (demos: Demo[]) => void
  onCategories: (categories: Category[]) => void
  onRequests: (requests: DemoRequest[]) => void
  onState: (state: Pick<VaultState, 'favorites' | 'recentlyViewed'>) => void
}) {
  const db = getDb()
  const unsubDemos = onValue(ref(db, 'demos'), (snap) => {
    handlers.onDemos(asList<Demo>(snap.val()))
  })
  const unsubCategories = onValue(ref(db, 'categories'), (snap) => {
    handlers.onCategories(asList<Category>(snap.val()))
  })
  const unsubRequests = onValue(
    ref(db, 'requests'),
    (snap) => {
      handlers.onRequests(asList<DemoRequest>(snap.val()))
    },
    () => {
      handlers.onRequests([])
    },
  )
  const unsubState = onValue(
    ref(db, 'vault/state'),
    (snap) => {
      const data = (snap.val() ?? {}) as Partial<VaultState>
      handlers.onState({
        favorites: data.favorites ?? [],
        recentlyViewed: data.recentlyViewed ?? [],
      })
    },
    () => {
      handlers.onState({ favorites: [], recentlyViewed: [] })
    },
  )

  return () => {
    unsubDemos()
    unsubCategories()
    unsubRequests()
    unsubState()
  }
}

export async function saveDemo(demo: Demo) {
  await set(ref(getDb(), `demos/${demo.id}`), clean(demo))
}

export async function removeDemo(id: string) {
  await remove(ref(getDb(), `demos/${id}`))
}

export async function incrementDemoViews(id: string) {
  await update(ref(getDb(), `demos/${id}`), { viewCount: increment(1) })
}

export async function patchDemo(id: string, patch: Partial<Demo>) {
  await update(ref(getDb(), `demos/${id}`), clean(patch))
}

export async function saveCategory(category: Category) {
  await set(ref(getDb(), `categories/${category.id}`), clean(category))
}

export async function removeCategory(id: string) {
  await remove(ref(getDb(), `categories/${id}`))
}

export async function saveRequest(request: DemoRequest) {
  await set(ref(getDb(), `requests/${request.id}`), clean(request))
}

export async function patchRequest(id: string, patch: Partial<DemoRequest>) {
  await update(ref(getDb(), `requests/${id}`), clean(patch))
}

export async function saveVaultState(
  state: Partial<Pick<VaultState, 'favorites' | 'recentlyViewed'>>,
) {
  await update(ref(getDb(), 'vault/state'), {
    seeded: true,
    ...state,
  })
}

import {
  get,
  increment,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import { INITIAL_LANDINGS } from '@/data/landings'
import { INITIAL_CATEGORIES, INITIAL_DEMOS } from '@/data/mock'
import { getDb } from '@/lib/firebase'
import { loadJson } from '@/lib/storage'
import { isDemosLockCategoryId } from '@/lib/vaultLock'
import type { Category, Demo, DemoRequest, PersistedState, ProductLanding } from '@/types'

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

function asCategories(value: unknown): Category[] {
  return asList<Category>(value).filter((item) => !isDemosLockCategoryId(item.id))
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
  await set(
    ref(db, 'landings'),
    Object.fromEntries(INITIAL_LANDINGS.map((item) => [item.id, clean(item)])),
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

/** Adds new seed demos/categories/landings without wiping existing vault data. */
export async function ensureLandingDemos(
  existingDemos: Demo[],
  existingCategories: Category[],
  existingLandings: ProductLanding[] = [],
) {
  const db = getDb()
  const missingDemos = INITIAL_DEMOS.filter(
    (seed) =>
      Boolean(seed.landingPageSlug) &&
      !existingDemos.some(
        (demo) => demo.id === seed.id || demo.landingPageSlug === seed.landingPageSlug,
      ),
  )
  const missingCategories = INITIAL_CATEGORIES.filter(
    (seed) => !existingCategories.some((category) => category.id === seed.id),
  )
  const missingLandings = INITIAL_LANDINGS.filter(
    (seed) =>
      !existingLandings.some((landing) => landing.id === seed.id || landing.slug === seed.slug),
  )

  const validAccents = new Set(['purple', 'cyan', 'pink', 'green', 'gold'])
  const accentPatches = existingCategories.flatMap((category) => {
    if (validAccents.has(category.accent)) return []
    const seed = INITIAL_CATEGORIES.find((item) => item.id === category.id)
    const accent = seed?.accent ?? 'purple'
    return [update(ref(db, `categories/${category.id}`), { accent })]
  })

  const mediaPatches = INITIAL_LANDINGS.flatMap((seed) => {
    const existing = existingLandings.find(
      (landing) => landing.id === seed.id || landing.slug === seed.slug,
    )
    if (!existing) return []
    const hasMedia = Array.isArray(existing.mediaItems) && existing.mediaItems.length > 0
    if (hasMedia) return []
    return [
      update(ref(db, `landings/${existing.id}`), {
        mediaItems: clean(seed.mediaItems),
        mediaSectionTitle: seed.mediaSectionTitle,
        mediaSectionSubtitle: seed.mediaSectionSubtitle,
      }),
    ]
  })

  const ctaPatches = INITIAL_LANDINGS.flatMap((seed) => {
    const existing = existingLandings.find(
      (landing) => landing.id === seed.id || landing.slug === seed.slug,
    )
    if (!existing) return []
    const isLegacyCta =
      existing.ctaTitle === 'Ready to present this product to your next client?' ||
      existing.ctaText ===
        'Share the live demo, collect requirements, and book a consultation with Digital One Box.'
    if (!isLegacyCta) return []
    return [
      update(ref(db, `landings/${existing.id}`), {
        ctaTitle: seed.ctaTitle,
        ctaText: seed.ctaText,
      }),
    ]
  })

  const featuresSubtitlePatches = INITIAL_LANDINGS.flatMap((seed) => {
    const existing = existingLandings.find(
      (landing) => landing.id === seed.id || landing.slug === seed.slug,
    )
    if (!existing) return []
    const legacySubtitle =
      'From token creation to payouts, the suite covers the operational layers buyers expect in a CodeCanyon-grade product showcase.'
    if (existing.featuresSubtitle !== legacySubtitle) return []
    return [
      update(ref(db, `landings/${existing.id}`), {
        featuresSubtitle: seed.featuresSubtitle ?? '',
      }),
    ]
  })

  const mediaSubtitlePatches = INITIAL_LANDINGS.flatMap((seed) => {
    const existing = existingLandings.find(
      (landing) => landing.id === seed.id || landing.slug === seed.slug,
    )
    if (!existing) return []
    const legacySubtitle =
      'Click a tab to preview that screen — image or video from YouTube, Google Drive, or any link.'
    if (existing.mediaSectionSubtitle !== legacySubtitle) return []
    return [
      update(ref(db, `landings/${existing.id}`), {
        mediaSectionSubtitle: seed.mediaSectionSubtitle ?? '',
        demoSectionSubtitle: seed.mediaSectionSubtitle ?? '',
      }),
    ]
  })

  await Promise.all([
    ...missingDemos.map((demo) => set(ref(db, `demos/${demo.id}`), clean(demo))),
    ...missingCategories.map((category) =>
      set(ref(db, `categories/${category.id}`), clean(category)),
    ),
    ...missingLandings.map((landing) => set(ref(db, `landings/${landing.id}`), clean(landing))),
    ...accentPatches,
    ...mediaPatches,
    ...ctaPatches,
    ...featuresSubtitlePatches,
    ...mediaSubtitlePatches,
  ])

  return {
    demos: missingDemos,
    categories: missingCategories,
    landings: missingLandings,
    patched: accentPatches.length > 0,
  }
}

export async function fetchVaultData() {
  const db = getDb()
  const [demosSnap, categoriesSnap, landingsSnap] = await Promise.all([
    get(ref(db, 'demos')),
    get(ref(db, 'categories')),
    get(ref(db, 'landings')),
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
    categories: asCategories(categoriesSnap.val()),
    landings: asList<ProductLanding>(landingsSnap.val()),
    requests,
    favorites: [] as string[],
    recentlyViewed: [] as string[],
  }
}

export function subscribeVaultData(handlers: {
  onDemos: (demos: Demo[]) => void
  onCategories: (categories: Category[]) => void
  onLandings: (landings: ProductLanding[]) => void
  onRequests: (requests: DemoRequest[]) => void
  onState: (state: Pick<VaultState, 'favorites' | 'recentlyViewed'>) => void
}) {
  const db = getDb()
  const unsubDemos = onValue(ref(db, 'demos'), (snap) => {
    handlers.onDemos(asList<Demo>(snap.val()))
  })
  const unsubCategories = onValue(ref(db, 'categories'), (snap) => {
    handlers.onCategories(asCategories(snap.val()))
  })
  const unsubLandings = onValue(
    ref(db, 'landings'),
    (snap) => {
      handlers.onLandings(asList<ProductLanding>(snap.val()))
    },
    () => {
      handlers.onLandings([])
    },
  )
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
    unsubLandings()
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

export async function saveLanding(landing: ProductLanding) {
  await set(ref(getDb(), `landings/${landing.id}`), clean(landing))
}

export async function removeLanding(id: string) {
  await remove(ref(getDb(), `landings/${id}`))
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

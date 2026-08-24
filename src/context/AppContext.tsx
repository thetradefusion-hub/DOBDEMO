import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { copyToClipboard, formatDemoDetails, uid } from '@/lib/utils'
import { getFirebaseProjectId, initFirebase } from '@/lib/firebase'
import { isFirebaseConfigured } from '@/lib/firebaseConfig'
import {
  fetchVaultData,
  incrementDemoViews,
  patchDemo,
  patchRequest,
  removeCategory,
  removeDemo,
  saveCategory,
  saveDemo,
  saveRequest,
  subscribeVaultData,
} from '@/lib/firestore'
import { loadStringArray, saveStringArray } from '@/lib/storage'
import type {
  Category,
  Demo,
  DemoRequest,
  RequestStatus,
  SortOption,
  ToastItem,
  ViewMode,
} from '@/types'

interface AppContextValue {
  firebaseConfigured: boolean
  firebaseProjectId: string | null
  dataReady: boolean
  dataError: string | null
  demos: Demo[]
  categories: Category[]
  favorites: string[]
  recentlyViewed: string[]
  requests: DemoRequest[]
  searchQuery: string
  activeCategory: string
  sortBy: SortOption
  viewMode: ViewMode
  sidebarOpen: boolean
  requestModalOpen: boolean
  toasts: ToastItem[]
  setSearchQuery: (value: string) => void
  setActiveCategory: (value: string) => void
  setSortBy: (value: SortOption) => void
  setViewMode: (value: ViewMode) => void
  setSidebarOpen: (value: boolean) => void
  setRequestModalOpen: (value: boolean) => void
  showToast: (message: string, type?: ToastItem['type']) => void
  dismissToast: (id: string) => void
  getCategory: (id: string) => Category | undefined
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  openDemo: (demo: Demo, url?: string) => void
  copyField: (label: string, value: string) => Promise<void>
  copyDemoDetails: (demo: Demo) => Promise<void>
  copyVisibleDemos: (visible: Demo[]) => Promise<void>
  addRequest: (input: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => void
  upsertDemo: (demo: Demo) => void
  deleteDemo: (id: string) => void
  duplicateDemo: (id: string) => void
  toggleDemoActive: (id: string) => void
  toggleDemoFeatured: (id: string) => void
  upsertCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  updateRequestStatus: (id: string, status: RequestStatus) => void
  getVisibleDemos: (options?: {
    favoriteOnly?: boolean
    recentOnly?: boolean
    includeInactive?: boolean
  }) => Demo[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const firebaseConfigured = isFirebaseConfigured()
  const firebaseProjectId = getFirebaseProjectId()
  const [dataReady, setDataReady] = useState(!firebaseConfigured)
  const [dataError, setDataError] = useState<string | null>(null)
  const [demos, setDemos] = useState<Demo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [favorites, setFavorites] = useState<string[]>(() => loadStringArray('dob-favorites'))
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    loadStringArray('dob-recently-viewed'),
  )
  const [requests, setRequests] = useState<DemoRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback(
    (message: string, type: ToastItem['type'] = 'success') => {
      const id = uid('toast')
      setToasts((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 2800)
    },
    [],
  )

  const persistError = useCallback(
    (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Firebase save failed'
      showToast(message, 'error')
    },
    [showToast],
  )

  useEffect(() => {
    if (!firebaseConfigured) return

    let unsub = () => {}
    let cancelled = false

    ;(async () => {
      try {
        initFirebase()
        const data = await fetchVaultData()
        if (cancelled) return
        setDemos(data.demos)
        setCategories(data.categories)
        setRequests(data.requests)
        setDataReady(true)
        unsub = subscribeVaultData({
          onDemos: setDemos,
          onCategories: setCategories,
          onRequests: setRequests,
          onState: () => {
            // Favorites / recently viewed stay on this device.
          },
        })
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof Error
            ? error.message
            : 'Firebase se data load nahi ho saka. Firestore enable kijiye aur rules check kijiye.'
        setDataError(message)
        setDataReady(true)
      }
    })()

    return () => {
      cancelled = true
      unsub()
    }
  }, [firebaseConfigured])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  )

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = favorites.includes(id)
        ? favorites.filter((item) => item !== id)
        : [...favorites, id]
      setFavorites(next)
      saveStringArray('dob-favorites', next)
      showToast(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites', favorites.includes(id) ? 'info' : 'success')
    },
    [favorites, showToast],
  )

  const openDemo = useCallback(
    (demo: Demo, url?: string) => {
      const target = url || demo.websiteUrl
      window.open(target, '_blank', 'noopener,noreferrer')
      const nextRecent = [demo.id, ...recentlyViewed.filter((id) => id !== demo.id)].slice(0, 12)
      setRecentlyViewed(nextRecent)
      saveStringArray('dob-recently-viewed', nextRecent)
      setDemos((prev) =>
        prev.map((item) =>
          item.id === demo.id ? { ...item, viewCount: item.viewCount + 1 } : item,
        ),
      )
      void incrementDemoViews(demo.id).catch(() => {
        // View count writes are optional for public visitors.
      })
    },
    [recentlyViewed],
  )

  const copyField = useCallback(
    async (label: string, value: string) => {
      const ok = await copyToClipboard(value)
      showToast(ok ? `${label} copied` : 'Unable to copy', ok ? 'success' : 'error')
    },
    [showToast],
  )

  const copyDemoDetails = useCallback(
    async (demo: Demo) => {
      const category = getCategory(demo.categoryId)?.label ?? demo.categoryId
      const ok = await copyToClipboard(
        formatDemoDetails({
          title: demo.title,
          category,
          websiteUrl: demo.websiteUrl,
          memberPanelUrl: demo.memberPanelUrl,
          adminPanelUrl: demo.adminPanelUrl,
          username: demo.username,
          password: demo.password,
        }),
      )
      showToast(
        ok ? 'Demo details copied successfully!' : 'Unable to copy demo details',
        ok ? 'success' : 'error',
      )
    },
    [getCategory, showToast],
  )

  const copyVisibleDemos = useCallback(
    async (visible: Demo[]) => {
      if (!visible.length) {
        showToast('No visible demos to copy', 'info')
        return
      }
      const payload = visible
        .map((demo, index) => {
          const category = getCategory(demo.categoryId)?.label ?? demo.categoryId
          return `${index + 1}. ${formatDemoDetails({
            title: demo.title,
            category,
            websiteUrl: demo.websiteUrl,
            memberPanelUrl: demo.memberPanelUrl,
            adminPanelUrl: demo.adminPanelUrl,
            username: demo.username,
            password: demo.password,
          })}`
        })
        .join('\n\n--------------------\n\n')
      const ok = await copyToClipboard(payload)
      showToast(
        ok ? 'Demo details copied successfully!' : 'Unable to copy visible demos',
        ok ? 'success' : 'error',
      )
    },
    [getCategory, showToast],
  )

  const addRequest = useCallback(
    (input: Omit<DemoRequest, 'id' | 'createdAt' | 'status'>) => {
      const next: DemoRequest = {
        ...input,
        id: uid('req'),
        createdAt: new Date().toISOString(),
        status: 'pending',
      }
      setRequests((prev) => [next, ...prev])
      showToast('Demo request submitted successfully!')
      void saveRequest(next).catch(persistError)
    },
    [persistError, showToast],
  )

  const upsertDemo = useCallback(
    (demo: Demo) => {
      const exists = demos.some((item) => item.id === demo.id)
      setDemos((prev) =>
        exists ? prev.map((item) => (item.id === demo.id ? demo : item)) : [demo, ...prev],
      )
      showToast(exists ? 'Demo updated' : 'Demo added')
      void saveDemo(demo).catch(persistError)
    },
    [demos, persistError, showToast],
  )

  const deleteDemo = useCallback(
    (id: string) => {
      setDemos((prev) => prev.filter((item) => item.id !== id))
      const nextFavorites = favorites.filter((item) => item !== id)
      const nextRecent = recentlyViewed.filter((item) => item !== id)
      setFavorites(nextFavorites)
      setRecentlyViewed(nextRecent)
      saveStringArray('dob-favorites', nextFavorites)
      saveStringArray('dob-recently-viewed', nextRecent)
      showToast('Demo deleted', 'info')
      void removeDemo(id).catch(persistError)
    },
    [favorites, persistError, recentlyViewed, showToast],
  )

  const duplicateDemo = useCallback(
    (id: string) => {
      const source = demos.find((item) => item.id === id)
      if (!source) return
      const copy: Demo = {
        ...source,
        id: uid('demo'),
        title: `${source.title} (Copy)`,
        createdAt: new Date().toISOString(),
        viewCount: 0,
      }
      setDemos((prev) => [copy, ...prev])
      showToast('Demo duplicated')
      void saveDemo(copy).catch(persistError)
    },
    [demos, persistError, showToast],
  )

  const toggleDemoActive = useCallback(
    (id: string) => {
      const current = demos.find((item) => item.id === id)
      if (!current) return
      const active = !current.active
      setDemos((prev) => prev.map((item) => (item.id === id ? { ...item, active } : item)))
      void patchDemo(id, { active }).catch(persistError)
    },
    [demos, persistError],
  )

  const toggleDemoFeatured = useCallback(
    (id: string) => {
      const current = demos.find((item) => item.id === id)
      if (!current) return
      const featured = !current.featured
      setDemos((prev) => prev.map((item) => (item.id === id ? { ...item, featured } : item)))
      void patchDemo(id, { featured }).catch(persistError)
    },
    [demos, persistError],
  )

  const upsertCategory = useCallback(
    (category: Category) => {
      const exists = categories.some((item) => item.id === category.id)
      setCategories((prev) =>
        exists
          ? prev.map((item) => (item.id === category.id ? category : item))
          : [...prev, category],
      )
      showToast(exists ? 'Category updated' : 'Category added')
      void saveCategory(category).catch(persistError)
    },
    [categories, persistError, showToast],
  )

  const deleteCategory = useCallback(
    (id: string) => {
      const used = demos.some((demo) => demo.categoryId === id)
      if (used) {
        showToast('Cannot delete a category that has demos', 'error')
        return
      }
      setCategories((prev) => prev.filter((item) => item.id !== id))
      showToast('Category deleted', 'info')
      void removeCategory(id).catch(persistError)
    },
    [demos, persistError, showToast],
  )

  const updateRequestStatus = useCallback(
    (id: string, status: RequestStatus) => {
      setRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      )
      void patchRequest(id, { status }).catch(persistError)
    },
    [persistError],
  )

  const getVisibleDemos = useCallback(
    (options?: {
      favoriteOnly?: boolean
      recentOnly?: boolean
      includeInactive?: boolean
    }) => {
      let list = options?.includeInactive ? demos : demos.filter((d) => d.active)

      if (options?.favoriteOnly) {
        list = list.filter((d) => favorites.includes(d.id))
      }

      if (options?.recentOnly) {
        list = recentlyViewed
          .map((id) => list.find((d) => d.id === id))
          .filter((d): d is Demo => Boolean(d))
      } else if (!options?.favoriteOnly && activeCategory !== 'all') {
        list = list.filter((d) => d.categoryId === activeCategory)
      }

      const q = searchQuery.trim().toLowerCase()
      if (q) {
        list = list.filter((d) => {
          const category = getCategory(d.categoryId)
          return (
            d.title.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            (category?.label ?? '').toLowerCase().includes(q) ||
            (category?.shortLabel ?? '').toLowerCase().includes(q)
          )
        })
      }

      if (!options?.recentOnly) {
        list = [...list].sort((a, b) => {
          if (sortBy === 'latest') return +new Date(b.createdAt) - +new Date(a.createdAt)
          if (sortBy === 'oldest') return +new Date(a.createdAt) - +new Date(b.createdAt)
          if (sortBy === 'most-viewed') return b.viewCount - a.viewCount
          return a.title.localeCompare(b.title)
        })
      }

      return list
    },
    [activeCategory, demos, favorites, getCategory, recentlyViewed, searchQuery, sortBy],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      firebaseConfigured,
      firebaseProjectId,
      dataReady,
      dataError,
      demos,
      categories,
      favorites,
      recentlyViewed,
      requests,
      searchQuery,
      activeCategory,
      sortBy,
      viewMode,
      sidebarOpen,
      requestModalOpen,
      toasts,
      setSearchQuery,
      setActiveCategory,
      setSortBy,
      setViewMode,
      setSidebarOpen,
      setRequestModalOpen,
      showToast,
      dismissToast,
      getCategory,
      isFavorite,
      toggleFavorite,
      openDemo,
      copyField,
      copyDemoDetails,
      copyVisibleDemos,
      addRequest,
      upsertDemo,
      deleteDemo,
      duplicateDemo,
      toggleDemoActive,
      toggleDemoFeatured,
      upsertCategory,
      deleteCategory,
      updateRequestStatus,
      getVisibleDemos,
    }),
    [
      activeCategory,
      addRequest,
      categories,
      copyDemoDetails,
      copyField,
      copyVisibleDemos,
      dataError,
      dataReady,
      deleteCategory,
      deleteDemo,
      demos,
      dismissToast,
      duplicateDemo,
      favorites,
      firebaseConfigured,
      firebaseProjectId,
      getCategory,
      getVisibleDemos,
      isFavorite,
      openDemo,
      recentlyViewed,
      requestModalOpen,
      requests,
      searchQuery,
      showToast,
      sidebarOpen,
      sortBy,
      toasts,
      toggleDemoActive,
      toggleDemoFeatured,
      toggleFavorite,
      upsertCategory,
      upsertDemo,
      updateRequestStatus,
      viewMode,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

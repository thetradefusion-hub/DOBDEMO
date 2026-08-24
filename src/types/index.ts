export type DemoCategoryId =
  | 'forex-mlm'
  | 'dapp'
  | 'binary-plan'
  | 'product-based'
  | string

export type AccentColor = 'purple' | 'cyan' | 'pink' | 'green' | 'gold'

export type SortOption = 'latest' | 'oldest' | 'most-viewed' | 'a-z'

export type ViewMode = 'grid' | 'list'

export type RequestStatus = 'pending' | 'reviewed' | 'completed'

export interface Category {
  id: string
  label: string
  shortLabel: string
  accent: AccentColor
  description: string
}

export interface Demo {
  id: string
  title: string
  categoryId: string
  description: string
  websiteUrl: string
  memberPanelUrl?: string
  adminPanelUrl?: string
  username: string
  password: string
  featured: boolean
  active: boolean
  viewCount: number
  createdAt: string
}

export interface DemoRequest {
  id: string
  name: string
  email: string
  company: string
  categoryId: string
  message: string
  createdAt: string
  status: RequestStatus
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

export interface PersistedState {
  demos: Demo[]
  categories: Category[]
  favorites: string[]
  recentlyViewed: string[]
  requests: DemoRequest[]
}

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
  /** Public CodeCanyon-style product page slug, e.g. "crypto-token-mlm" → /products/crypto-token-mlm */
  landingPageSlug?: string
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

export interface LandingFeature {
  title: string
  text: string
  accent: string
}

export interface LandingStat {
  value: string
  label: string
}

export interface LandingNetwork {
  id: string
  label: string
  short: string
}

export interface LandingTab {
  id: string
  label: string
}

export interface LandingScreenshot {
  id: string
  label: string
  tone: string
}

export type LandingMediaType = 'image' | 'video'

/** Screenshot image or video (YouTube, Drive, direct URL, etc.) */
export interface LandingMediaItem {
  id: string
  type: LandingMediaType
  title: string
  url: string
  thumbnailUrl?: string
}

export interface LandingWorkflowStep {
  step: string
  title: string
  text: string
}

export interface LandingTechItem {
  label: string
  role: string
}

export interface LandingFaq {
  q: string
  a: string
}

/** Admin-managed CodeCanyon-style product / service showcase page. */
export interface ProductLanding {
  id: string
  slug: string
  demoId?: string
  active: boolean
  brandLabel: string
  title: string
  titleAccent: string
  subtitle: string
  heroImageUrl: string
  heroChecks: string[]
  networks: LandingNetwork[]
  stats: LandingStat[]
  aboutTitle: string
  aboutParagraphs: string[]
  featuresTitle: string
  featuresSubtitle: string
  features: LandingFeature[]
  highlightsTitle: string
  highlights: string[]
  suitableTitle: string
  suitableFor: string[]
  /** @deprecated Use mediaSectionTitle */
  demoSectionTitle: string
  /** @deprecated Use mediaSectionSubtitle */
  demoSectionSubtitle: string
  /** @deprecated Use mediaItems */
  demoTabs?: LandingTab[]
  /** @deprecated Use mediaItems */
  screenshotsTitle?: string
  /** @deprecated Use mediaItems */
  screenshots?: LandingScreenshot[]
  mediaSectionTitle: string
  mediaSectionSubtitle: string
  mediaItems: LandingMediaItem[]
  workflowTitle: string
  workflowSubtitle: string
  workflow: LandingWorkflowStep[]
  techTitle: string
  techSubtitle: string
  techStack: LandingTechItem[]
  whyUsTitle: string
  whyUs: string[]
  faqsTitle: string
  faqsSubtitle: string
  faqs: LandingFaq[]
  formTitle: string
  formSubtitle: string
  ctaTitle: string
  ctaText: string
  updatedAt: string
}

export interface PersistedState {
  demos: Demo[]
  categories: Category[]
  favorites: string[]
  recentlyViewed: string[]
  requests: DemoRequest[]
  landings?: ProductLanding[]
}

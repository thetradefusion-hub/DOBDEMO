import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  CandlestickChart,
  Clock3,
  Gem,
  LayoutDashboard,
  Layers,
  Phone,
  PlusCircle,
  Share2,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { CONTACT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL, WHATSAPP_URL } from '@/data/mock'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, match: 'dashboard' },
  { to: '/demos', label: 'All Demos', icon: Layers, match: 'all' },
  { to: '/demos', label: 'Forex MLM', icon: CandlestickChart, category: 'forex-mlm' },
  { to: '/demos', label: 'DApp / Blockchain', icon: Box, category: 'dapp' },
  { to: '/demos', label: 'Binary Plan', icon: Share2, category: 'binary-plan' },
  { to: '/demos', label: 'Product Based', icon: ShoppingBag, category: 'product-based' },
  { to: '/favorites', label: 'Favorites', icon: Star, match: 'favorites' },
  { to: '/recently-viewed', label: 'Recently Viewed', icon: Clock3, match: 'recent' },
  { to: '/request-demo', label: 'Request New Demo', icon: PlusCircle, match: 'request' },
]

export function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeCategory,
    setActiveCategory,
    setSearchQuery,
    setRequestModalOpen,
    requestModalOpen,
    recentlyViewed,
    demos,
  } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  const recentDemos = recentlyViewed
    .slice(0, 3)
    .map((id) => demos.find((d) => d.id === id))
    .filter((d) => Boolean(d))

  function handleNav(item: (typeof nav)[number]) {
    if (item.category) {
      setActiveCategory(item.category)
      setSearchQuery('')
    } else if (item.match === 'all' || item.match === 'dashboard') {
      setActiveCategory('all')
    }
    setSidebarOpen(false)
  }

  function isActive(item: (typeof nav)[number]) {
    if (item.match === 'dashboard') return location.pathname === '/'
    if (item.match === 'all') return location.pathname === '/demos' && activeCategory === 'all'
    if (item.match === 'favorites') return location.pathname === '/favorites'
    if (item.match === 'recent') return location.pathname === '/recently-viewed'
    if (item.match === 'request') return requestModalOpen || location.pathname === '/request-demo'
    if (item.category) {
      return (
        (location.pathname === '/demos' || location.pathname === '/') &&
        activeCategory === item.category
      )
    }
    return false
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`glass fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-y-auto border-r border-white/8 p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="logo-mark">D</div>
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[0.08em] text-white">
                DIGITAL ONE BOX
              </div>
              <div className="text-[10px] font-semibold tracking-[0.22em] text-white/45">
                DEMO VAULT
              </div>
            </div>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
              active ? 'sidebar-active' : 'text-white/55 hover:bg-white/5 hover:text-white'
            }`

            if (item.match === 'request') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={className}
                  onClick={() => {
                    setRequestModalOpen(true)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            }

            return (
              <div key={item.label}>
                <NavLink to={item.to} onClick={() => handleNav(item)} className={className}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
                {item.match === 'recent' && recentDemos.length > 0 ? (
                  <div className="mt-1 ml-9 space-y-1">
                    {recentDemos.map((demo) =>
                      demo ? (
                        <button
                          key={demo.id}
                          type="button"
                          onClick={() => {
                            navigate('/recently-viewed')
                            setSidebarOpen(false)
                          }}
                          className="block w-full truncate rounded-lg px-2 py-1 text-left text-[11px] text-white/40 hover:text-white/80"
                        >
                          {demo.title}
                        </button>
                      ) : null,
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="mt-auto pt-5">
        <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-blue-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-white">
            <Gem className="h-4 w-4 text-violet-300" />
            Premium Demos
          </div>
          <p className="text-[12px] leading-relaxed text-white/55">
            Curated collection of premium MLM, DApp and Product based demonstrations.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-3 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_rgba(109,91,255,0.28)]"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-5">
          <div className="text-[13px] font-bold text-white">Need Support?</div>
          <p className="mt-1 text-[12px] text-white/45">We are here to help you!</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-3 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_rgba(37,211,102,0.25)]"
          >
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
          <a
            href={`tel:${SUPPORT_PHONE_TEL}`}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[12.5px] font-semibold text-white/80"
          >
            <Phone className="h-4 w-4" />
            {SUPPORT_PHONE}
          </a>
        </div>

        <p className="pt-6 text-center text-[10.5px] leading-relaxed text-white/30">
          © 2026 Digital One Box
          <br />
          All Rights Reserved
        </p>
        </div>
      </aside>
    </>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.1L1 23l6.1-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21.1a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.7.7-3.5-.2-.3A9.1 9.1 0 1 1 12 21.1zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3a13.4 13.4 0 0 0 5.1 4.5c1.9.8 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1s-.2-.2-.5-.3z" />
    </svg>
  )
}

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { RequestDemoModal } from '@/components/RequestDemoModal'
import { Sidebar } from '@/components/Sidebar'
import { Toast } from '@/components/Toast'
import { useApp } from '@/context/AppContext'

export function AppLayout() {
  const location = useLocation()
  const { getVisibleDemos, copyVisibleDemos, sidebarOpen, dataError } = useApp()

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const visible =
    location.pathname === '/favorites'
      ? getVisibleDemos({ favoriteOnly: true })
      : location.pathname === '/recently-viewed'
        ? getVisibleDemos({ recentOnly: true })
        : getVisibleDemos()

  return (
    <div className="app-shell min-h-screen lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:py-5">
        <Header onCopyVisible={() => copyVisibleDemos(visible)} />
        {dataError ? (
          <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-[13px] text-amber-100">
            Database se data nahi aa raha: {dataError}. Admin login karke rules publish kijiye.
          </div>
        ) : null}
        <Outlet />
      </main>
      <Toast />
      <RequestDemoModal />
    </div>
  )
}

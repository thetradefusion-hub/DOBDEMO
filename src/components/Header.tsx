import { Copy, Menu, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/SearchBar'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  onCopyVisible?: () => void
}

export function Header({ onCopyVisible }: HeaderProps) {
  const { favorites, setSidebarOpen } = useApp()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 mb-6 flex flex-wrap items-center gap-3 bg-gradient-to-b from-[#07080f] via-[#07080f]/92 to-transparent pb-3">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="glass-soft grid h-10 w-10 place-items-center rounded-xl text-white/70 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <SearchBar className="order-3 w-full lg:order-none lg:min-w-0 lg:flex-1" />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/favorites')}
          className="glass-soft inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[12.5px] font-semibold text-white/80"
        >
          <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
          Favorites ({favorites.length})
        </button>

        <button
          type="button"
          onClick={onCopyVisible}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_8px_22px_rgba(109,91,255,0.32)]"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy Visible Demos</span>
          <span className="sm:hidden">Copy</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(isAdmin ? '/admin' : '/admin/login')}
          title={isAdmin ? 'Admin panel' : 'Admin login'}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#121322] text-[12px] font-extrabold tracking-wide text-white"
        >
          D1
        </button>
      </div>
    </header>
  )
}

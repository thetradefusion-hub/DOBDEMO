import {
  ArrowLeft,
  BarChart3,
  FileText,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Toast } from '@/components/Toast'
import { useAuth } from '@/context/AuthContext'

const links = [
  { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/demos', label: 'Demos', icon: Layers },
  { to: '/admin/landings', label: 'Landing Pages', icon: FileText },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/requests', label: 'Requests', icon: Inbox },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell min-h-screen lg:flex">
      <aside className="glass flex w-full shrink-0 flex-col border-r border-white/8 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-[260px]">
        <div className="mb-5 flex items-center gap-3">
          <div className="logo-mark">D</div>
          <div>
            <div className="text-[12.5px] font-extrabold tracking-[0.08em] text-white">
              DIGITAL ONE BOX
            </div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/45">
              ADMIN PANEL
            </div>
          </div>
        </div>

        <NavLink
          to="/"
          className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] text-white/50 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vault
        </NavLink>

        <nav className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'sidebar-active'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="truncate text-[11px] text-white/40">{user?.email}</div>
            <ThemeToggle className="h-9 w-9 shrink-0" />
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout()
              navigate('/admin/login', { replace: true })
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/55 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:py-5">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}

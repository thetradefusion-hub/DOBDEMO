import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function RequireAdmin() {
  const { user, authReady } = useAuth()

  if (!authReady) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-300" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return <Outlet />
}

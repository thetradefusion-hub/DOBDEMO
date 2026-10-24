import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  DemosLockProvider,
  DemosLockScreen,
  useDemosLock,
} from '@/components/DemosLockGate'
import { Header } from '@/components/Header'
import { RequestDemoModal } from '@/components/RequestDemoModal'
import { Sidebar } from '@/components/Sidebar'
import { Toast } from '@/components/Toast'
import { useApp } from '@/context/AppContext'
import type { Demo } from '@/types'

const VAULT_LOCK_PATHS = new Set(['/', '/demos', '/favorites', '/recently-viewed'])

function VaultMain({
  visible,
  dataError,
  lockActive,
}: {
  visible: Demo[]
  dataError: string | null
  lockActive: boolean
}) {
  const { copyVisibleDemos } = useApp()
  const lock = useDemosLock()
  const waiting = lockActive && !lock.ready
  const locked = lockActive && lock.ready && lock.enabled && !lock.canViewVault
  const blockVault = waiting || locked

  return (
    <>
      <Header
        onCopyVisible={blockVault ? undefined : () => copyVisibleDemos(visible)}
        copyDisabled={blockVault}
      />
      {dataError ? (
        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-400/15 px-4 py-3 text-[13px] text-amber-900 dark:text-amber-100">
          Database se data nahi aa raha: {dataError}. Admin login karke rules publish kijiye.
        </div>
      ) : null}
      {waiting ? (
        <div className="flex min-h-[50vh] items-center justify-center text-[14px] text-white/50">
          Checking vault access…
        </div>
      ) : locked ? (
        <DemosLockScreen />
      ) : (
        <Outlet />
      )}
    </>
  )
}

export function AppLayout() {
  const location = useLocation()
  const { getVisibleDemos, sidebarOpen, dataError } = useApp()
  const needsVaultLock = VAULT_LOCK_PATHS.has(location.pathname)

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

  const main = (
    <VaultMain visible={visible} dataError={dataError} lockActive={needsVaultLock} />
  )

  return (
    <div className="app-shell min-h-screen lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:py-5">
        {needsVaultLock ? <DemosLockProvider>{main}</DemosLockProvider> : main}
      </main>
      <Toast />
      <RequestDemoModal />
    </div>
  )
}

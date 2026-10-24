import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { FirebaseGate } from '@/components/FirebaseGate'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminDemosPage } from '@/pages/admin/AdminDemosPage'
import { AdminLandingsPage } from '@/pages/admin/AdminLandingsPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminRequestsPage } from '@/pages/admin/AdminRequestsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { RequireAdmin } from '@/pages/admin/RequireAdmin'
import { DashboardPage } from '@/pages/DashboardPage'
import { DemosPage } from '@/pages/DemosPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { RecentlyViewedPage } from '@/pages/RecentlyViewedPage'
import { RequestDemoPage } from '@/pages/RequestDemoPage'

export function VaultApp() {
  return (
    <FirebaseGate>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/demos" element={<DemosPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/request-demo" element={<RequestDemoPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
                <Route path="demos" element={<AdminDemosPage />} />
                <Route path="landings" element={<AdminLandingsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="requests" element={<AdminRequestsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FirebaseGate>
  )
}

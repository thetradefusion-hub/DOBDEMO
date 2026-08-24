import { Eye, FolderOpen, Inbox, Layers, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/StatCard'
import { useApp } from '@/context/AppContext'
import { padStat } from '@/lib/utils'

export function AdminDashboardPage() {
  const { demos, categories, favorites, requests } = useApp()
  const totalViews = demos.reduce((sum, demo) => sum + demo.viewCount, 0)
  const pending = requests.filter((r) => r.status === 'pending').length

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white">Admin Dashboard</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Frontend-only preview. No authentication or database connected.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Layers} value={padStat(demos.length)} label="Total Demos" accent="purple" />
        <StatCard icon={FolderOpen} value={padStat(categories.length)} label="Categories" accent="cyan" />
        <StatCard icon={Eye} value={padStat(totalViews)} label="Total Views" accent="pink" />
        <StatCard icon={Star} value={padStat(favorites.length)} label="Favorites" accent="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-white">Latest Demos</h2>
            <Link to="/admin/demos" className="text-[12px] text-violet-300">
              Manage
            </Link>
          </div>
          <div className="space-y-2">
            {demos.slice(0, 4).map((demo) => (
              <div
                key={demo.id}
                className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5"
              >
                <div>
                  <div className="text-[13px] font-semibold text-white">{demo.title}</div>
                  <div className="text-[11px] text-white/40">{demo.viewCount} views</div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    demo.active ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/8 text-white/40'
                  }`}
                >
                  {demo.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-white">Requests</h2>
            <Link to="/admin/requests" className="text-[12px] text-violet-300">
              {pending} pending
            </Link>
          </div>
          <div className="space-y-2">
            {requests.slice(0, 4).map((req) => (
              <div key={req.id} className="rounded-xl bg-white/[0.03] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-white">{req.name}</div>
                  <span className="text-[10px] tracking-wide text-white/40 uppercase">
                    {req.status}
                  </span>
                </div>
                <div className="mt-1 text-[12px] text-white/45">{req.company || req.email}</div>
              </div>
            ))}
            {!requests.length ? (
              <div className="flex items-center gap-2 py-6 text-[13px] text-white/40">
                <Inbox className="h-4 w-4" />
                No requests yet
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

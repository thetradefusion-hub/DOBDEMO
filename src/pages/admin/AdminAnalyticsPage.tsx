import { Eye, Layers, Star } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { useApp } from '@/context/AppContext'
import { getAccent } from '@/lib/theme'
import { padStat } from '@/lib/utils'

export function AdminAnalyticsPage() {
  const { demos, categories, favorites } = useApp()
  const totalViews = demos.reduce((sum, demo) => sum + demo.viewCount, 0)
  const maxViews = Math.max(...demos.map((d) => d.viewCount), 1)

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white">Analytics</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Visual snapshot of dummy traffic, favorites and category mix.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Layers} value={padStat(demos.length)} label="Total Demos" accent="purple" />
        <StatCard icon={Eye} value={padStat(totalViews)} label="Total Views" accent="pink" />
        <StatCard icon={Star} value={padStat(favorites.length)} label="Favorites" accent="gold" />
        <StatCard
          icon={Layers}
          value={padStat(categories.length)}
          label="Categories"
          accent="cyan"
        />
      </div>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="mb-4 font-bold text-white">Views by Demo</h2>
        <div className="space-y-3">
          {demos.map((demo) => {
            const category = categories.find((c) => c.id === demo.categoryId)
            const theme = getAccent(category?.accent)
            return (
              <div key={demo.id}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-white/80">{demo.title}</span>
                  <span className="text-white/40">{demo.viewCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${theme.button}`}
                    style={{ width: `${(demo.viewCount / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

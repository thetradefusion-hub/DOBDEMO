import { Eye, Grid2x2, Layers, Star } from 'lucide-react'
import { CategoryFilter } from '@/components/CategoryFilter'
import { DemoGrid } from '@/components/DemoGrid'
import { StatCard } from '@/components/StatCard'
import { TrustSection } from '@/components/TrustSection'
import { useApp } from '@/context/AppContext'
import { padStat } from '@/lib/utils'

export function DashboardPage() {
  const { demos, categories, favorites, getVisibleDemos } = useApp()
  const visible = getVisibleDemos()
  const totalViews = demos.reduce((sum, demo) => sum + demo.viewCount, 0)

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[32px]">
          Demo Collection Dashboard
        </h1>
        <p className="mt-1 text-[14px] text-white/50">
          Explore our premium demos in one place
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Layers} value={padStat(demos.length)} label="Total Demos" accent="purple" />
        <StatCard icon={Grid2x2} value={padStat(categories.length)} label="Categories" accent="cyan" />
        <StatCard icon={Eye} value={padStat(totalViews)} label="Total Views" accent="pink" />
        <StatCard icon={Star} value={padStat(favorites.length)} label="Favorites" accent="gold" />
      </div>

      <div className="mt-6">
        <CategoryFilter />
      </div>

      <DemoGrid demos={visible} />
      <TrustSection />
    </div>
  )
}

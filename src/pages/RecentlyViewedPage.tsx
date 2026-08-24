import { DemoGrid } from '@/components/DemoGrid'
import { TrustSection } from '@/components/TrustSection'
import { useApp } from '@/context/AppContext'

export function RecentlyViewedPage() {
  const { getVisibleDemos, recentlyViewed } = useApp()
  const visible = getVisibleDemos({ recentOnly: true })

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[32px]">
          Recently Viewed
        </h1>
        <p className="mt-1 text-[14px] text-white/50">
          {recentlyViewed.length
            ? 'Demos you opened in this browser session'
            : 'Open a demo to start building your recently viewed list'}
        </p>
      </div>
      <DemoGrid
        demos={visible}
        emptyTitle="No demos found"
        emptyText={
          recentlyViewed.length
            ? 'Try changing your search or category filter.'
            : 'Open a demo to start building your recently viewed list.'
        }
      />
      <TrustSection />
    </div>
  )
}

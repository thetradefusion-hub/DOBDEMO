import { DemoGrid } from '@/components/DemoGrid'
import { TrustSection } from '@/components/TrustSection'
import { useApp } from '@/context/AppContext'

export function FavoritesPage() {
  const { getVisibleDemos, favorites } = useApp()
  const visible = getVisibleDemos({ favoriteOnly: true })

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[32px]">
          Favorites
        </h1>
        <p className="mt-1 text-[14px] text-white/50">
          {favorites.length
            ? `${favorites.length} saved demo${favorites.length === 1 ? '' : 's'} in your vault`
            : 'Star a demo to keep it here for quick access'}
        </p>
      </div>
      <DemoGrid
        demos={visible}
        emptyTitle="No demos found"
        emptyText={
          favorites.length
            ? 'Try changing your search or category filter.'
            : 'Star a demo to keep it here for quick access.'
        }
      />
      <TrustSection />
    </div>
  )
}

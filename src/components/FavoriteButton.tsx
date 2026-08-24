import { Star } from 'lucide-react'

interface FavoriteButtonProps {
  active: boolean
  onToggle: () => void
  compact?: boolean
}

export function FavoriteButton({ active, onToggle, compact }: FavoriteButtonProps) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onToggle}
        title={active ? 'Remove from favorites' : 'Add to favorites'}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
          active ? 'text-amber-300' : 'text-white/40 hover:text-amber-200'
        }`}
      >
        <Star className={`h-4 w-4 ${active ? 'fill-amber-300' : ''}`} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[12.5px] font-medium transition ${
        active
          ? 'text-amber-300 hover:text-amber-200'
          : 'text-white/45 hover:text-white/80'
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${active ? 'fill-amber-300' : ''}`} />
      {active ? 'Added to Favorites' : 'Add to Favorites'}
    </button>
  )
}

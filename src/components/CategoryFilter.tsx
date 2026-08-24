import { LayoutGrid, List, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { SortOption } from '@/types'

const SORTS: { id: SortOption; label: string }[] = [
  { id: 'latest', label: 'Latest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'most-viewed', label: 'Most Viewed' },
  { id: 'a-z', label: 'A-Z' },
]

export function CategoryFilter() {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
  } = useApp()

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <FilterPill
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          label="All Demos"
        />
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
            label={category.label}
          />
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <label className="glass-soft relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] text-white/55">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none bg-transparent pr-5 font-semibold text-white outline-none"
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id} className="bg-[#12131e] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-white/40" />
        </label>

        <div className="glass-soft flex rounded-xl p-1">
          <button
            type="button"
            title="Grid View"
            onClick={() => setViewMode('grid')}
            className={`grid h-8 w-8 place-items-center rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="List View"
            onClick={() => setViewMode('list')}
            className={`grid h-8 w-8 place-items-center rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap transition ${
        active
          ? 'bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] text-white shadow-[0_8px_20px_rgba(109,91,255,0.32)]'
          : 'glass-soft text-white/60 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

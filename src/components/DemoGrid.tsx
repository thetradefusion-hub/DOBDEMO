import { SearchX } from 'lucide-react'
import { DemoCard } from '@/components/DemoCard'
import { useApp } from '@/context/AppContext'
import type { Demo } from '@/types'

interface DemoGridProps {
  demos: Demo[]
  emptyTitle?: string
  emptyText?: string
}

export function DemoGrid({
  demos,
  emptyTitle = 'No demos found',
  emptyText = 'Try changing your search or category filter.',
}: DemoGridProps) {
  const { viewMode } = useApp()

  if (!demos.length) {
    return (
      <div className="glass mt-4 flex min-h-[240px] flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/20">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-white">{emptyTitle}</h3>
        <p className="mt-1.5 max-w-sm text-[13px] text-white/50">{emptyText}</p>
      </div>
    )
  }

  return (
    <div
      className={`mt-4 grid gap-4 transition-all duration-300 ${
        viewMode === 'list'
          ? 'grid-cols-1'
          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
      }`}
    >
      {demos.map((demo, index) => (
        <DemoCard key={demo.id} demo={demo} index={index} />
      ))}
    </div>
  )
}

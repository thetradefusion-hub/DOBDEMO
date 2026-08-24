import { CategoryFilter } from '@/components/CategoryFilter'
import { DemoGrid } from '@/components/DemoGrid'
import { TrustSection } from '@/components/TrustSection'
import { useApp } from '@/context/AppContext'

export function DemosPage() {
  const { getVisibleDemos } = useApp()
  const visible = getVisibleDemos()

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[32px]">
          All Demos
        </h1>
        <p className="mt-1 text-[14px] text-white/50">
          Browse the complete Digital One Box demo vault
        </p>
      </div>
      <CategoryFilter />
      <DemoGrid demos={visible} />
      <TrustSection />
    </div>
  )
}

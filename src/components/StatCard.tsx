import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string
  label: string
  accent: 'purple' | 'cyan' | 'pink' | 'gold'
}

const styles = {
  purple: {
    wrap: 'from-violet-500/18 via-transparent to-transparent',
    icon: 'bg-violet-500/15 text-violet-300 shadow-[0_0_22px_rgba(139,92,246,0.45)] ring-violet-400/30',
  },
  cyan: {
    wrap: 'from-cyan-400/16 via-transparent to-transparent',
    icon: 'bg-cyan-400/12 text-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.4)] ring-cyan-300/30',
  },
  pink: {
    wrap: 'from-fuchsia-500/16 via-transparent to-transparent',
    icon: 'bg-fuchsia-500/14 text-fuchsia-300 shadow-[0_0_22px_rgba(236,72,153,0.4)] ring-fuchsia-400/30',
  },
  gold: {
    wrap: 'from-amber-400/16 via-transparent to-transparent',
    icon: 'bg-amber-400/12 text-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.4)] ring-amber-300/30',
  },
}

export function StatCard({ icon: Icon, value, label, accent }: StatCardProps) {
  const theme = styles[accent]

  return (
    <article className="glass relative overflow-hidden rounded-2xl px-4 py-4">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${theme.wrap}`} />
      <div className="relative flex items-center gap-3.5">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${theme.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[26px] leading-none font-extrabold tracking-tight text-white">
            {value}
          </div>
          <div className="mt-1.5 text-[12px] font-medium text-white/50">{label}</div>
        </div>
      </div>
    </article>
  )
}

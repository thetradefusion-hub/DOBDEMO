import { Headset, Rocket, Shield, Zap } from 'lucide-react'

const items = [
  {
    icon: Shield,
    title: '100% Secure',
    text: 'All demos are safe and regularly monitored.',
    glow: 'bg-violet-500/15 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.4)] ring-violet-400/30',
  },
  {
    icon: Zap,
    title: 'Live & Working',
    text: 'Demos are live and tested regularly.',
    glow: 'bg-cyan-400/12 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] ring-cyan-300/30',
  },
  {
    icon: Headset,
    title: 'Expert Support',
    text: 'Get help anytime from our expert team.',
    glow: 'bg-fuchsia-500/14 text-fuchsia-300 shadow-[0_0_24px_rgba(236,72,153,0.35)] ring-fuchsia-400/30',
  },
  {
    icon: Rocket,
    title: 'Premium Quality',
    text: 'Handpicked premium platforms for you.',
    glow: 'bg-amber-400/12 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.35)] ring-amber-300/30',
  },
]

export function TrustSection() {
  return (
    <section className="glass mt-6 rounded-2xl px-4 py-5 md:px-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.title} className="flex items-start gap-3.5">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ${item.glow}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-white/50">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

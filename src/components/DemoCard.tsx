import type { LucideIcon } from 'lucide-react'
import {
  Box,
  CandlestickChart,
  ExternalLink,
  Globe,
  LayoutGrid,
  Share2,
  ShoppingBag,
} from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import { FavoriteButton } from '@/components/FavoriteButton'
import { useApp } from '@/context/AppContext'
import { getAccent } from '@/lib/theme'
import type { Demo } from '@/types'

const categoryIcons: Record<string, LucideIcon> = {
  'forex-mlm': CandlestickChart,
  dapp: Box,
  'binary-plan': Share2,
  'product-based': ShoppingBag,
}

interface DemoCardProps {
  demo: Demo
  index?: number
}

export function DemoCard({ demo, index = 0 }: DemoCardProps) {
  const {
    getCategory,
    isFavorite,
    toggleFavorite,
    openDemo,
    copyField,
    copyDemoDetails,
    viewMode,
  } = useApp()

  const category = getCategory(demo.categoryId)
  const accent = getAccent(category?.accent)
  const Icon = categoryIcons[demo.categoryId] ?? LayoutGrid
  const favorite = isFavorite(demo.id)
  const list = viewMode === 'list'

  return (
    <article
      className={`glass group relative flex overflow-hidden rounded-2xl p-4 transition duration-300 ${accent.glow} ${
        list ? 'flex-col gap-4 lg:flex-row lg:items-stretch' : 'flex-col'
      }`}
      style={{ animation: 'fade-up 0.45s ease both', animationDelay: `${index * 60}ms` }}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.soft} opacity-70`} />

      <div className={`relative ${list ? 'flex min-w-0 flex-1 flex-col' : ''}`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent.iconWrap}`}>
            <Icon className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${accent.badge}`}>
            {category?.shortLabel ?? category?.label ?? 'Demo'}
          </span>
        </div>

        <h3 className="text-[16px] leading-snug font-bold text-white">{demo.title}</h3>
        <p className="mt-1.5 min-h-[40px] text-[12.5px] leading-relaxed text-white/50">
          {demo.description}
        </p>
      </div>

      <div className={`relative mt-3 space-y-2 ${list ? 'lg:mt-0 lg:w-[280px] lg:shrink-0' : ''}`}>
        <CredentialRow
          label="Website"
          value={demo.websiteUrl}
          onCopy={() => copyField('Website URL', demo.websiteUrl)}
        />
        {demo.memberPanelUrl ? (
          <CredentialRow
            label="Member Panel"
            value={demo.memberPanelUrl}
            onCopy={() => copyField('Member Panel URL', demo.memberPanelUrl!)}
          />
        ) : null}
        <CredentialRow
          label="Username"
          value={demo.username}
          onCopy={() => copyField('Username', demo.username)}
        />
        <CredentialRow
          label="Password"
          value={demo.password}
          onCopy={() => copyField('Password', demo.password)}
        />
      </div>

      <div className={`relative mt-3 ${list ? 'flex flex-col justify-end lg:mt-0 lg:w-[180px] lg:shrink-0' : ''}`}>
        {demo.memberPanelUrl ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openDemo(demo, demo.websiteUrl)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[12px] font-semibold text-white ${accent.button}`}
            >
              Website <ExternalLink className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => openDemo(demo, demo.memberPanelUrl)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[12px] font-semibold text-white ${accent.button}`}
            >
              Member Panel <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openDemo(demo)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white ${accent.button}`}
          >
            Open Demo
          </button>
        )}

        <button
          type="button"
          onClick={() => copyDemoDetails(demo)}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12.5px] font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Copy All Details
        </button>

        <FavoriteButton active={favorite} onToggle={() => toggleFavorite(demo.id)} />
      </div>
    </article>
  )
}

function CredentialRow({
  label,
  value,
  onCopy,
}: {
  label: string
  value: string
  onCopy: () => void
}) {
  return (
    <div className="cred-row">
      <Globe className="h-3.5 w-3.5 shrink-0 text-white/30" />
      <div className="min-w-0 flex-1">
        <div className="text-[9.5px] tracking-wide text-white/35 uppercase">{label}</div>
        <div className="truncate font-mono text-[11.5px] text-white/80">{value}</div>
      </div>
      <CopyButton onCopy={onCopy} label={`Copy ${label}`} />
    </div>
  )
}

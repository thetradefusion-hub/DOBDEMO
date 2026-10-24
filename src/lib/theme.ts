import type { AccentColor } from '@/types'

export interface AccentTheme {
  name: AccentColor
  iconWrap: string
  icon: string
  badge: string
  button: string
  glow: string
  ring: string
  soft: string
  text: string
}

export const accents: Record<AccentColor, AccentTheme> = {
  purple: {
    name: 'purple',
    iconWrap:
      'bg-violet-500/15 shadow-[0_0_22px_rgba(139,92,246,0.45)] ring-1 ring-violet-400/30',
    icon: 'text-violet-300',
    badge:
      'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30',
    button:
      'bg-gradient-to-r from-[#7C5CFF] via-[#6D6BFF] to-[#4F8CFF] shadow-[0_8px_24px_rgba(109,91,255,0.35)]',
    glow: 'hover:shadow-[0_12px_40px_rgba(124,92,255,0.18)] hover:border-violet-400/35',
    ring: 'border-violet-500/20',
    soft: 'from-violet-600/20 to-transparent',
    text: 'text-violet-300',
  },
  cyan: {
    name: 'cyan',
    iconWrap:
      'bg-cyan-400/12 shadow-[0_0_22px_rgba(34,211,238,0.4)] ring-1 ring-cyan-300/30',
    icon: 'text-cyan-300',
    badge: 'bg-cyan-400/12 text-cyan-200 ring-1 ring-cyan-300/30',
    button:
      'bg-gradient-to-r from-[#06B6D4] to-[#2563EB] shadow-[0_8px_24px_rgba(6,182,212,0.32)]',
    glow: 'hover:shadow-[0_12px_40px_rgba(34,211,238,0.16)] hover:border-cyan-400/35',
    ring: 'border-cyan-500/20',
    soft: 'from-cyan-500/18 to-transparent',
    text: 'text-cyan-300',
  },
  pink: {
    name: 'pink',
    iconWrap:
      'bg-fuchsia-500/14 shadow-[0_0_22px_rgba(236,72,153,0.4)] ring-1 ring-fuchsia-400/30',
    icon: 'text-fuchsia-300',
    badge: 'bg-fuchsia-500/14 text-fuchsia-200 ring-1 ring-fuchsia-400/30',
    button:
      'bg-gradient-to-r from-[#EC4899] to-[#A855F7] shadow-[0_8px_24px_rgba(236,72,153,0.32)]',
    glow: 'hover:shadow-[0_12px_40px_rgba(236,72,153,0.16)] hover:border-fuchsia-400/35',
    ring: 'border-fuchsia-500/20',
    soft: 'from-fuchsia-500/18 to-transparent',
    text: 'text-fuchsia-300',
  },
  green: {
    name: 'green',
    iconWrap:
      'bg-emerald-400/12 shadow-[0_0_22px_rgba(16,185,129,0.4)] ring-1 ring-emerald-300/30',
    icon: 'text-emerald-300',
    badge: 'bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/30',
    button:
      'bg-gradient-to-r from-[#10B981] to-[#059669] shadow-[0_8px_24px_rgba(16,185,129,0.32)]',
    glow: 'hover:shadow-[0_12px_40px_rgba(16,185,129,0.16)] hover:border-emerald-400/35',
    ring: 'border-emerald-500/20',
    soft: 'from-emerald-500/18 to-transparent',
    text: 'text-emerald-300',
  },
  gold: {
    name: 'gold',
    iconWrap:
      'bg-amber-400/12 shadow-[0_0_22px_rgba(251,191,36,0.4)] ring-1 ring-amber-300/30',
    icon: 'text-amber-300',
    badge: 'bg-amber-400/12 text-amber-200 ring-1 ring-amber-300/30',
    button:
      'bg-gradient-to-r from-[#F59E0B] to-[#F97316] shadow-[0_8px_24px_rgba(245,158,11,0.32)]',
    glow: 'hover:shadow-[0_12px_40px_rgba(251,191,36,0.16)] hover:border-amber-400/35',
    ring: 'border-amber-500/20',
    soft: 'from-amber-500/18 to-transparent',
    text: 'text-amber-300',
  },
}

export function getAccent(accent?: string | AccentColor): AccentTheme {
  if (accent && accent in accents) return accents[accent as AccentColor]
  return accents.purple
}

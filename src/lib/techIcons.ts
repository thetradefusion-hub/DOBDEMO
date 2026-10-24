export interface TechIcon {
  slug: string
  color: string
  name: string
  /** Optional direct SVG/PNG when not available on Simple Icons CDN. */
  src?: string
}

/** Official brand icons via Simple Icons CDN (or custom src). */
export function techIconUrl(icon: TechIcon) {
  if (icon.src) return icon.src
  return `https://cdn.simpleicons.org/${icon.slug}/${icon.color}`
}

const CATALOG: { match: RegExp; icons: TechIcon[] }[] = [
  {
    match: /react|next\.?js/i,
    icons: [
      { slug: 'react', color: '61DAFB', name: 'React' },
      { slug: 'nextdotjs', color: '000000', name: 'Next.js' },
    ],
  },
  {
    match: /node\.?js|express/i,
    icons: [{ slug: 'nodedotjs', color: '339933', name: 'Node.js' }],
  },
  {
    match: /solidity|smart\s*contract/i,
    icons: [{ slug: 'solidity', color: '363636', name: 'Solidity' }],
  },
  {
    match: /mongo|mysql|postgres|database/i,
    icons: [
      { slug: 'mongodb', color: '47A248', name: 'MongoDB' },
      { slug: 'mysql', color: '4479A1', name: 'MySQL' },
    ],
  },
  {
    match: /metamask|wallet/i,
    icons: [
      {
        slug: 'metamask',
        color: 'E2761B',
        name: 'MetaMask',
        // Removed from Simple Icons; Wikimedia Commons fox mark.
        src: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      },
    ],
  },
  {
    match: /aws|amazon|vps|cloud/i,
    icons: [
      {
        slug: 'amazonwebservices',
        color: 'FF9900',
        name: 'AWS',
        src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      },
    ],
  },
  {
    match: /typescript|javascript/i,
    icons: [
      { slug: 'typescript', color: '3178C6', name: 'TypeScript' },
      { slug: 'javascript', color: 'F7DF1E', name: 'JavaScript' },
    ],
  },
  {
    match: /firebase/i,
    icons: [{ slug: 'firebase', color: 'FFCA28', name: 'Firebase' }],
  },
  {
    match: /tailwind/i,
    icons: [{ slug: 'tailwindcss', color: '06B6D4', name: 'Tailwind' }],
  },
  {
    match: /docker/i,
    icons: [{ slug: 'docker', color: '2496ED', name: 'Docker' }],
  },
  {
    match: /ethereum|web3/i,
    icons: [{ slug: 'ethereum', color: '3C3C3D', name: 'Ethereum' }],
  },
  {
    match: /python/i,
    icons: [{ slug: 'python', color: '3776AB', name: 'Python' }],
  },
  {
    match: /php|laravel/i,
    icons: [{ slug: 'php', color: '777BB4', name: 'PHP' }],
  },
]

export function resolveTechIcons(label: string): TechIcon[] {
  const entry = CATALOG.find((item) => item.match.test(label))
  if (!entry) return []

  // If label mentions only one of a pair, prefer that icon.
  const lower = label.toLowerCase()
  if (/react|next/i.test(label) && !/react/i.test(lower)) {
    return entry.icons.filter((icon) => icon.slug === 'nextdotjs')
  }
  if (/react/i.test(lower) && !/next/i.test(lower)) {
    return entry.icons.filter((icon) => icon.slug === 'react')
  }
  if (/mongo/i.test(lower) && !/mysql/i.test(lower)) {
    return entry.icons.filter((icon) => icon.slug === 'mongodb')
  }
  if (/mysql/i.test(lower) && !/mongo/i.test(lower)) {
    return entry.icons.filter((icon) => icon.slug === 'mysql')
  }
  return entry.icons
}

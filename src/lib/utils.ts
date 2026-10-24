export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

export function getLandingPagePath(slug: string): string {
  return `/products/${slug.replace(/^\/+|\/+$/g, '')}`
}

export function getLandingPageUrl(slug: string, origin = window.location.origin): string {
  return `${origin}${getLandingPagePath(slug)}`
}

export function formatDemoDetails(
  demo: {
    title: string
    category: string
    websiteUrl: string
    memberPanelUrl?: string
    adminPanelUrl?: string
    landingPageUrl?: string
    username: string
    password: string
  },
): string {
  const lines = [
    `Demo Name: ${demo.title}`,
    `Category: ${demo.category}`,
  ]
  if (demo.landingPageUrl) lines.push(`Product / Landing Page: ${demo.landingPageUrl}`)
  lines.push(`Website: ${demo.websiteUrl}`)
  if (demo.memberPanelUrl) lines.push(`Member Panel: ${demo.memberPanelUrl}`)
  if (demo.adminPanelUrl) lines.push(`Admin Panel: ${demo.adminPanelUrl}`)
  lines.push(`Username: ${demo.username}`)
  lines.push(`Password: ${demo.password}`)
  return lines.join('\n')
}

export function padStat(value: number): string {
  return value < 100 ? String(value).padStart(2, '0') : String(value)
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

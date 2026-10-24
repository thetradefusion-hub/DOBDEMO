import { useState } from 'react'
import { Check, Copy, Eye, EyeOff, ExternalLink, LockKeyhole } from 'lucide-react'
import { copyToClipboard, formatDemoDetails, getLandingPageUrl } from '@/lib/utils'
import type { Demo } from '@/types'

interface LandingCredentialsProps {
  demo: Demo
  categoryLabel: string
  /** When true, render panel only (used inside About + credentials grid). */
  embedded?: boolean
}

type CredRow = { key: string; label: string; value: string; href?: string }

export function LandingCredentials({
  demo,
  categoryLabel,
  embedded = false,
}: LandingCredentialsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState(false)
  const landingUrl = demo.landingPageSlug
    ? getLandingPageUrl(demo.landingPageSlug)
    : window.location.href

  const publicRows: CredRow[] = [
    { key: 'landing', label: 'Product / Landing Page', value: landingUrl, href: landingUrl },
    { key: 'website', label: 'Website', value: demo.websiteUrl, href: demo.websiteUrl },
    demo.memberPanelUrl
      ? {
          key: 'member',
          label: 'Member Panel',
          value: demo.memberPanelUrl,
          href: demo.memberPanelUrl,
        }
      : null,
    demo.adminPanelUrl
      ? {
          key: 'admin',
          label: 'Admin Panel',
          value: demo.adminPanelUrl,
          href: demo.adminPanelUrl,
        }
      : null,
  ].filter(Boolean) as CredRow[]

  const secretRows: CredRow[] = [
    { key: 'user', label: 'Username', value: demo.username },
    { key: 'pass', label: 'Password', value: demo.password },
  ]

  async function copyValue(key: string, value: string) {
    const ok = await copyToClipboard(value)
    if (ok) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1600)
    }
  }

  async function copyAll() {
    const ok = await copyToClipboard(
      formatDemoDetails({
        title: demo.title,
        category: categoryLabel,
        websiteUrl: demo.websiteUrl,
        memberPanelUrl: demo.memberPanelUrl,
        adminPanelUrl: demo.adminPanelUrl,
        landingPageUrl: landingUrl,
        username: demo.username,
        password: demo.password,
      }),
    )
    if (ok) {
      setCopiedKey('all')
      window.setTimeout(() => setCopiedKey(null), 1600)
    }
  }

  function renderRow(row: CredRow) {
    return (
      <div key={row.key} className="ctm-cred-row">
        <div className="min-w-0">
          <div className="ctm-cred-label">{row.label}</div>
          {row.href ? (
            <a
              href={row.href}
              target={row.key === 'landing' ? undefined : '_blank'}
              rel="noreferrer"
              className="ctm-cred-value"
            >
              {row.value}
            </a>
          ) : (
            <div className="ctm-cred-value">{row.value}</div>
          )}
        </div>
        <div className="ctm-cred-actions">
          {row.href && row.key !== 'landing' ? (
            <a
              className="ctm-icon-btn"
              href={row.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${row.label}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          <button
            type="button"
            className="ctm-icon-btn"
            onClick={() => void copyValue(row.key, row.value)}
            aria-label={`Copy ${row.label}`}
          >
            {copiedKey === row.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    )
  }

  const panel = (
    <div className={`ctm-cred-panel ctm-reveal${embedded ? ' is-embedded' : ''}`}>
      <div className="ctm-cred-head">
        <div>
          <div className="ctm-cred-kicker">
            {embedded ? 'Live demo access' : categoryLabel}
          </div>
          <h3>{demo.title}</h3>
          {embedded ? (
            <p className="ctm-cred-head-note">
              Copy links anytime. Login stays hidden until you reveal it.
            </p>
          ) : null}
        </div>
        <button type="button" className="ctm-btn ctm-btn-primary" onClick={() => void copyAll()}>
          {copiedKey === 'all' ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy All
            </>
          )}
        </button>
      </div>

      {embedded ? (
        <div className="ctm-cred-meta-line">
          <span>{categoryLabel}</span>
        </div>
      ) : null}

      <div className="ctm-cred-grid">{publicRows.map(renderRow)}</div>

      <div className="ctm-cred-secret">
        {!showSecrets ? (
          <div className="ctm-cred-secret-locked">
            <div className="ctm-cred-secret-copy">
              <LockKeyhole className="h-5 w-5" />
              <div>
                <strong>Username & password hidden</strong>
                <p>Reveal demo login credentials for this product.</p>
              </div>
            </div>
            <button
              type="button"
              className="ctm-btn ctm-btn-primary"
              onClick={() => setShowSecrets(true)}
            >
              <Eye className="h-4 w-4" />
              View Demo Credentials
            </button>
          </div>
        ) : (
          <>
            <div className="ctm-cred-secret-toolbar">
              <span>Demo login credentials</span>
              <button
                type="button"
                className="ctm-btn ctm-btn-outline"
                onClick={() => setShowSecrets(false)}
              >
                <EyeOff className="h-4 w-4" />
                Hide
              </button>
            </div>
            <div className="ctm-cred-grid">{secretRows.map(renderRow)}</div>
          </>
        )}
      </div>
    </div>
  )

  if (embedded) return panel

  return (
    <section className="ctm-section" id="credentials">
      <div className="ctm-wrap">
        <div className="ctm-section-head ctm-reveal">
          <p className="ctm-eyebrow">Live demo access</p>
          <h2>Credentials for sales & client walkthroughs</h2>
          <p>
            Copy the landing page and panel links anytime. Username / password stay hidden until you
            tap View Demo Credentials.
          </p>
        </div>
        {panel}
      </div>
    </section>
  )
}

import { useState } from 'react'
import {
  Bot,
  ChevronDown,
  Coins,
  Globe,
  Layers,
  Megaphone,
  Network,
  Smartphone,
  Store,
  CandlestickChart,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { COMPANY_SERVICES } from '@/data/services'

const ICONS: Record<string, LucideIcon> = {
  coins: Coins,
  network: Network,
  candlestick: CandlestickChart,
  wallet: Wallet,
  layers: Layers,
  bot: Bot,
  globe: Globe,
  smartphone: Smartphone,
  store: Store,
  megaphone: Megaphone,
}

export function ServicesShowcase() {
  const [openSlug, setOpenSlug] = useState<string | null>(COMPANY_SERVICES[0]?.slug ?? null)

  return (
    <div className="ctm-services">
      {COMPANY_SERVICES.map((service, index) => {
        const Icon = ICONS[service.icon] ?? Layers
        const open = openSlug === service.slug
        const panelId = `service-panel-${service.slug}`
        const count = service.categories.length

        return (
          <article
            key={service.slug}
            className={`ctm-service-card${open ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="ctm-service-trigger"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenSlug(open ? null : service.slug)}
            >
              <span className="ctm-service-index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="ctm-service-icon" aria-hidden>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="ctm-service-meta">
                <strong>{service.title}</strong>
                <span>{service.summary}</span>
              </span>
              <span className="ctm-service-count">{count}</span>
              <ChevronDown className="ctm-service-chevron" size={18} aria-hidden />
            </button>

            {open ? (
              <div
                id={panelId}
                className="ctm-service-panel"
                role="region"
                aria-label={`${service.title} categories`}
              >
                <ul className="ctm-service-cats">
                  {service.categories.map((cat) => (
                    <li key={cat.name}>
                      <span className="ctm-service-cat-name">{cat.name}</span>
                      {cat.detail ? (
                        <span className="ctm-service-cat-detail">{cat.detail}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {service.note ? <p className="ctm-service-note">{service.note}</p> : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

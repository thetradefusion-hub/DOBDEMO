import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, ImageIcon, Play } from 'lucide-react'
import { resolveMediaEmbed } from '@/lib/mediaEmbed'
import type { LandingMediaItem } from '@/types'

interface LandingMediaGalleryProps {
  items: LandingMediaItem[]
  title: string
  subtitle?: string
}

export function LandingMediaGallery({ items, title, subtitle }: LandingMediaGalleryProps) {
  const validItems = useMemo(
    () => items.filter((item) => item.url?.trim() && item.title?.trim()),
    [items],
  )
  const [activeId, setActiveId] = useState(validItems[0]?.id ?? '')

  useEffect(() => {
    if (!validItems.length) return
    if (!validItems.some((item) => item.id === activeId)) {
      setActiveId(validItems[0].id)
    }
  }, [activeId, validItems])

  const active = validItems.find((item) => item.id === activeId) ?? validItems[0]

  if (!validItems.length || !active) return null

  const embed = resolveMediaEmbed(active.url, active.type)

  return (
    <section className="ctm-section" id="media">
      <div className="ctm-wrap">
        <div className="ctm-section-head ctm-reveal">
          <p className="ctm-eyebrow">Screenshots & videos</p>
          <h2>{title}</h2>
          {subtitle?.trim() ? <p>{subtitle}</p> : null}
        </div>

        <div className="ctm-media-shell ctm-reveal">
          <div className="ctm-media-tabs" role="tablist" aria-label="Dashboard views">
            {validItems.map((item) => {
              const selected = active.id === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`ctm-tab ${selected ? 'active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                >
                  {item.type === 'video' ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <ImageIcon className="h-3.5 w-3.5" />
                  )}
                  {item.title}
                </button>
              )
            })}
          </div>

          <div className="ctm-media-stage">
            <div className="ctm-media-frame" key={active.id}>
              {embed.kind === 'image' ? (
                <img
                  src={embed.embedUrl || active.url}
                  alt={active.title}
                  className="ctm-media-image"
                />
              ) : embed.kind === 'video-file' ? (
                <video
                  className="ctm-media-video"
                  src={embed.embedUrl || active.url}
                  controls
                  playsInline
                />
              ) : embed.embedUrl ? (
                <iframe
                  className="ctm-media-iframe"
                  src={embed.embedUrl}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="ctm-media-fallback">
                  <p>Preview unavailable for this link.</p>
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ctm-btn ctm-btn-primary"
                  >
                    Open media <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="ctm-media-meta">
              <div>
                <div className="ctm-media-type">
                  {active.type === 'video' ? 'Video' : 'Screenshot'} · click tabs above to switch
                </div>
                <h3>{active.title}</h3>
              </div>
              <a
                className="ctm-btn ctm-btn-outline"
                href={active.url}
                target="_blank"
                rel="noreferrer"
              >
                Open original <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

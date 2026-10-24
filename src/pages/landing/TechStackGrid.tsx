import { resolveTechIcons, techIconUrl } from '@/lib/techIcons'
import type { LandingTechItem } from '@/types'

interface TechStackGridProps {
  items: LandingTechItem[]
}

export function TechStackGrid({ items }: TechStackGridProps) {
  return (
    <div className="ctm-tech">
      {items.map((item) => {
        const icons = resolveTechIcons(item.label)
        return (
          <article key={item.label} className="ctm-tech-item ctm-reveal">
            <div className="ctm-tech-icons" aria-hidden={icons.length === 0}>
              {icons.length ? (
                icons.map((icon) => (
                  <span key={icon.slug} className="ctm-tech-icon" title={icon.name}>
                    <img src={techIconUrl(icon)} alt="" width={28} height={28} loading="lazy" />
                  </span>
                ))
              ) : (
                <span className="ctm-tech-icon ctm-tech-icon-fallback">
                  {item.label.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="ctm-tech-copy">
              <strong>{item.label}</strong>
              <span>{item.role}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}

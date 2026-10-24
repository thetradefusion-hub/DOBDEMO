import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  Check,
  Coins,
  CreditCard,
  Globe,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Phone,
  Play,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { INITIAL_LANDINGS } from '@/data/landings'
import {
  COMPANY_ADDRESS,
  COMPANY_WEBSITE,
  COMPANY_WEBSITE_LABEL,
  CONTACT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_ALT,
  WHATSAPP_URL,
  WHATSAPP_URL_ALT,
} from '@/data/mock'
import type { ProductLanding } from '@/types'
import { LandingCredentials } from './LandingCredentials'
import { LandingMediaGallery } from './LandingMediaGallery'
import { ServicesShowcase } from './ServicesShowcase'
import { TechStackGrid } from './TechStackGrid'
import './product-landing.css'

/** Official brand mark from /public */
const BRAND_LOGO = '/Digital%20One%20Box%20Gradient%20Cube%20Logo.png'

const featureIcons = [
  Coins,
  Network,
  Boxes,
  Wallet,
  LayoutDashboard,
  Users,
  ShieldCheck,
  CreditCard,
]

function mediaItemsOf(landing: ProductLanding) {
  return landing.mediaItems?.filter((item) => item.url?.trim()) ?? []
}

function buildNav(landing: ProductLanding) {
  const mediaCount = mediaItemsOf(landing).length
  const links = [
    { href: '#overview', label: 'Overview' },
    { href: '#credentials', label: 'Demo Access' },
    { href: '#features', label: 'Features' },
    { href: '#media', label: 'Media', show: mediaCount > 0 },
    { href: '#faq', label: 'FAQ', show: landing.faqs.length > 0 },
  ]
  return links.filter((item) => item.show !== false)
}

export function ProductLandingPage() {
  const { slug = '' } = useParams()
  const { demos, categories, landings, getLandingBySlug, dataReady } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  const landing =
    getLandingBySlug(slug) ??
    landings.find((item) => item.slug === slug) ??
    INITIAL_LANDINGS.find((item) => item.slug === slug)

  const demo = useMemo(() => {
    if (!landing) return undefined
    return (
      demos.find((item) => item.id === landing.demoId) ??
      demos.find((item) => item.landingPageSlug === landing.slug)
    )
  }, [demos, landing])

  const categoryLabel = demo
    ? (categories.find((item) => item.id === demo.categoryId)?.label ?? demo.categoryId)
    : 'Product Demo'

  const navLinks = landing ? buildNav(landing) : []

  useEffect(() => {
    if (!landing) {
      document.title = 'Product not found | Digital One Box'
      return
    }
    document.title = `${landing.title} ${landing.titleAccent} | Digital One Box`
    const prev = document.documentElement.dataset.theme
    document.documentElement.dataset.theme = 'light'
    document.documentElement.style.colorScheme = 'light'

    const nodes = Array.from(document.querySelectorAll('.ctm-reveal'))
    const markInView = (node: Element) => {
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 48) {
        node.classList.add('in')
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('in')
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    nodes.forEach((node) => {
      markInView(node)
      observer.observe(node)
    })
    // Hash jumps / late layout after Firebase hydrate
    requestAnimationFrame(() => nodes.forEach(markInView))

    return () => {
      observer.disconnect()
      if (prev) document.documentElement.dataset.theme = prev
      document.title = 'Demo Vault | Digital One Box'
    }
  }, [landing])

  const page = getLandingBySlug(slug) ?? (landing?.active ? landing : undefined)

  if (!dataReady && !page) {
    return (
      <div className="ctm-page">
        <div className="ctm-wrap" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Loading product page…</p>
        </div>
      </div>
    )
  }

  if (!page) {
    const inactive = landings.find((item) => item.slug === slug)
    return (
      <div className="ctm-page">
        <div className="ctm-wrap" style={{ padding: '5rem 0', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.75rem' }}>
            {inactive ? 'Landing page inactive' : 'Landing page not found'}
          </h1>
          <p style={{ color: 'var(--ctm-muted)', marginBottom: '1.25rem' }}>
            {inactive
              ? 'Admin se is page ko active kijiye.'
              : 'Admin panel se naya landing page add kijiye aur slug set kijiye.'}
          </p>
          <Link className="ctm-btn ctm-btn-primary" to="/">
            Back to Demo Vault
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ctm-page">
      <header className="ctm-header">
        <div className="ctm-wrap ctm-header-inner">
          <a href="#top" className="ctm-brand" aria-label="Digital One Box home">
            <img
              className="ctm-brand-logo"
              src={BRAND_LOGO}
              alt="Digital One Box Pvt Ltd"
              width={340}
              height={88}
            />
          </a>

          <nav className="ctm-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ctm-header-actions">
            <a className="ctm-btn ctm-btn-primary" href="#quote">
              Request a Quote
            </a>
            <button
              type="button"
              className="ctm-menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className={`ctm-wrap ctm-mobile-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="ctm-btn ctm-btn-primary" href="#quote" onClick={() => setMenuOpen(false)}>
            Request a Quote
          </a>
        </div>
      </header>

      <main id="top">
        <section className="ctm-hero">
          <div className="ctm-wrap ctm-hero-grid">
            <div className="ctm-hero-copy">
              <div className="ctm-kicker">{page.brandLabel}</div>
              <h1>
                {page.title} <span className="ctm-accent">{page.titleAccent}</span>
              </h1>
              <p className="ctm-hero-lead">{page.subtitle}</p>
              {page.heroChecks.length ? (
                <ul className="ctm-checks">
                  {page.heroChecks.map((item) => (
                    <li key={item}>
                      <span className="ctm-check-icon">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="ctm-hero-ctas">
                {demo ? (
                  <a className="ctm-btn ctm-btn-primary" href="#credentials">
                    View Demo Credentials
                  </a>
                ) : (
                  <a className="ctm-btn ctm-btn-primary" href="#quote">
                    Request a Quote
                  </a>
                )}
                <a className="ctm-btn ctm-btn-ghost" href="#media">
                  <Play className="h-4 w-4" />
                  View Media
                </a>
              </div>
            </div>

            <div className="ctm-hero-visual">
              <img
                src={page.heroImageUrl || '/landing/crypto-mlm-hero-devices.jpg'}
                alt={`${page.title} ${page.titleAccent} product preview`}
                width={1600}
                height={900}
              />
            </div>
          </div>
        </section>

        {page.stats.length ? (
          <section className="ctm-stats" aria-label="Social proof">
            <div className="ctm-wrap ctm-stats-grid">
              {page.stats.map((stat) => (
                <div key={stat.label} className="ctm-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="ctm-section" id="overview">
          <div className={`ctm-wrap ctm-about-cred${demo ? ' has-demo' : ''}`}>
            <div className="ctm-about-col ctm-reveal">
              <div className="ctm-section-head ctm-section-head-wide">
                <p className="ctm-eyebrow">About this product</p>
                <h2>{page.aboutTitle}</h2>
              </div>
              <div className="ctm-copy ctm-copy-wide">
                {page.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>

            {demo ? (
              <aside className="ctm-cred-col" id="credentials">
                <LandingCredentials demo={demo} categoryLabel={categoryLabel} embedded />
              </aside>
            ) : null}
          </div>
        </section>

        <section className="ctm-section ctm-section-alt" id="features">
          <div className="ctm-wrap">
            <div className="ctm-section-head ctm-reveal">
              <p className="ctm-eyebrow">Key features</p>
              <h2>{page.featuresTitle}</h2>
              {page.featuresSubtitle &&
              page.featuresSubtitle !==
                'From token creation to payouts, the suite covers the operational layers buyers expect in a CodeCanyon-grade product showcase.' ? (
                <p>{page.featuresSubtitle}</p>
              ) : null}
            </div>

            <div className="ctm-feature-grid">
              {page.features.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length]
                return (
                  <article key={`${feature.title}-${index}`} className="ctm-feature ctm-reveal">
                    <div className={`ctm-feature-icon ${feature.accent || 'blue'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                )
              })}
            </div>

            <div className="ctm-side-lists">
              <div className="ctm-panel ctm-list-panel ctm-reveal">
                <h3>{page.highlightsTitle}</h3>
                <ul>
                  {page.highlights.map((item) => (
                    <li key={item}>
                      <span className="ctm-bullet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ctm-panel ctm-list-panel ctm-reveal">
                <h3>{page.suitableTitle}</h3>
                <ul>
                  {page.suitableFor.map((item) => (
                    <li key={item}>
                      <span className="ctm-bullet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {mediaItemsOf(page).length ? (
          <LandingMediaGallery
            items={mediaItemsOf(page)}
            title={page.mediaSectionTitle || page.demoSectionTitle || 'Screenshots & videos'}
            subtitle={
              page.mediaSectionSubtitle ===
                'Click a tab to preview that screen — image or video from YouTube, Google Drive, or any link.'
                ? ''
                : page.mediaSectionSubtitle || page.demoSectionSubtitle || ''
            }
          />
        ) : null}

        {page.workflow.length ? (
          <section className="ctm-section">
            <div className="ctm-wrap">
              <div className="ctm-section-head ctm-reveal">
                <p className="ctm-eyebrow">How it works</p>
                <h2>{page.workflowTitle}</h2>
                {page.workflowSubtitle ? <p>{page.workflowSubtitle}</p> : null}
              </div>
              <div className="ctm-steps">
                {page.workflow.map((step) => (
                  <article key={step.step} className="ctm-step ctm-reveal">
                    <div className="ctm-step-num">{step.step}</div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {page.techStack.length ? (
          <section className="ctm-section ctm-section-alt">
            <div className="ctm-wrap">
              <div className="ctm-section-head ctm-reveal">
                <p className="ctm-eyebrow">Technology stack</p>
                <h2>{page.techTitle}</h2>
                {page.techSubtitle ? <p>{page.techSubtitle}</p> : null}
              </div>
              <TechStackGrid items={page.techStack} />
            </div>
          </section>
        ) : null}

        <section className="ctm-section" id="services">
          <div className="ctm-wrap">
            <div className="ctm-section-head ctm-reveal">
              <p className="ctm-eyebrow">Our services</p>
              <h2>Services we also provide</h2>
              <p>
                Beyond this product, Digital One Box delivers end-to-end builds across blockchain,
                MLM, exchanges, wallets, AI, web, mobile, and launch marketing.
              </p>
            </div>
            <ServicesShowcase />
          </div>
        </section>

        <section className="ctm-section ctm-section-alt">
          <div className="ctm-wrap ctm-why-grid">
            <div className="ctm-panel ctm-list-panel ctm-reveal">
              <h3>{page.whyUsTitle}</h3>
              <ul>
                {page.whyUs.map((item) => (
                  <li key={item}>
                    <span className="ctm-bullet" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ctm-cta-box ctm-reveal" id="quote">
              <h3>Have a custom requirement?</h3>
              <p>
                Need unique workflows, branding, or integrations? Let’s scope the exact build your
                client needs.
              </p>
              <a className="ctm-btn ctm-btn-secondary" href={`mailto:${CONTACT_EMAIL}`}>
                Discuss Your Project
              </a>
            </div>
          </div>
        </section>

        {page.faqs.length ? (
          <section className="ctm-section" id="faq">
            <div className="ctm-wrap">
              <div className="ctm-section-head ctm-reveal">
                <p className="ctm-eyebrow">FAQ</p>
                <h2>{page.faqsTitle}</h2>
                {page.faqsSubtitle ? <p>{page.faqsSubtitle}</p> : null}
              </div>
              <div className="ctm-faq">
                {page.faqs.map((item) => (
                  <details key={item.q} className="ctm-reveal">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="ctm-footer-cta" id="contact">
          <div className="ctm-wrap ctm-reveal">
            <p className="ctm-footer-cta-eyebrow">Get in touch</p>
            <h2>Build your next crypto product with Digital One Box</h2>
            <p>
              Tell us your use case — token, MLM, wallet, or exchange. We will map the right demo,
              scope, and delivery plan.
            </p>

            <ul className="ctm-trust-row" aria-label="Why clients trust us">
              <li>
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Full source ownership
              </li>
              <li>
                <Check className="h-4 w-4" aria-hidden />
                Guided live demo
              </li>
              <li>
                <Users className="h-4 w-4" aria-hidden />
                White-label builds
              </li>
              <li>
                <MessageCircle className="h-4 w-4" aria-hidden />
                Fast sales response
              </li>
            </ul>

            <div className="ctm-footer-cta-actions">
              <a
                className="ctm-btn ctm-btn-primary"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <a className="ctm-btn ctm-btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>
                <Mail className="h-4 w-4" />
                Email sales team
              </a>
              <a
                className="ctm-btn ctm-btn-ghost"
                href={COMPANY_WEBSITE}
                target="_blank"
                rel="noreferrer"
              >
                <Globe className="h-4 w-4" />
                Visit website
              </a>
            </div>

            <div className="ctm-contact-strip">
              <div className="ctm-contact-strip-item">
                <Phone className="h-4 w-4" aria-hidden />
                <div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    {SUPPORT_PHONE}
                  </a>
                  <span aria-hidden> · </span>
                  <a href={WHATSAPP_URL_ALT} target="_blank" rel="noreferrer">
                    {SUPPORT_PHONE_ALT}
                  </a>
                </div>
              </div>
              <a className="ctm-contact-strip-item" href={`mailto:${CONTACT_EMAIL}`}>
                <Mail className="h-4 w-4" aria-hidden />
                {CONTACT_EMAIL}
              </a>
              <a
                className="ctm-contact-strip-item"
                href={COMPANY_WEBSITE}
                target="_blank"
                rel="noreferrer"
              >
                <Globe className="h-4 w-4" aria-hidden />
                {COMPANY_WEBSITE_LABEL}
              </a>
              <div className="ctm-contact-strip-item ctm-contact-strip-address">
                <MapPin className="h-4 w-4" aria-hidden />
                <span>{COMPANY_ADDRESS}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ctm-footer">
        <div className="ctm-wrap ctm-footer-inner">
          <div className="ctm-footer-brand">
            <img src={BRAND_LOGO} alt="Digital One Box" width={160} height={40} />
            <span>© {new Date().getFullYear()} Digital One Box Pvt. Ltd.</span>
          </div>
          <div className="ctm-footer-links">
            <Link to="/">Open Demo Vault</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

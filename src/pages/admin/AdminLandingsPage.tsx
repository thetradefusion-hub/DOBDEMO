import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/RequestDemoModal'
import { useApp } from '@/context/AppContext'
import { createEmptyLanding } from '@/data/landings'
import { getLandingPagePath } from '@/lib/utils'
import type { ProductLanding } from '@/types'

function linesToList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function listToLines(value: string[] = []) {
  return value.join('\n')
}

function parseFeatures(raw: string) {
  return linesToList(raw).map((line) => {
    const [title = '', text = '', accent = 'blue'] = line.split('|').map((part) => part.trim())
    return { title, text, accent: accent || 'blue' }
  })
}

function featuresToLines(features: ProductLanding['features']) {
  return features.map((item) => `${item.title} | ${item.text} | ${item.accent}`).join('\n')
}

function parseTechStack(raw: string) {
  return linesToList(raw).map((line) => {
    const [label = '', role = ''] = line.split('|').map((part) => part.trim())
    return { label, role }
  })
}

function parseFaqs(raw: string) {
  return linesToList(raw).map((line) => {
    const [q = '', a = ''] = line.split('|').map((part) => part.trim())
    return { q, a }
  })
}

function parseWorkflow(raw: string) {
  return linesToList(raw).map((line, index) => {
    const [step = String(index + 1).padStart(2, '0'), title = '', text = ''] = line
      .split('|')
      .map((part) => part.trim())
    return { step, title, text }
  })
}

function parseNetworks(raw: string) {
  return linesToList(raw).map((line) => {
    const [id = '', label = '', short = ''] = line.split('|').map((part) => part.trim())
    return { id: id || label.toLowerCase().replace(/\s+/g, '-'), label, short: short || label.slice(0, 1) }
  })
}

function parseMediaItems(raw: string) {
  return linesToList(raw).map((line, index) => {
    const parts = line.split('|').map((part) => part.trim())
    const typeRaw = (parts[0] || 'image').toLowerCase()
    const type = typeRaw === 'video' ? 'video' : 'image'
    const title = parts[1] || `Media ${index + 1}`
    const url = parts[2] || ''
    const thumbnailUrl = parts[3] || undefined
    return {
      id: `media-${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      type,
      title,
      url,
      thumbnailUrl,
    } as const
  })
}

function mediaToLines(items: { type: string; title: string; url: string; thumbnailUrl?: string }[] = []) {
  return items
    .map((item) =>
      [item.type, item.title, item.url, item.thumbnailUrl].filter(Boolean).join(' | '),
    )
    .join('\n')
}

function parseStats(raw: string) {
  return linesToList(raw).map((line) => {
    const [value = '', label = ''] = line.split('|').map((part) => part.trim())
    return { value, label }
  })
}

export function AdminLandingsPage() {
  const { landings, demos, upsertLanding, deleteLanding } = useApp()
  const [editing, setEditing] = useState<ProductLanding | null>(null)

  const sorted = useMemo(
    () => [...landings].sort((a, b) => a.title.localeCompare(b.title)),
    [landings],
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-white">Landing Pages</h1>
          <p className="mt-1 text-[14px] text-white/50">
            Product / service showcase pages. Link a demo for credentials, then share `/products/slug`
            with clients.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyLanding())}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Landing Page
        </button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="border-b border-white/8 text-[11px] tracking-wide text-white/40 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Linked Demo</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((landing) => {
                const demo = demos.find((item) => item.id === landing.demoId)
                return (
                  <tr key={landing.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">
                        {landing.title} {landing.titleAccent}
                      </div>
                      <div className="max-w-[320px] truncate text-[11px] text-white/40">
                        {landing.subtitle}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={getLandingPagePath(landing.slug)}
                        className="inline-flex items-center gap-1 text-violet-300 hover:underline"
                        target="_blank"
                      >
                        /products/{landing.slug}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white/70">{demo?.title ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          landing.active
                            ? 'bg-emerald-400/15 text-emerald-300'
                            : 'bg-white/8 text-white/40'
                        }`}
                      >
                        {landing.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <IconBtn label="Edit" onClick={() => setEditing(landing)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Delete" onClick={() => deleteLanding(landing.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!sorted.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                    No landing pages yet. Add one for each product or service.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <LandingFormModal
          landing={editing}
          demos={demos.map((item) => ({ id: item.id, title: item.title, slug: item.landingPageSlug }))}
          onClose={() => setEditing(null)}
          onSave={(landing) => {
            upsertLanding(landing)
            setEditing(null)
          }}
        />
      ) : null}
    </div>
  )
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/8 hover:text-white"
    >
      {children}
    </button>
  )
}

function LandingFormModal({
  landing,
  demos,
  onClose,
  onSave,
}: {
  landing: ProductLanding
  demos: { id: string; title: string; slug?: string }[]
  onClose: () => void
  onSave: (landing: ProductLanding) => void
}) {
  const [form, setForm] = useState(landing)
  const [heroChecks, setHeroChecks] = useState(listToLines(landing.heroChecks))
  const [aboutParagraphs, setAboutParagraphs] = useState(landing.aboutParagraphs.join('\n\n'))
  const [features, setFeatures] = useState(featuresToLines(landing.features))
  const [highlights, setHighlights] = useState(listToLines(landing.highlights))
  const [suitableFor, setSuitableFor] = useState(listToLines(landing.suitableFor))
  const [stats, setStats] = useState(
    landing.stats.map((item) => `${item.value} | ${item.label}`).join('\n'),
  )
  const [networks, setNetworks] = useState(
    landing.networks.map((item) => `${item.id} | ${item.label} | ${item.short}`).join('\n'),
  )
  const [mediaItems, setMediaItems] = useState(mediaToLines(landing.mediaItems ?? []))
  const [workflow, setWorkflow] = useState(
    landing.workflow.map((item) => `${item.step} | ${item.title} | ${item.text}`).join('\n'),
  )
  const [techStack, setTechStack] = useState(
    landing.techStack.map((item) => `${item.label} | ${item.role}`).join('\n'),
  )
  const [whyUs, setWhyUs] = useState(listToLines(landing.whyUs))
  const [faqs, setFaqs] = useState(landing.faqs.map((item) => `${item.q} | ${item.a}`).join('\n'))
  const isNew = !landing.slug || landing.title === 'New Product'

  function set<K extends keyof ProductLanding>(key: K, value: ProductLanding[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    if (!slug || !form.title.trim()) return

    onSave({
      ...form,
      slug,
      title: form.title.trim(),
      titleAccent: form.titleAccent.trim(),
      subtitle: form.subtitle.trim(),
      brandLabel: form.brandLabel.trim(),
      heroImageUrl: form.heroImageUrl.trim(),
      demoId: form.demoId || undefined,
      heroChecks: linesToList(heroChecks),
      aboutParagraphs: aboutParagraphs
        .split(/\n\s*\n/)
        .map((item) => item.trim())
        .filter(Boolean),
      features: parseFeatures(features),
      highlights: linesToList(highlights),
      suitableFor: linesToList(suitableFor),
      stats: parseStats(stats),
      networks: parseNetworks(networks),
      mediaItems: parseMediaItems(mediaItems),
      mediaSectionTitle: form.mediaSectionTitle?.trim() || form.demoSectionTitle.trim(),
      mediaSectionSubtitle: form.mediaSectionSubtitle?.trim() || form.demoSectionSubtitle.trim(),
      demoSectionTitle: form.mediaSectionTitle?.trim() || form.demoSectionTitle.trim(),
      demoSectionSubtitle: form.mediaSectionSubtitle?.trim() || form.demoSectionSubtitle.trim(),
      workflow: parseWorkflow(workflow),
      techStack: parseTechStack(techStack),
      whyUs: linesToList(whyUs),
      faqs: parseFaqs(faqs),
    })
  }

  return (
    <Modal
      title={isNew ? 'Add Landing Page' : 'Edit Landing Page'}
      onClose={onClose}
      fullscreen
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid w-full max-w-6xl gap-3 pb-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Field label="Title (before accent)">
          <input className="field" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </Field>
        <Field label="Title accent">
          <input
            className="field"
            value={form.titleAccent}
            onChange={(e) => set('titleAccent', e.target.value)}
            required
          />
        </Field>
        <Field label="URL slug" className="sm:col-span-2 lg:col-span-1">
          <input
            className="field"
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="crypto-token-mlm"
            required
          />
        </Field>
        <Field label="Brand label">
          <input
            className="field"
            value={form.brandLabel}
            onChange={(e) => set('brandLabel', e.target.value)}
          />
        </Field>
        <Field label="Linked demo (credentials)">
          <select
            className="field"
            value={form.demoId ?? ''}
            onChange={(e) => set('demoId', e.target.value)}
          >
            <option value="" className="bg-[#12131e]">
              No linked demo
            </option>
            {demos.map((demo) => (
              <option key={demo.id} value={demo.id} className="bg-[#12131e]">
                {demo.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hero image URL" className="sm:col-span-2 lg:col-span-3">
          <input
            className="field"
            value={form.heroImageUrl}
            onChange={(e) => set('heroImageUrl', e.target.value)}
          />
        </Field>
        <Field label="Subtitle" className="sm:col-span-2 lg:col-span-3">
          <textarea
            className="field min-h-[72px]"
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
          />
        </Field>
        <Field label="Hero checks (one per line)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[88px]" value={heroChecks} onChange={(e) => setHeroChecks(e.target.value)} />
        </Field>
        <Field label="Stats (value | label)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[72px]" value={stats} onChange={(e) => setStats(e.target.value)} />
        </Field>
        <Field label="Networks (id | label | short)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[72px]" value={networks} onChange={(e) => setNetworks(e.target.value)} />
        </Field>
        <Field label="About title" className="sm:col-span-2 lg:col-span-3">
          <input className="field" value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} />
        </Field>
        <Field label="About paragraphs (blank line between)" className="sm:col-span-2 lg:col-span-3">
          <textarea
            className="field min-h-[120px]"
            value={aboutParagraphs}
            onChange={(e) => setAboutParagraphs(e.target.value)}
          />
        </Field>
        <Field label="Features title">
          <input
            className="field"
            value={form.featuresTitle}
            onChange={(e) => set('featuresTitle', e.target.value)}
          />
        </Field>
        <Field label="Features subtitle">
          <input
            className="field"
            value={form.featuresSubtitle}
            onChange={(e) => set('featuresSubtitle', e.target.value)}
          />
        </Field>
        <Field label="Features (title | text | accent)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[140px] font-mono text-[12px]" value={features} onChange={(e) => setFeatures(e.target.value)} />
        </Field>
        <Field label="Highlights title">
          <input
            className="field"
            value={form.highlightsTitle}
            onChange={(e) => set('highlightsTitle', e.target.value)}
          />
        </Field>
        <Field label="Ideal-for title">
          <input
            className="field"
            value={form.suitableTitle}
            onChange={(e) => set('suitableTitle', e.target.value)}
          />
        </Field>
        <Field label="Highlights (one per line)">
          <textarea className="field min-h-[88px]" value={highlights} onChange={(e) => setHighlights(e.target.value)} />
        </Field>
        <Field label="Ideal for (one per line)">
          <textarea className="field min-h-[88px]" value={suitableFor} onChange={(e) => setSuitableFor(e.target.value)} />
        </Field>
        <Field label="Media section title">
          <input
            className="field"
            value={form.mediaSectionTitle || form.demoSectionTitle}
            onChange={(e) => {
              set('mediaSectionTitle', e.target.value)
              set('demoSectionTitle', e.target.value)
            }}
          />
        </Field>
        <Field label="Media section subtitle">
          <input
            className="field"
            value={form.mediaSectionSubtitle || form.demoSectionSubtitle}
            onChange={(e) => {
              set('mediaSectionSubtitle', e.target.value)
              set('demoSectionSubtitle', e.target.value)
            }}
          />
        </Field>
        <Field
          label="Media items (type | title | url | optional thumbnail)"
          className="sm:col-span-2 lg:col-span-3"
        >
          <textarea
            className="field min-h-[140px] font-mono text-[12px]"
            value={mediaItems}
            onChange={(e) => setMediaItems(e.target.value)}
            placeholder={`image | User Dashboard | https://.../user.png\nimage | Admin Dashboard | https://.../admin.png\nvideo | MLM Dashboard | https://youtube.com/watch?v=XXXX\nimage | Staking Module | https://drive.google.com/file/d/.../view`}
          />
          <span className="mt-1 block text-[11px] text-white/40">
            Har line = ek tab. Format: type | tab name | url. type = image ya video (YouTube / Drive / direct link).
          </span>
        </Field>
        <Field label="Workflow title">
          <input
            className="field"
            value={form.workflowTitle}
            onChange={(e) => set('workflowTitle', e.target.value)}
          />
        </Field>
        <Field label="Workflow subtitle">
          <input
            className="field"
            value={form.workflowSubtitle}
            onChange={(e) => set('workflowSubtitle', e.target.value)}
          />
        </Field>
        <Field label="Workflow (step | title | text)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[88px]" value={workflow} onChange={(e) => setWorkflow(e.target.value)} />
        </Field>
        <Field label="Tech title">
          <input className="field" value={form.techTitle} onChange={(e) => set('techTitle', e.target.value)} />
        </Field>
        <Field label="Tech subtitle">
          <input
            className="field"
            value={form.techSubtitle}
            onChange={(e) => set('techSubtitle', e.target.value)}
          />
        </Field>
        <Field label="Tech stack (label | role)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[72px]" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
        </Field>
        <Field label="Why us title" className="sm:col-span-2 lg:col-span-3">
          <input className="field" value={form.whyUsTitle} onChange={(e) => set('whyUsTitle', e.target.value)} />
        </Field>
        <Field label="Why us (one per line)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[72px]" value={whyUs} onChange={(e) => setWhyUs(e.target.value)} />
        </Field>
        <Field label="FAQ title">
          <input className="field" value={form.faqsTitle} onChange={(e) => set('faqsTitle', e.target.value)} />
        </Field>
        <Field label="FAQ subtitle">
          <input
            className="field"
            value={form.faqsSubtitle}
            onChange={(e) => set('faqsSubtitle', e.target.value)}
          />
        </Field>
        <Field label="FAQs (question | answer)" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[120px]" value={faqs} onChange={(e) => setFaqs(e.target.value)} />
        </Field>
        <Field label="Form title">
          <input className="field" value={form.formTitle} onChange={(e) => set('formTitle', e.target.value)} />
        </Field>
        <Field label="Form subtitle">
          <input
            className="field"
            value={form.formSubtitle}
            onChange={(e) => set('formSubtitle', e.target.value)}
          />
        </Field>
        <Field label="Footer CTA title" className="sm:col-span-2 lg:col-span-3">
          <input className="field" value={form.ctaTitle} onChange={(e) => set('ctaTitle', e.target.value)} />
        </Field>
        <Field label="Footer CTA text" className="sm:col-span-2 lg:col-span-3">
          <textarea className="field min-h-[72px]" value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-[13px] text-white/70 sm:col-span-2 lg:col-span-3">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set('active', e.target.checked)}
          />
          Active (publicly visible)
        </label>

        <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-white/10 bg-[#12131e]/95 px-4 py-3 backdrop-blur sm:col-span-2 lg:col-span-3 lg:-mx-0 lg:rounded-xl lg:border lg:px-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-[13px] font-semibold text-white/70"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Save Landing Page
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-[12px] font-semibold text-white/60">{label}</span>
      {children}
    </label>
  )
}

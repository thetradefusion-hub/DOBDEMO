import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Copy, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { Modal } from '@/components/RequestDemoModal'
import { useApp } from '@/context/AppContext'
import { uid } from '@/lib/utils'
import type { Demo } from '@/types'

const emptyDemo = (): Demo => ({
  id: uid('demo'),
  title: '',
  categoryId: 'forex-mlm',
  description: '',
  websiteUrl: '',
  memberPanelUrl: '',
  adminPanelUrl: '',
  username: '',
  password: '',
  featured: false,
  active: true,
  viewCount: 0,
  createdAt: new Date().toISOString(),
})

export function AdminDemosPage() {
  const {
    demos,
    categories,
    getCategory,
    upsertDemo,
    deleteDemo,
    duplicateDemo,
    toggleDemoActive,
    toggleDemoFeatured,
  } = useApp()
  const [editing, setEditing] = useState<Demo | null>(null)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-white">Demos</h1>
          <p className="mt-1 text-[14px] text-white/50">
            Manage dummy demo records locally. Changes appear on the public vault immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              ...emptyDemo(),
              categoryId: categories[0]?.id ?? 'forex-mlm',
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Demo
        </button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="border-b border-white/8 text-[11px] tracking-wide text-white/40 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Demo</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demos.map((demo) => (
                <tr key={demo.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{demo.title}</div>
                    <div className="max-w-[280px] truncate text-[11px] text-white/40">
                      {demo.websiteUrl}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {getCategory(demo.categoryId)?.label ?? demo.categoryId}
                  </td>
                  <td className="px-4 py-3 text-white/70">{demo.viewCount}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleDemoActive(demo.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        demo.active
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'bg-white/8 text-white/40'
                      }`}
                    >
                      {demo.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleDemoFeatured(demo.id)}>
                      <Star
                        className={`h-4 w-4 ${
                          demo.featured ? 'fill-amber-300 text-amber-300' : 'text-white/25'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn label="Edit" onClick={() => setEditing(demo)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label="Duplicate" onClick={() => duplicateDemo(demo.id)}>
                        <Copy className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label="Delete" onClick={() => deleteDemo(demo.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <DemoFormModal
          demo={editing}
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
          onClose={() => setEditing(null)}
          onSave={(demo) => {
            upsertDemo(demo)
            setEditing(null)
          }}
        />
      ) : null}
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/8 hover:text-white"
    >
      {children}
    </button>
  )
}

function DemoFormModal({
  demo,
  categories,
  onClose,
  onSave,
}: {
  demo: Demo
  categories: { id: string; label: string }[]
  onClose: () => void
  onSave: (demo: Demo) => void
}) {
  const [form, setForm] = useState(demo)
  const isNew = useMemo(() => !demo.title, [demo.title])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.websiteUrl.trim()) return
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      websiteUrl: form.websiteUrl.trim(),
      memberPanelUrl: form.memberPanelUrl?.trim() || undefined,
      adminPanelUrl: form.adminPanelUrl?.trim() || undefined,
    })
  }

  function set<K extends keyof Demo>(key: K, value: Demo[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Modal title={isNew ? 'Add Demo' : 'Edit Demo'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Demo Title</span>
          <input className="field" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Category</span>
          <select
            className="field"
            value={form.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#12131e]">
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Description</span>
          <textarea
            className="field min-h-[88px]"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Website URL</span>
          <input
            className="field"
            value={form.websiteUrl}
            onChange={(e) => set('websiteUrl', e.target.value)}
            required
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Member Panel URL</span>
          <input
            className="field"
            value={form.memberPanelUrl ?? ''}
            onChange={(e) => set('memberPanelUrl', e.target.value)}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Admin Panel URL</span>
          <input
            className="field"
            value={form.adminPanelUrl ?? ''}
            onChange={(e) => set('adminPanelUrl', e.target.value)}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Username</span>
          <input className="field" value={form.username} onChange={(e) => set('username', e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Password</span>
          <input className="field" value={form.password} onChange={(e) => set('password', e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-[13px] text-white/70">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-[13px] text-white/70">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set('active', e.target.checked)}
          />
          Active
        </label>
        <div className="flex gap-2 pt-2 sm:col-span-2">
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
            Save Demo
          </button>
        </div>
      </form>
    </Modal>
  )
}

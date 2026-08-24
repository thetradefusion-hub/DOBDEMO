import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/RequestDemoModal'
import { useApp } from '@/context/AppContext'
import { getAccent } from '@/lib/theme'
import type { AccentColor, Category } from '@/types'

const accents: AccentColor[] = ['purple', 'cyan', 'pink', 'green', 'gold']

export function AdminCategoriesPage() {
  const { categories, upsertCategory, deleteCategory } = useApp()
  const [editing, setEditing] = useState<Category | null>(null)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-[14px] text-white/50">
            Visual category management using local dummy data.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              id: '',
              label: '',
              shortLabel: '',
              accent: 'purple',
              description: '',
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const theme = getAccent(category.accent)
          return (
            <article key={category.id} className={`glass rounded-2xl p-4 ${theme.glow}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`mb-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${theme.badge}`}>
                    {category.shortLabel}
                  </div>
                  <h2 className="text-[16px] font-bold text-white">{category.label}</h2>
                  <p className="mt-1 text-[12.5px] text-white/50">{category.description}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(category)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {editing ? (
        <CategoryFormModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={(category) => {
            upsertCategory(category)
            setEditing(null)
          }}
        />
      ) : null}
    </div>
  )
}

function CategoryFormModal({
  category,
  onClose,
  onSave,
}: {
  category: Category
  onClose: () => void
  onSave: (category: Category) => void
}) {
  const [form, setForm] = useState(category)
  const isNew = !category.id

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const label = form.label.trim()
    if (!label) return
    const id =
      form.id ||
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    onSave({
      ...form,
      id,
      label,
      shortLabel: form.shortLabel.trim() || label,
      description: form.description.trim(),
    })
  }

  return (
    <Modal title={isNew ? 'Add Category' : 'Edit Category'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Label</span>
          <input
            className="field"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Short Label</span>
          <input
            className="field"
            value={form.shortLabel}
            onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Description</span>
          <textarea
            className="field min-h-[88px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[12px] font-semibold text-white/60">Accent</span>
          <select
            className="field"
            value={form.accent}
            onChange={(e) => setForm({ ...form, accent: e.target.value as AccentColor })}
          >
            {accents.map((accent) => (
              <option key={accent} value={accent} className="bg-[#12131e]">
                {accent}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 pt-2">
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
            Save Category
          </button>
        </div>
      </form>
    </Modal>
  )
}

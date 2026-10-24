import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

export function RequestDemoModal() {
  const { requestModalOpen, setRequestModalOpen, addRequest, categories } = useApp()

  if (!requestModalOpen) return null

  return (
    <Modal title="Request New Demo" onClose={() => setRequestModalOpen(false)}>
      <RequestForm
        categories={categories.map((c) => ({ id: c.id, label: c.label }))}
        onSubmit={(values) => {
          addRequest(values)
          setRequestModalOpen(false)
        }}
        onCancel={() => setRequestModalOpen(false)}
      />
      <Link
        to="/request-demo"
        onClick={() => setRequestModalOpen(false)}
        className="mt-3 block text-center text-[12px] text-white/40 hover:text-violet-300"
      >
        Open full request page
      </Link>
    </Modal>
  )
}

export function Modal({
  title,
  onClose,
  children,
  wide,
  fullscreen,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  fullscreen?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-[70] flex ${
        fullscreen ? 'items-stretch justify-stretch p-0' : 'items-center justify-center p-4'
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`glass relative flex w-full flex-col overflow-hidden ${
          fullscreen
            ? 'h-dvh max-h-dvh rounded-none p-0'
            : `max-h-[90vh] overflow-y-auto rounded-2xl p-5 ${wide ? 'max-w-2xl' : 'max-w-lg'}`
        }`}
      >
        <div
          className={`flex shrink-0 items-center justify-between ${
            fullscreen
              ? 'border-b border-white/10 px-4 py-3 sm:px-6'
              : 'mb-4'
          }`}
        >
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className={fullscreen ? 'min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5' : undefined}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function RequestForm({
  categories,
  onSubmit,
  onCancel,
}: {
  categories: { id: string; label: string }[]
  onSubmit: (values: {
    name: string
    email: string
    company: string
    categoryId: string
    message: string
  }) => void
  onCancel?: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      categoryId,
      message: message.trim(),
    })
    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Name">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Email">
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field label="Company">
        <input className="field" value={company} onChange={(e) => setCompany(e.target.value)} />
      </Field>
      <Field label="Category">
        <select className="field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#12131e]">
              {c.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message">
        <textarea
          className="field min-h-[110px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </Field>
      <div className="flex gap-2 pt-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-[13px] font-semibold text-white/70"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF] px-4 py-2.5 text-[13px] font-semibold text-white"
        >
          Submit Request
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-white/60">{label}</span>
      {children}
    </label>
  )
}

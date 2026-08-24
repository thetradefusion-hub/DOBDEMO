import { useApp } from '@/context/AppContext'
import type { RequestStatus } from '@/types'

const statuses: RequestStatus[] = ['pending', 'reviewed', 'completed']

export function AdminRequestsPage() {
  const { requests, categories, updateRequestStatus } = useApp()

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white">Requests</h1>
        <p className="mt-1 text-[14px] text-white/50">
          Incoming demo requests stored locally in this browser.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <article key={req.id} className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-white">{req.name}</h2>
                <p className="text-[12.5px] text-white/50">
                  {req.email} {req.company ? `· ${req.company}` : ''}
                </p>
              </div>
              <select
                className="field w-auto"
                value={req.status}
                onChange={(e) => updateRequestStatus(req.id, e.target.value as RequestStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-[#12131e]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 text-[12px] text-white/40">
              {categories.find((c) => c.id === req.categoryId)?.label ?? req.categoryId} ·{' '}
              {new Date(req.createdAt).toLocaleString()}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/70">{req.message}</p>
          </article>
        ))}
        {!requests.length ? (
          <div className="glass rounded-2xl px-6 py-12 text-center text-white/45">
            No demo requests yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}

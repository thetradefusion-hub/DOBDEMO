import { useApp } from '@/context/AppContext'

export function Toast() {
  const { toasts, dismissToast } = useApp()

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`pointer-events-auto animate-toast glass rounded-2xl px-4 py-3 text-left text-[13px] font-medium text-white shadow-2xl ${
            toast.type === 'error'
              ? 'border-rose-400/30'
              : toast.type === 'info'
                ? 'border-cyan-400/20'
                : 'border-emerald-400/25'
          }`}
        >
          <span
            className={`mb-1 block h-1 w-10 rounded-full ${
              toast.type === 'error'
                ? 'bg-rose-400'
                : toast.type === 'info'
                  ? 'bg-cyan-400'
                  : 'bg-emerald-400'
            }`}
          />
          {toast.message}
        </button>
      ))}
    </div>
  )
}

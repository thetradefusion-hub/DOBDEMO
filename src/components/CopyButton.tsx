import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  onCopy: () => void
  copied?: boolean
  label?: string
  className?: string
}

export function CopyButton({ onCopy, copied, label = 'Copy', className = '' }: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onCopy()
      }}
      title={label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/8 hover:text-white ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

import { RequestForm } from '@/components/RequestDemoModal'
import { TrustSection } from '@/components/TrustSection'
import { useApp } from '@/context/AppContext'

export function RequestDemoPage() {
  const { addRequest, categories } = useApp()

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[32px]">
          Request New Demo
        </h1>
        <p className="mt-1 text-[14px] text-white/50">
          Tell us what you need and our team will prepare a premium walkthrough.
        </p>
      </div>

      <div className="glass max-w-xl rounded-2xl p-5">
        <RequestForm
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
          onSubmit={addRequest}
        />
      </div>
      <TrustSection />
    </div>
  )
}

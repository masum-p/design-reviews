import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignCircleIcon } from '@hugeicons/core-free-icons'

export default function PanelCard({ title, addLabel, onAdd, children }) {
  return (
    <section className="flex min-h-[330px] flex-col rounded-lg border border-ink-700 bg-ink-850">
      <div className="flex items-baseline gap-2 px-3 pb-1 pt-3.5">
        <h4 className="text-[13px] font-medium text-[#EDEDED]">{title}</h4>
        
      </div>

      <div className="flex-1 px-1.5 pt-1">{children}</div>

      <div className="px-2 pb-2.5 pt-1">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent-700 hover:bg-ink-800 hover:text-accent-300 active:bg-ink-750"
        >
          <HugeiconsIcon icon={PlusSignCircleIcon} size={15} strokeWidth={1.8} />
          {addLabel}
        </button>
      </div>
    </section>
  )
}

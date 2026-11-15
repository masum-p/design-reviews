import { SECTIONS } from '../../data/estimates.js'
import { money } from '../../lib/format.js'

const labels = { draft: 'Draft', sent: 'Sent', accepted: 'Accepted' }
export default function PipelineBar() {
  return (
    <section aria-label="Estimates by stage" className="grid grid-cols-3 border-y border-line py-4">
      {SECTIONS.map((section) => (
        <div key={section.id} className="px-5 first:pl-0 border-r border-line last:border-r-0">
          <p className="text-[13px] text-slate-500">{labels[section.id]} <span className="ml-1 text-slate-600">{section.rows.length}</span></p>
          <p className="mt-1 text-[19px] font-semibold tracking-tight text-ink tabular-nums">{money(section.total)}</p>
        </div>
      ))}
    </section>
  )
}

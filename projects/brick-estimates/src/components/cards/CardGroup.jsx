import EstimateCard from './EstimateCard'
import { money, plural } from '../../lib/format.js'

/**
 * The same three sections and the same ordering as the grouped list, rendered
 * as a grid. Holding the information architecture constant is deliberate: it
 * makes this a fair comparison of the record itself, card against row, rather
 * than two changes at once.
 *
 * Grouping also keeps the grid honest. A flat grid of eight cards would break
 * its stage bands part way across a row, which is what made the original
 * screen's ordering look arbitrary.
 */
export default function CardGroup({ section }) {
  return (
    <section aria-labelledby={`cards-${section.id}-heading`}>
      <div className="flex items-end justify-between gap-8 pb-4">
        <div>
          <h2
            id={`cards-${section.id}-heading`}
            className="text-[16.5px] leading-tight font-semibold tracking-tight text-ink"
          >
            {section.label}
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">{section.blurb}</p>
        </div>
        <p className="shrink-0 pb-0.5 text-[13px] text-slate-500 tabular-nums">
          {plural(section.rows.length, 'estimate')} ·{' '}
          <span className="font-semibold text-slate-700">{money(section.total)}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 items-stretch gap-5">
        {section.rows.map((estimate) => (
          <EstimateCard key={estimate.id} estimate={estimate} />
        ))}
      </div>
    </section>
  )
}

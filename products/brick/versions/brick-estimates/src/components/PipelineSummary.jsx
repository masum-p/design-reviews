import { Alert02Icon, Invoice01Icon } from '@hugeicons-pro/core-stroke-rounded'
import Icon from '../ui/Icon'
import { SECTIONS } from '../data/estimates.js'
import { plural, splitMoney } from '../lib/format.js'

/**
 * Three figures that map one for one onto the three sections below, in the same
 * order and under the same names. The original screen's tab strip described
 * buckets that matched nothing on the page and did not add up to its own total;
 * this renders from the section list itself, so it cannot drift.
 *
 * The caption is the one problem in that bucket, never a count already shown.
 */
const TONE = {
  draft: { icon: Alert02Icon, text: 'text-amber-700' },
  sent: { icon: Alert02Icon, text: 'text-amber-700' },
  accepted: { icon: Invoice01Icon, text: 'text-brand-ink' },
}

export default function PipelineSummary() {
  return (
    <section aria-label="Pipeline summary" className="grid grid-cols-3 gap-5">
      {SECTIONS.map((section) => {
        const figure = splitMoney(section.total)
        const tone = TONE[section.id]

        return (
          <article
            key={section.id}
            className="rounded-xl border border-line bg-white px-5 py-[18px] shadow-card"
          >
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-semibold text-slate-600">{section.label}</span>
              <span className="text-[12px] font-medium text-slate-500 tabular-nums">
                {plural(section.rows.length, 'estimate')}
              </span>
            </p>

            <p className="mt-2.5 text-[26px] leading-none font-semibold tracking-tight text-ink tabular-nums">
              {figure.dollars}
              <span className="text-[17px] font-medium text-slate-500">{figure.cents}</span>
            </p>

            <p className={`mt-3 flex items-center gap-1.5 text-[13px] font-medium ${tone.text}`}>
              <Icon icon={tone.icon} size={15} strokeWidth={1.9} />
              {section.note}
            </p>
          </article>
        )
      })}
    </section>
  )
}

import { Alert02Icon, Location01Icon, MoreHorizontalIcon } from '@hugeicons-pro/core-stroke-rounded'
import Icon from '../../ui/Icon'
import { money, percent, splitMoney, sum } from '../../lib/format.js'

/**
 * In the grouped list the section heading carries the stage, so rows need no
 * pill. A grid has no heading per card, so here the pill is the only place
 * stage is stated. It is still stated once: no coloured card edge, no second
 * text label, no status glyph on the scope lines.
 */
const PILL = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700' },
  sent: { label: 'Sent', className: 'bg-blue-50 text-blue-700' },
  accepted: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-700' },
}

/** How many scope lines a card shows before it folds the rest into one line. */
const SCOPE_LINES = 3

const META = 'text-[12.5px] text-slate-500'

function Flag({ children }) {
  return (
    <span className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-amber-700">
      <Icon icon={Alert02Icon} size={14} strokeWidth={1.9} />
      {children}
    </span>
  )
}

/**
 * The card footer is the one region that changes by stage, because each stage
 * is asking a different question. Everything above it is identical on every
 * card so the grid stays scannable down a column.
 */
function Footer({ estimate }) {
  const { signal, billing } = estimate

  if (!billing) {
    return (
      <div>
        <p className={META}>
          {signal.primary} · {signal.secondary}
        </p>
        {signal.flag ? <Flag>{signal.flag}</Flag> : null}
      </div>
    )
  }

  return (
    <div>
      <p className={META}>
        {signal.primary} ·{' '}
        <span className={signal.unscheduled ? 'font-medium text-amber-700' : undefined}>
          {signal.secondary}
        </span>
      </p>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-brand" style={{ width: percent(billing.share) }} />
      </div>

      <p className="mt-2 text-[12.5px] text-slate-600 tabular-nums">
        {billing.invoiced === 0
          ? 'Nothing invoiced yet'
          : `Invoiced ${money(billing.invoiced)} of ${money(estimate.value)}`}
      </p>

      {billing.fullyBilled ? (
        <p className="mt-0.5 text-[12.5px] text-slate-500 tabular-nums">
          Fully invoiced{billing.unpaid > 0 ? ` · ${money(billing.unpaid)} unpaid` : ''}
        </p>
      ) : (
        <p className="mt-0.5 text-[12.5px] font-semibold text-brand-ink tabular-nums">
          {money(billing.leftToBill)} left to bill
        </p>
      )}
    </div>
  )
}

export default function EstimateCard({ estimate }) {
  const pill = PILL[estimate.stage]
  const figure = splitMoney(estimate.value)

  /* The visible lines plus the folded remainder always foot to the total. */
  const shown = estimate.scope.slice(0, SCOPE_LINES)
  const hidden = estimate.scope.slice(SCOPE_LINES)
  const hiddenTotal = sum(hidden.map((line) => line.amount))

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${pill.className}`}
        >
          {pill.label}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[11.5px] font-medium text-slate-500 tabular-nums">
            {estimate.id}
          </span>
          <Icon icon={MoreHorizontalIcon} size={17} className="text-slate-400" />
        </span>
      </div>

      <h3 className="mt-3.5 truncate text-[17px] leading-tight font-semibold tracking-tight text-ink">
        {estimate.client}
      </h3>
      <p className="mt-1 truncate text-[13.5px] text-slate-600">{estimate.project}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-slate-500">
        <Icon icon={Location01Icon} size={14} className="text-slate-400" />
        <span className="truncate">{estimate.site}</span>
      </p>

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
          Estimate total
        </p>
        <p className="mt-1.5 text-[25px] leading-none font-semibold tracking-tight text-ink tabular-nums">
          {figure.dollars}
          <span className="text-[16px] font-medium text-slate-500">{figure.cents}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
          Scope
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {shown.map((line) => (
            <li key={line.label} className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[13px] text-slate-600">{line.label}</span>
              <span className="shrink-0 text-[13px] text-slate-700 tabular-nums">
                {money(line.amount)}
              </span>
            </li>
          ))}
          {hidden.length > 0 ? (
            <li className="flex items-baseline justify-between gap-3 text-[13px] text-slate-500">
              <span>
                +{hidden.length} more {hidden.length === 1 ? 'line' : 'lines'}
              </span>
              <span className="shrink-0 tabular-nums">{money(hiddenTotal)}</span>
            </li>
          ) : null}
        </ul>
      </div>

      {/* A flexible spacer keeps a minimum gap and pushes the footer to the bottom,
          so cards in a row end on the same line however many scope lines they have. */}
      <div className="mt-4 grow" />

      <div className="border-t border-line pt-4">
        <Footer estimate={estimate} />
      </div>
    </article>
  )
}

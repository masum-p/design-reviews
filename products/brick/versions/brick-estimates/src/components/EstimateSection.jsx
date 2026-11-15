import { Alert02Icon, MoreHorizontalIcon } from '@hugeicons-pro/core-stroke-rounded'
import Icon from '../ui/Icon'
import TradeChips from '../ui/TradeChips'
import { money, percent, plural } from '../lib/format.js'

/**
 * One geometry, shared by the column header and every row, so the estimate
 * totals form a single vertical line the eye can run down. On the original card
 * grid the total sat at a different height on every card.
 */
const MID = 'w-[288px] shrink-0'
const VALUE = 'w-[156px] shrink-0 text-right'
const MENU = 'w-6 shrink-0'

const HEAD = 'text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase'

/** The one amber line a row is allowed. Amber on this screen only ever means time. */
function Flag({ children }) {
  return (
    <span className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-amber-700">
      <Icon icon={Alert02Icon} size={14} strokeWidth={1.9} />
      {children}
    </span>
  )
}

/**
 * Invoicing as a share of the signed value, labelled in dollars. The original
 * used an unlabelled donut whose arc, percentage and underlying figures gave
 * three different answers; a bar also aligns with its neighbours, which a
 * donut cannot.
 */
function BillingProgress({ estimate }) {
  const { share, invoiced, leftToBill, unpaid, fullyBilled } = estimate.billing
  const { primary, secondary, unscheduled } = estimate.signal

  return (
    <div>
      <p className="text-[12.5px] text-slate-500">
        {primary} ·{' '}
        <span className={unscheduled ? 'font-medium text-amber-700' : undefined}>{secondary}</span>
      </p>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-brand" style={{ width: percent(share) }} />
      </div>

      <p className="mt-2 text-[12.5px] text-slate-600 tabular-nums">
        {invoiced === 0
          ? 'Nothing invoiced yet'
          : `Invoiced ${money(invoiced)} of ${money(estimate.value)}`}
      </p>

      {fullyBilled ? (
        <p className="mt-0.5 text-[12.5px] text-slate-500 tabular-nums">
          Fully invoiced{unpaid > 0 ? ` · ${money(unpaid)} unpaid` : ''}
        </p>
      ) : (
        <p className="mt-0.5 text-[12.5px] font-semibold text-brand-ink tabular-nums">
          {money(leftToBill)} left to bill
        </p>
      )}
    </div>
  )
}

/** Sent and draft rows share a shape: what happened, then what it means. */
function ActivitySignal({ signal }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-ink">{signal.primary}</p>
      {signal.secondary ? (
        <p className="mt-0.5 text-[12.5px] text-slate-500">{signal.secondary}</p>
      ) : null}
      {signal.flag ? <Flag>{signal.flag}</Flag> : null}
    </div>
  )
}

export default function EstimateSection({ section }) {
  const isBilling = section.id === 'accepted'

  return (
    <section aria-labelledby={`${section.id}-heading`}>
      <div className="flex items-end justify-between gap-8 pb-3">
        <div>
          <h2
            id={`${section.id}-heading`}
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

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <div className="flex items-center gap-5 border-b border-line bg-slate-50/60 px-6 py-2.5">
          <span className={`min-w-0 flex-1 ${HEAD}`}>Client and job</span>
          <span className={`${MID} ${HEAD}`}>{section.columnLabel}</span>
          <span className={`${VALUE} ${HEAD}`}>Estimate total</span>
          <span className={MENU} />
        </div>

        {section.rows.map((estimate) => (
          <div
            key={estimate.id}
            className="flex items-center gap-5 border-b border-line px-6 py-4 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <span className="truncate text-[15px] font-semibold text-ink">
                  {estimate.client}
                </span>
                <span className="shrink-0 text-[11.5px] font-medium text-slate-500 tabular-nums">
                  {estimate.id}
                </span>
              </p>
              <p className="mt-0.5 truncate text-[13.5px] text-slate-600">
                {estimate.project}
                <span className="text-slate-500"> · {estimate.site}</span>
              </p>
              <TradeChips trades={estimate.trades} />
            </div>

            <div className={MID}>
              {isBilling ? (
                <BillingProgress estimate={estimate} />
              ) : (
                <ActivitySignal signal={estimate.signal} />
              )}
            </div>

            <p className={`${VALUE} text-[16px] font-semibold text-ink tabular-nums`}>
              {money(estimate.value)}
            </p>

            <span className={`${MENU} flex justify-end text-slate-400`}>
              <Icon icon={MoreHorizontalIcon} size={18} />
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

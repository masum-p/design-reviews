import { money, formatDate } from '../../lib/format.js'

const STAGE = {
  draft: { label: 'Draft', tone: 'bg-slate-100 text-slate-600' },
  sent: { label: 'Sent', tone: 'bg-blue-50 text-blue-700' },
  accepted: { label: 'Accepted', tone: 'bg-emerald-50 text-emerald-700' },
}

function contextFor(estimate) {
  if (estimate.stage === 'draft') return {
    title: 'Ready to review',
    detail: `${estimate.scope.length} priced items · ${estimate.signal.primary.toLowerCase()}`,
    note: 'Not sent to the client', action: 'Review & send',
  }
  if (estimate.stage === 'sent') return {
    title: estimate.openedOn ? 'Awaiting a decision' : 'Not opened yet',
    detail: `${estimate.signal.primary} · ${estimate.openedOn ? estimate.signal.secondary.toLowerCase() : 'no client views'}`,
    note: estimate.signal.expiring ? estimate.signal.flag : `Valid until ${formatDate(estimate.expiresOn)}`,
    action: estimate.openedOn ? 'Follow up' : 'Send reminder',
  }
  return { action: estimate.billing.fullyBilled ? 'View invoices' : 'Create invoice' }
}

function Billing({ billing }) {
  const figures = [
    ['Invoiced', billing.invoiced], ['Not yet invoiced', billing.leftToBill],
    ['Paid', billing.paid], ['Unpaid invoices', billing.unpaid],
  ]
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {figures.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[11.5px] leading-4 text-slate-500">{label}</dt>
          <dd className="mt-1 text-[14px] font-semibold text-slate-700 tabular-nums">{money(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function RefinedCard({ estimate }) {
  const stage = STAGE[estimate.stage]
  const context = contextFor(estimate)
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between text-[12px] text-slate-500">
        <span>{estimate.id}</span>
        <span className={`rounded-md px-2 py-1 font-medium ${stage.tone}`}>{stage.label}</span>
      </div>
      <h3 className="mt-4 text-[17px] leading-tight font-semibold tracking-tight text-ink">{estimate.client}</h3>
      <p className="mt-1 min-h-10 text-[13px] leading-5 text-slate-500">{estimate.project}</p>
      <p className="mt-3 text-[27px] leading-none font-semibold tracking-tight text-ink tabular-nums">{money(estimate.value)}</p>
      <div className="mt-5 min-h-[124px] grow border-t border-line pt-4">
        {estimate.stage === 'accepted' ? <Billing billing={estimate.billing} /> : (
          <div>
            <p className="text-[13px] font-semibold text-slate-700">{context.title}</p>
            <p className="mt-2 text-[12.5px] leading-5 text-slate-500">{context.detail}</p>
            <p className={`mt-2 text-[12.5px] ${estimate.signal.expiring ? 'font-medium text-amber-700' : 'text-slate-500'}`}>{context.note}</p>
          </div>
        )}
      </div>
      <span className="mt-4 flex min-h-9 items-center justify-center rounded-lg border border-line px-3 py-2 text-[13px] font-semibold text-brand-ink">{context.action}</span>
    </article>
  )
}

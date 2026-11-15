import {
  ArrowDown01Icon,
  Calendar03Icon,
  PlusSignIcon,
  Search01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import Sidebar from '../Sidebar'
import PipelineBar from './PipelineBar'
import RefinedCard from './RefinedCard'
import Icon from '../../ui/Icon'
import { orderedEstimates } from './order.js'
import { TODAY, estimates, pipelineValue } from '../../data/estimates.js'
import { formatFullDate, money, plural } from '../../lib/format.js'

/**
 * Refined card Estimates screen, served at /?view=refined.
 *
 * Same data as the other two views. The structure is different: no stacked
 * sections, no stat tiles, one flat grid under one proportional pipeline bar.
 * The point is to spend the top of the screen on the shape of the pipeline once
 * and then give the rest of it to the estimates themselves.
 */
export default function RefinedPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar estimateCount={estimates.length} />

      <main className="ml-[240px]">
        <div className="mx-auto flex max-w-[1120px] flex-col px-9 pt-9 pb-12">
          <header className="flex items-start justify-between gap-8">
            <div className="min-w-0">
              <h1 className="text-[30px] leading-none font-semibold tracking-tight text-ink">
                Estimates
              </h1>
              <p className="mt-2.5 text-[13.5px] text-slate-500 tabular-nums">
                {plural(estimates.length, 'open estimate')} ·{' '}
                <span className="font-medium text-slate-600">{money(pipelineValue)}</span> in estimate value
              </p>
            </div>

            {/* Inert by design: this is a static screen, so nothing offers a click it cannot honour. */}
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex w-[248px] items-center gap-2.5 rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-slate-500 shadow-card">
                <Icon icon={Search01Icon} size={16} className="text-slate-400" />
                Search client or estimate
              </span>
              <span className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13.5px] font-medium text-ink shadow-card">
                <Icon icon={Calendar03Icon} size={16} className="text-slate-500" />
                Last 90 days
                <Icon icon={ArrowDown01Icon} size={15} className="text-slate-400" />
              </span>
              <span className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white">
                <Icon icon={PlusSignIcon} size={16} strokeWidth={2.2} />
                New estimate
              </span>
            </div>
          </header>

          <div className="mt-7"><PipelineBar /></div>

          <div className="mt-6 grid grid-cols-3 items-stretch gap-5">
            {orderedEstimates.map((estimate) => (
              <RefinedCard key={estimate.id} estimate={estimate} />
            ))}
          </div>

          <p className="mt-8 border-t border-line pt-5 text-[12.5px] text-slate-500">
            Amounts in USD, excluding tax. Figures as of {formatFullDate(TODAY)}.
          </p>
        </div>
      </main>
    </div>
  )
}

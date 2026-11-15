import {
  ArrowDown01Icon,
  Calendar03Icon,
  PlusSignIcon,
  Search01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import Sidebar from '../Sidebar'
import PipelineSummary from '../PipelineSummary'
import CardGroup from './CardGroup'
import Icon from '../../ui/Icon'
import { SECTIONS, TODAY, estimates, pipelineValue } from '../../data/estimates.js'
import { formatFullDate, money, plural } from '../../lib/format.js'

/**
 * Card variant of the Estimates page, served at /?view=cards.
 *
 * Same data, same sidebar, same summary strip and the same three sections as
 * the grouped list, so the only thing that changes is how one estimate is
 * presented. What a card buys over a row is depth: it has room for the scope
 * lines with their amounts, which is the part of the original Figma screen the
 * list version had to compress into trade chips.
 */
export default function CardsPage() {
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
                <span className="font-medium text-slate-600">{money(pipelineValue)}</span> in play
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

          <div className="mt-7">
            <PipelineSummary />
          </div>

          <div className="mt-10 flex flex-col gap-10">
            {SECTIONS.map((section) => (
              <CardGroup key={section.id} section={section} />
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

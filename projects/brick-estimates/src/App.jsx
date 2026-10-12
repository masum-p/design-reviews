import ProjectsGanttUX from './ProjectsGanttUX'
import ProjectsGantt from './ProjectsGantt'
import ProjectsTimeline from './ProjectsTimeline'
import CombinedDashboard from './CombinedDashboard'
import CardRefinement from './CardRefinement'
import CardOptions from './CardOptions'
import ClaudeResearch from './ClaudeResearch'
import CodexResearch from './CodexResearch'
import ClaudeVersion from './ClaudeVersion'
import CodexVersion from './CodexVersion'
import Redesign from './Redesign'
import {
  ArrowDown01Icon,
  Calendar03Icon,
  PlusSignIcon,
  Search01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import Sidebar from './components/Sidebar'
import PipelineSummary from './components/PipelineSummary'
import EstimateSection from './components/EstimateSection'
import CardsPage from './components/cards/CardsPage'
import RefinedPage from './components/refined/RefinedPage'
import Icon from './ui/Icon'
import { SECTIONS, TODAY, estimates, pipelineValue } from './data/estimates.js'
import { formatFullDate, money, plural } from './lib/format.js'

/**
 * Three presentations of the same screen, for side by side comparison. No
 * router: the variant is read once from the query string at module scope,
 * because this is a static page and the value cannot change while it is open.
 *
 *   /               grouped list
 *   /?view=cards    grouped card grid
 *   /?view=refined  flat card grid under a proportional pipeline bar
 */
const view =
  typeof window === 'undefined'
    ? null
    : new URLSearchParams(window.location.search).get('view')

export default function App() {
  if (view === 'projects-gantt-ux') return <ProjectsGanttUX />
  if (view === 'projects-gantt') return <ProjectsGantt />
  if (view === 'projects') return <ProjectsTimeline />
  if (view === 'combined-cards') return <CombinedDashboard />
  if (view === 'card-refinement') return <CardRefinement />
  if (view === 'card-options') return <CardOptions />
  if (view === 'claude-research') return <ClaudeResearch />
  if (view === 'claude') return <ClaudeVersion />
  if (view === 'codex-research') return <CodexResearch />
  if (view === 'codex') return <CodexVersion />
  if (view === 'redesign') return <Redesign />
  if (view === 'refined') return <RefinedPage />
  if (view === 'cards') return <CardsPage />
  return <EstimatesList />
}

function EstimatesList() {
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
              <EstimateSection key={section.id} section={section} />
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

import {
  ArrowDown01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  FileEditIcon,
  FilterHorizontalIcon,
  HourglassIcon,
  MoreHorizontalIcon,
  PlayCircleIcon,
  PlusSignIcon,
  Search01Icon,
  ThumbsUpIcon,
} from '@hugeicons-pro/core-stroke-standard'
import Sidebar from './components/StandardSidebar'
import Icon from './ui/Icon'
import { researchCards } from './research-data.js'
import './claude-research.css'

// Category tabs exactly as the original shows them, including totals that do not reconcile.
const TABS = [
  ['All', 20, '62.47'],
  ['Draft', 2, '10.12'],
  ['Pending', 3, '22.12'],
  ['Paid', 15, '18.12'],
]

const FIGURE_LABELS = ['Total Invoiced', 'To Be Invoiced', 'Paid', 'Due']

const STATUS_ICON = {
  Draft: FileEditIcon,
  Pending: HourglassIcon,
  Accepted: ThumbsUpIcon,
  paid: CheckmarkCircle01Icon,
  pending: HourglassIcon,
}

const ROW_LABEL = { paid: 'Paid', pending: 'Pending' }

function EstimateCard({ card }) {
  const tone = card.status.toLowerCase()
  const meta = [card.project, `#${card.id}`, card.date].filter(Boolean)

  return (
    <article className="cr-card" aria-label={`Estimate ${card.id}, ${card.client}`}>
      <header className="cr-card-head">
        <div className="cr-card-title">
          <h2>{card.client}</h2>
          <p>
            {meta.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="cr-sep" aria-hidden="true">·</span>}
                {i === meta.length - 1 ? <time>{item}</time> : item}
              </span>
            ))}
          </p>
        </div>
        <span className={`cr-status cr-status-${tone}`}>{card.status}</span>
        <button className="cr-more" aria-label={`More options for estimate ${card.id}`}>
          <Icon icon={MoreHorizontalIcon} size={18} />
        </button>
      </header>

      <section className="cr-money" aria-label="Billing">
        <div className="cr-total">
          <span>Estimate Total</span>
          <strong>${card.total}</strong>
        </div>

        {card.figures && (
          <>
            <dl className="cr-figures">
              {FIGURE_LABELS.map((label, i) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>${card.figures[i]}</dd>
                </div>
              ))}
            </dl>
            <div className="cr-progress">
              <span className="cr-progress-track" aria-hidden="true">
                <span style={{ width: `${card.progress}%` }} />
              </span>
              <span className="cr-progress-value">{card.progress}%</span>
            </div>
          </>
        )}
      </section>

      <ul className="cr-lines" aria-label="Estimate and invoices">
        <li className="cr-line cr-line-estimate">
          <span>Estimate</span>
          <strong>${card.estimate}</strong>
          <span className={`cr-line-status cr-tone-${tone}`} title={card.status}>
            <Icon icon={STATUS_ICON[card.status]} size={14} />
            <span className="cr-visually-hidden">{card.status}</span>
          </span>
        </li>
        {card.rows.map(([name, amount, status]) => (
          <li className="cr-line" key={name}>
            <span>{name}</span>
            <strong>${amount}</strong>
            {status ? (
              <span className={`cr-line-status cr-tone-${status}`}>
                <Icon icon={STATUS_ICON[status]} size={14} />
                {ROW_LABEL[status]}
              </span>
            ) : (
              <span />
            )}
          </li>
        ))}
      </ul>

      {(card.action || card.ready) && (
        <footer className="cr-card-foot">
          {card.ready && <p className="cr-ready">Ready for invoice!</p>}
          {card.action && (
            <button className={`cr-invoice ${card.ready ? 'cr-invoice-ready' : ''}`}>
              <Icon icon={PlusSignIcon} size={15} />
              {card.action}
            </button>
          )}
        </footer>
      )}
    </article>
  )
}

export default function ClaudeResearch() {
  return (
    <div className="claude-research">
      <Sidebar estimateCount={20} reference />

      <main className="cr-main">
        <header className="cr-header">
          <div className="cr-title">
            <h1>Estimates</h1>
            <button className="cr-tutorial">
              <Icon icon={PlayCircleIcon} size={16} />
              Tutorial Video
            </button>
          </div>

          <div className="cr-controls">
            <label className="cr-search">
              <Icon icon={Search01Icon} size={16} />
              <input aria-label="Search Estimate" placeholder="Search Estimate…" />
            </label>
            <button className="cr-control">
              <Icon icon={Calendar03Icon} size={16} />
              May 1 – May 21, 2024
              <Icon icon={ArrowDown01Icon} size={14} />
            </button>
            <button className="cr-control">
              <Icon icon={FilterHorizontalIcon} size={16} />
              Filter Estimates
              <Icon icon={ArrowDown01Icon} size={14} />
            </button>
            <button className="cr-primary">
              <Icon icon={PlusSignIcon} size={16} strokeWidth={2} />
              New Estimate
            </button>
          </div>
        </header>

        <nav className="cr-tabs" aria-label="Estimate categories">
          {TABS.map(([label, count, total], index) => (
            <button
              key={label}
              className={`cr-tab ${index === 0 ? 'cr-tab-active' : ''}`}
              aria-current={index === 0 ? 'true' : undefined}
            >
              <span className="cr-tab-label">
                {label}
                <span className="cr-tab-count">{count}</span>
              </span>
              <span className="cr-tab-amount">${total}k</span>
            </button>
          ))}
        </nav>

        <section className="cr-grid" aria-label="Estimates">
          {researchCards.map((card) => (
            <EstimateCard card={card} key={card.id} />
          ))}
        </section>
      </main>
    </div>
  )
}

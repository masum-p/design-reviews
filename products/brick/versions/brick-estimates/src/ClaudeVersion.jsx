import {
  ArrowDown01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Coins01Icon,
  FileEditIcon,
  FilterHorizontalIcon,
  HourglassIcon,
  Invoice01Icon,
  MailSend01Icon,
  MoneyReceive01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PlayCircleIcon,
  PlusSignIcon,
  Search01Icon,
  ThumbsUpIcon,
} from '@hugeicons-pro/core-stroke-rounded'
import Sidebar from './components/Sidebar'
import Icon from './ui/Icon'
import './claude-version.css'

/*
 * Content is transcribed from the source screenshot (via Redesign.jsx) and kept
 * verbatim, including figures that do not reconcile. Cards are ordered by the
 * next step they need rather than by date: the top row is work that moves an
 * estimate forward, the bottom row is money already in motion.
 */

const STATUS_TOTALS = [
  { label: 'All', count: 20, total: '62.47', active: true },
  { label: 'Draft', count: 2, total: '10.12' },
  { label: 'Pending', count: 3, total: '22.12' },
  { label: 'Paid', count: 15, total: '18.12' },
]

const TASKS = {
  send: { tone: 'draft', icon: PencilEdit02Icon, queue: 'to send' },
  follow: { tone: 'pending', icon: HourglassIcon, queue: 'to follow up' },
  invoice: { tone: 'ready', icon: Invoice01Icon, queue: 'to invoice' },
  collect: { tone: 'due', icon: MoneyReceive01Icon, queue: 'with balance due' },
  continue: { tone: 'settled', icon: Coins01Icon, queue: 'part invoiced' },
}

const ROWS = [
  {
    id: 'move',
    title: 'Move forward',
    hint: 'Send, chase and invoice',
    cards: [
      {
        id: '001087 - 2',
        status: 'Draft',
        client: 'Gary Lindberg',
        project: 'Bathroom Remodel',
        date: 'May 24, 2024',
        total: '1,026.27',
        estimate: '2,718.03',
        rows: [],
        task: 'send',
        nextTitle: 'Finish and send',
        nextNote: 'Review the estimate before sending.',
        action: { label: 'Continue draft', icon: FileEditIcon },
      },
      {
        id: '001087 - 3',
        status: 'Pending',
        client: 'Kathleen Reed',
        project: 'Tile Installation',
        date: 'May 21, 2024',
        total: '3,309.65',
        estimate: '3,309.65',
        rows: [
          ['Demolition & Disposal', '827.41'],
          ['Plumbing', '1,323.86'],
        ],
        task: 'follow',
        nextTitle: 'Follow up with client',
        nextNote: 'Waiting for Kathleen to accept.',
        action: { label: 'Send a reminder', icon: MailSend01Icon },
      },
      {
        id: '001091',
        status: 'Accepted',
        client: 'Gary Lindberg',
        project: 'Carpentry',
        date: 'May 8, 2024',
        total: '2,718.03',
        estimate: '6,271.08',
        rows: [],
        task: 'invoice',
        nextTitle: 'Ready for invoice!',
        nextNote: 'Accepted with no invoices raised yet.',
        action: { label: 'Add invoice for this estimate', icon: PlusSignIcon, strong: true },
      },
    ],
  },
  {
    id: 'money',
    title: 'Get paid',
    hint: 'Invoicing and outstanding payments',
    cards: [
      {
        id: '001088',
        status: 'Accepted',
        client: 'Susan Santoro',
        date: 'May 12, 2024',
        total: '23,335.75',
        estimate: '23,335.75',
        progress: 60,
        figures: ['16,335.03', '7,000.72', '9,334.30', '11,801,11'],
        rows: [
          ['Demolition & Disposal', '8,968.33', 'paid'],
          ['Plumbing', '9,874.67', 'pending'],
          ['Electrical', '997.98', 'pending'],
        ],
        task: 'collect',
        nextTitle: '$11,801,11 due',
        nextNote: '2 items marked pending.',
        action: { label: 'Add another invoice for this estimate', icon: PlusSignIcon },
      },
      {
        id: '001089',
        status: 'Accepted',
        client: 'Ken Trajanovski',
        project: 'Tile Installation',
        date: 'May 10, 2024',
        total: '19,668.52',
        estimate: '19,668.52',
        progress: 100,
        figures: ['12,867.41', '0', '7,867.41', '11,801.11'],
        rows: [
          ['Draw 2', '5,000.00', 'paid'],
          ['Deposit Invoice', '7,867.41', 'pending'],
        ],
        task: 'collect',
        nextTitle: '$11,801.11 due',
        nextNote: '1 item marked pending.',
        action: { label: 'Review payments', icon: MoneyReceive01Icon },
      },
      {
        id: '001090',
        status: 'Accepted',
        client: 'Doris Muller',
        project: 'Tile Service',
        date: 'Mar 24, 2024',
        total: '6,271.08',
        estimate: '6,271.08',
        progress: 74,
        figures: ['4,271.09', '2,119.00', '4,271.09', '0'],
        rows: [['Cheque Payment', '937.09', 'paid']],
        task: 'continue',
        nextTitle: '$2,119.00 left to invoice',
        nextNote: 'Nothing due right now.',
        action: { label: 'Add another invoice for this estimate', icon: PlusSignIcon },
      },
    ],
  },
]

const FIGURE_LABELS = ['Total Invoiced', 'To Be Invoiced', 'Paid', 'Due']

const STATUS_ICON = {
  Draft: FileEditIcon,
  Pending: HourglassIcon,
  Accepted: ThumbsUpIcon,
  paid: CheckmarkCircle01Icon,
  pending: HourglassIcon,
}

const allCards = ROWS.flatMap((row) => row.cards)
const queue = Object.entries(TASKS).map(([key, task]) => ({
  key,
  ...task,
  count: allCards.filter((card) => card.task === key).length,
}))

export default function ClaudeVersion() {
  return (
    <div className="cv-page">
      <Sidebar estimateCount={20} reference />

      <main className="cv-main">
        <header className="cv-header">
          <div className="cv-title">
            <h1>Estimates</h1>
            <button type="button" className="cv-tutorial">
              <Icon icon={PlayCircleIcon} size={16} />
              Tutorial Video
            </button>
          </div>

          <div className="cv-toolbar">
            <label className="cv-search">
              <Icon icon={Search01Icon} size={16} />
              <input aria-label="Search Estimate" placeholder="Search Estimate…" />
            </label>
            <button type="button" className="cv-control">
              <Icon icon={Calendar03Icon} size={16} />
              May 1 – May 21, 2024
              <Icon icon={ArrowDown01Icon} size={14} className="cv-caret" />
            </button>
            <button type="button" className="cv-control">
              <Icon icon={FilterHorizontalIcon} size={16} />
              Filter Estimates
              <Icon icon={ArrowDown01Icon} size={14} className="cv-caret" />
            </button>
            <button type="button" className="cv-primary">
              <Icon icon={PlusSignIcon} size={16} strokeWidth={2} />
              New Estimate
            </button>
          </div>
        </header>

        <div className="cv-overview">
          <div className="cv-totals" role="tablist" aria-label="Estimate status">
            {STATUS_TOTALS.map((s) => (
              <button
                type="button"
                role="tab"
                aria-selected={s.active ? 'true' : 'false'}
                className={`cv-total${s.active ? ' is-active' : ''}`}
                key={s.label}
              >
                <span className="cv-total-label">
                  {s.label}
                  <span className="cv-count">{s.count}</span>
                </span>
                <strong>${s.total}k</strong>
              </button>
            ))}
          </div>

          <section className="cv-queue" aria-label="Next steps for the estimates shown">
            <h2>Next steps · {allCards.length} shown</h2>
            <ul>
              {queue.map((q) => (
                <li key={q.key} className={`cv-chip tone-${q.tone}`}>
                  <Icon icon={q.icon} size={14} />
                  <strong>{q.count}</strong>
                  {q.queue}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="cv-board">
          {ROWS.map((row) => (
            <section className="cv-lane" key={row.id} aria-labelledby={`cv-lane-${row.id}`}>
              <div className="cv-lane-head">
                <h2 id={`cv-lane-${row.id}`}>{row.title}</h2>
                <span>{row.hint}</span>
              </div>
              <div className="cv-grid">
                {row.cards.map((card) => (
                  <EstimateCard card={card} key={card.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

function EstimateCard({ card }) {
  const task = TASKS[card.task]
  const statusKey = card.status.toLowerCase()

  return (
    <article className={`cv-card tone-${task.tone}`}>
      <div className="cv-card-top">
        <span className={`cv-badge is-${statusKey}`}>
          <Icon icon={STATUS_ICON[card.status]} size={12} strokeWidth={2} />
          {card.status}
        </span>
        <span className="cv-id">#{card.id}</span>
        <button
          type="button"
          className="cv-more"
          aria-label={`More options for estimate ${card.id}`}
        >
          <Icon icon={MoreHorizontalIcon} size={18} />
        </button>
      </div>

      <h3 className="cv-client">{card.client}</h3>
      <p className="cv-meta">
        {card.project && <span>{card.project}</span>}
        <time>{card.date}</time>
      </p>

      <div className="cv-money">
        <div className="cv-money-head">
          <div>
            <span className="cv-label">Estimate Total</span>
            <strong className="cv-amount">${card.total}</strong>
          </div>
          {card.figures && (
            <div className="cv-progress" aria-label={`${card.progress}% as shown in original`}>
              <span>{card.progress}%</span>
              <span className="cv-track">
                <span style={{ width: `${card.progress}%` }} />
              </span>
            </div>
          )}
        </div>

        {card.figures && (
          <dl className="cv-figures">
            {FIGURE_LABELS.map((label, i) => (
              <div
                key={label}
                className={label === 'Due' && card.figures[i] !== '0' ? 'is-due' : undefined}
              >
                <dt>{label}</dt>
                <dd>${card.figures[i]}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <ul className="cv-lines">
        <li className="cv-line is-estimate">
          <span>Estimate</span>
          <strong>${card.estimate}</strong>
          <span className={`cv-row-status is-${statusKey}`} title={card.status}>
            <Icon icon={STATUS_ICON[card.status]} size={14} />
            <span className="cv-sr">{card.status}</span>
          </span>
        </li>
        {card.rows.map(([name, amount, status]) => (
          <li className="cv-line" key={name}>
            <span>{name}</span>
            <strong>${amount}</strong>
            {status ? (
              <span className={`cv-row-status is-${status}`}>
                <Icon icon={STATUS_ICON[status]} size={14} />
                {status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            ) : (
              <span />
            )}
          </li>
        ))}
      </ul>

      <div className="cv-next">
        <div className="cv-next-copy">
          <span className="cv-next-icon">
            <Icon icon={task.icon} size={16} />
          </span>
          <div>
            <p className="cv-next-title">{card.nextTitle}</p>
            <p className="cv-next-note">{card.nextNote}</p>
          </div>
        </div>
        <button
          type="button"
          className={`cv-action${card.action.strong ? ' is-strong' : ''}`}
        >
          <Icon icon={card.action.icon} size={15} />
          {card.action.label}
        </button>
      </div>
    </article>
  )
}

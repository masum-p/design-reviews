import { useEffect } from 'react'
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowExpand01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  Calendar03Icon,
  CalendarRemove01Icon,
  Camera01Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  GridViewIcon,
  HourglassIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PlayCircleIcon,
  PlayIcon,
  PlusSignIcon,
  Task01Icon,
  Tick02Icon,
  TimelineListIcon,
} from '@hugeicons-pro/core-stroke-standard'
import Sidebar from './components/StandardSidebar'
import Icon from './ui/Icon'
import './codex-research.css'
import './projects-gantt-ux.css'

/**
 * Projects, Gantt view. Built around the PM's morning questions, in order:
 * what starts today and who is on it, what is late and in which job, when each
 * job finishes, what a task waits on, and where each job stands. Every answer
 * is derived from the visible progress and dates relative to today.
 */

const COL = 29 // px per day (21 days fill the 609px chart; the table takes the remaining 557px)

// Placeholder crew names (the source screen shows photos only). Erin's crew reuses
// the names from the Timeline view; Mike's crew uses names in the same style.
const WORKERS = {
  'erin-1': 'Faruk Ahmad', 'erin-2': 'Rakibul Hassan', 'erin-3': 'Jamal Hossain',
  'erin-4': 'Tufayel Islam', 'erin-5': 'Yeasin Arafat', 'erin-6': 'Jamal Ahmad',
  'mike-1': 'Sabbir Rahman', 'mike-2': 'Nayeem Hossain', 'mike-3': 'Arif Chowdhury',
  'mike-4': 'Tanvir Alam', 'mike-5': 'Mahmud Karim', 'mike-6': 'Imran Kabir',
}
const fullName = (t) => WORKERS[t.avatar]
const DAYS = 21
const ROW = 40
// Task data was captured relative to Fri Mar 10, 2023. It is replayed against
// today (Mon Oct 12, 2026) so every task keeps its distance from today.
const TODAY = new Date(2026, 9, 12) // Monday
const SHIFT = Math.round((TODAY - new Date(2023, 2, 10)) / 864e5)
const d = (month, day) => new Date(2023, month - 1, day + SHIFT)
const AXIS_START = new Date(2026, 9, 5) // Monday, one week before today
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const idx = (date) => Math.round((date - AXIS_START) / 864e5)
const fmt = (date) => `${MON[date.getMonth()]} ${date.getDate()}`
const axis = Array.from({ length: DAYS }, (_, i) => {
  const day = new Date(AXIS_START.getFullYear(), AXIS_START.getMonth(), AXIS_START.getDate() + i)
  return { day, weekend: day.getDay() % 6 === 0, today: +day === +TODAY }
})

const projects = [
  {
    client: 'Erin Hannon',
    service: 'Bathroom Remodel',
    apps: 4,
    tasks: [
      { name: 'Paint', pct: 75, avatar: 'erin-1', start: d(2, 20), end: d(2, 23), days: 3 },
      { name: 'Master Bathroom Shower', pct: 100, avatar: 'erin-2', start: d(2, 19), end: d(2, 25), days: 5 },
      { name: 'Bathroom Door Installation (1)', pct: 0, avatar: 'erin-3', start: d(3, 4), end: d(2, 8), days: 4 },
      { name: 'Master Bathroom Tile Floor Install', pct: 0, avatar: 'erin-4', start: d(3, 10), end: d(3, 11), days: 2 },
      { name: 'Bathroom Shower Install', pct: 0, avatar: 'erin-5', start: d(3, 10), end: d(3, 12), days: 3 },
      { name: 'Master Door Installation', pct: 24, avatar: 'erin-6', start: d(3, 6), end: d(3, 13), days: 7 },
    ],
  },
  {
    client: 'Mike Ehrtermtua',
    service: 'Tiles Service',
    apps: 4,
    tasks: [
      { name: 'Paint', pct: 75, avatar: 'mike-1', start: d(3, 1), end: d(3, 8), days: 9 },
      { name: 'Master Bathroom Shower', pct: 100, avatar: 'mike-2', start: d(3, 1), end: d(3, 8), days: 9 },
      { name: 'Bathroom Door Installation (1)', pct: 0, avatar: 'mike-3', start: d(3, 11), end: d(2, 18), days: 8 },
      { name: 'Master Bathroom Tile Floor Install', pct: 0, avatar: 'mike-4', start: d(3, 10), end: d(3, 11), days: 2 },
      { name: 'Bathroom Shower Install', pct: 0, avatar: 'mike-5', start: d(3, 16), end: d(3, 19), days: 4, after: 3 },
      { name: 'Master Door Installation', pct: 24, avatar: 'mike-6', start: d(2, 10), end: d(3, 23), days: 34 },
    ],
  },
  // Only this project's header is visible in the source, so it is shown collapsed.
  { client: 'Bif Tannen', service: 'Tile Service', apps: 4, tasks: null },
]

const conflict = (t) => t.end < t.start

// Overdue: end date passed, not complete. Late start: start date passed, 0% complete.
// A conflicting end date is not trusted, so it never makes a task overdue.
function statusOf(t) {
  if (t.pct === 100) return 'done'
  if (!conflict(t) && t.end < TODAY) return 'overdue'
  if (t.start < TODAY && t.pct === 0) return 'late'
  if (+t.start === +TODAY && t.pct === 0) return 'today'
  if (t.start <= TODAY) return 'progress'
  return 'upcoming'
}

// Only exceptions get a label; normal states read from the % and the bar.
const EXCEPTION = {
  overdue: { label: 'Overdue', icon: Alert02Icon, tone: 'warn' },
  late: { label: 'Late start', icon: HourglassIcon, tone: 'warn' },
  today: { label: 'Starts today', icon: PlayIcon, tone: 'now' },
}
const CONFLICT = { label: 'End date before start', icon: CalendarRemove01Icon, tone: 'warn' }

function flagsOf(t) {
  const flags = []
  if (EXCEPTION[statusOf(t)]) flags.push(EXCEPTION[statusOf(t)])
  if (conflict(t)) flags.push(CONFLICT)
  return flags
}
const needsAttention = (t) => flagsOf(t).some((f) => f.tone === 'warn')

// Status said once loudly (the briefing) and once quietly in the row: an icon with
// the same shape as the briefing's, named in its tooltip and for screen readers.
const markerOf = (t) => EXCEPTION[statusOf(t)]

// The one-line reason a task is in "Needs attention", most urgent fact first.
function reasonOf(t) {
  const s = statusOf(t)
  if (s === 'overdue') return { icon: Alert02Icon, text: `Overdue · ended ${fmt(t.end)}, ${t.pct}% done` }
  if (s === 'late') return { icon: HourglassIcon, text: `Late start · was to start ${fmt(t.start)}` }
  return { icon: CalendarRemove01Icon, text: `End date before start · ${fmt(t.start)} – ${fmt(t.end)}` }
}

// Planned finish: the latest end date among visible tasks. End dates that fall
// before their start dates are not trusted, so they are left out.
function plannedFinish(tasks) {
  const ends = tasks.filter((t) => !conflict(t)).map((t) => +t.end)
  return ends.length ? new Date(Math.max(...ends)) : null
}
const FINISH_NOTE = 'Latest end date among the tasks shown. End dates that fall before their start date are left out.'

const visible = projects.filter((p) => p.tasks).flatMap((p) => p.tasks.map((t) => ({ ...t, project: p })))
const startsToday = visible.filter((t) => statusOf(t) === 'today')
const attention = visible.filter(needsAttention)

// Bar extent in day columns. A recorded end before the start cannot be drawn,
// so the bar is sized from the task's day count instead.
function span(t) {
  const s = idx(t.start)
  const e = conflict(t) ? s + t.days - 1 : idx(t.end)
  return { s, e, from: Math.max(s, 0), to: Math.min(e, DAYS - 1) }
}

function range(t) {
  const { start, end } = t
  if (!conflict(t) && start.getMonth() === end.getMonth()) return `${fmt(start)} – ${end.getDate()}`
  return `${fmt(start)} – ${fmt(end)}`
}

function Bar({ task, project }) {
  const { s, e, from, to } = span(task)
  const status = statusOf(task)
  if (e < 0) {
    return (
      <span className="gx-earlier">
        <Icon icon={ArrowLeft01Icon} size={12} />
        Earlier{task.pct > 0 && ` · ${task.pct}% done`}
        <span className="gx-sr">, {range(task)}</span>
      </span>
    )
  }
  const width = (to - from + 1) * COL - 4
  // Progress fills the task's whole duration, so the clipped part counts too.
  const filled = Math.min(Math.max((task.pct / 100) * (e - s + 1) * COL - (from - s) * COL - 2, 0), width)
  const dep = task.after != null ? project.tasks[task.after] : null
  // One colour rule: done = success, needs attention = attention, under way = accent, not started = neutral.
  const tone = status === 'done' ? 'done' : needsAttention(task) ? 'warn' : status === 'progress' ? 'progress' : 'normal'
  const label = [
    `${task.name}, ${conflict(task) ? `starts ${fmt(task.start)}, ${task.days} days, end date is before the start date` : `${fmt(task.start)} to ${fmt(task.end)}`}`,
    `${task.pct}% complete`,
    EXCEPTION[status]?.label,
    dep && `starts after ${dep.name}`,
  ]
    .filter(Boolean)
    .join(', ')
  // A clipped bar names its real start; if its fill sits before the window, it names the progress too.
  const clipLabel = `From ${fmt(task.start)}${filled <= 0 && task.pct > 0 ? ` · ${task.pct}% done` : ''}`
  const showClip = s < 0 && width > clipLabel.length * 6 + 24
  return (
    <div
      className={`gx-bar gx-bar-${tone}` + (conflict(task) ? ' gx-bar-conflict' : '') + (s < 0 ? ' gx-bar-clipped' : '')}
      style={{ left: from * COL + 2, width }}
      role="img"
      aria-label={label}
    >
      {filled > 0 && <i style={{ width: filled }} />}
      {showClip && (
        <span>
          <Icon icon={ArrowLeft01Icon} size={12} />
          {clipLabel}
        </span>
      )}
    </div>
  )
}

// Finish-to-start link: drop from the end of the earlier bar into the later one.
function Links({ project, id }) {
  const links = project.tasks.flatMap((t, i) => (t.after == null ? [] : [[t.after, i]]))
  if (!links.length) return null
  return (
    <svg className="gx-links" width={DAYS * COL} height={project.tasks.length * ROW} aria-hidden="true">
      <defs>
        <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1.5 6.5 4 1 6.5" fill="none" stroke="#59636e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {links.map(([a, b]) => {
        const x = (span(project.tasks[a]).to + 1) * COL - 12
        const y = b * ROW + ROW / 2
        return (
          <path
            key={b}
            d={`M${x} ${a * ROW + 30} V${y - 6} q0 6 6 6 H${span(project.tasks[b]).from * COL + 1}`}
            fill="none"
            stroke="#59636e"
            strokeWidth="1.3"
            markerEnd={`url(#${id})`}
          />
        )
      })}
    </svg>
  )
}

// Today briefing: the two morning questions answered before any chart reading.
function Briefing() {
  return (
    <section className="gx-brief" aria-label={`Today, ${DAY[TODAY.getDay()]} ${MONTH[TODAY.getMonth()]} ${TODAY.getDate()}`}>
      <div className="gx-brief-col">
        <h2>
          Starts today<span>{startsToday.length}</span>
        </h2>
        <ul>
          {startsToday.map((t) => (
            <li key={t.project.client + t.name}>
              <img className="gx-avatar" src={`${import.meta.env.BASE_URL}reference/gantt/${t.avatar}.png`} alt={fullName(t)} title={fullName(t)} />
              <span className="gx-brief-task">
                <span className="gx-trunc" title={t.name}>{t.name}</span>
                <small className="gx-trunc" title={t.project.client}>{t.project.client}</small>
              </span>
              <span className="gx-brief-meta">until {fmt(t.end)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="gx-brief-col">
        <h2>
          Needs attention<span>{attention.length}</span>
        </h2>
        <ul>
          {attention.map((t) => {
            const r = reasonOf(t)
            return (
              <li key={t.project.client + t.name}>
                <img className="gx-avatar" src={`${import.meta.env.BASE_URL}reference/gantt/${t.avatar}.png`} alt={fullName(t)} title={fullName(t)} />
                <span className="gx-brief-task">
                  <span className="gx-trunc" title={t.name}>{t.name}</span>
                  <small className="gx-trunc" title={t.project.client}>{t.project.client}</small>
                </span>
                <span className="gx-brief-meta">
                  <Icon icon={r.icon} size={12} strokeWidth={1.8} className="gx-warn-icon" />
                  {r.text}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Marker({ flag }) {
  return (
    <span className={`gx-marker gx-marker-${flag.tone}`} title={flag.label}>
      <Icon icon={flag.icon} size={12} strokeWidth={1.8} />
      <span className="gx-sr">{flag.label}</span>
    </span>
  )
}

// One line per row: the day count lives in the tooltip and the bar's length.
function TaskRow({ task, project }) {
  const marker = markerOf(task)
  const bad = conflict(task)
  const done = task.pct === 100
  return (
    <div className="gx-task" role="row" tabIndex={0}>
      <div className="gx-cells">
        <span role="cell" className="gx-task-cell">
          <span className="gx-name" title={task.name}>{task.name}</span>
          {marker && <Marker flag={marker} />}
        </span>
        <span role="cell" className="gx-who">
          <img className="gx-avatar" src={`${import.meta.env.BASE_URL}reference/gantt/${task.avatar}.png`} alt="" />
          <span className="gx-trunc" title={fullName(task)}>{fullName(task)}</span>
        </span>
        <span role="cell" className={'gx-pct' + (done ? ' gx-pct-done' : task.pct === 0 ? ' gx-pct-zero' : '')}>
          {done && <Icon icon={Tick02Icon} size={12} strokeWidth={2} />}
          {task.pct}%
          {done && <span className="gx-sr">, done</span>}
        </span>
        <span role="cell" className="gx-dates" title={`${task.days} days`}>
          {range(task)}
          <span className="gx-sr">, {task.days} days</span>
          {bad && <Marker flag={CONFLICT} />}
        </span>
      </div>
      <div role="cell" className="gx-lane">
        <Bar task={task} project={project} />
      </div>
    </div>
  )
}

// Project actions, always visible, in the Timeline view's order: camera, clipboard,
// edit, apps, more, expand. "Add event" (from the Gantt source) leads, set apart.
function ProjectTools({ project }) {
  const open = project.tasks != null
  return (
    <div className="gx-actions">
      {open && (
        <>
          <button className="gx-icon-btn" aria-label={`Add event to ${project.client}`} title="Add event"><Icon icon={PlusSignIcon} size={16} /></button>
          <span className="gx-divider" />
        </>
      )}
      <button className="gx-icon-btn" aria-label={`Photos for ${project.client}`}><Icon icon={Camera01Icon} size={16} /></button>
      <button className="gx-icon-btn" aria-label={`Clipboard for ${project.client}`}><Icon icon={Task01Icon} size={16} /></button>
      <button className="gx-icon-btn" aria-label={`Edit ${project.client} project`}><Icon icon={PencilEdit02Icon} size={16} /></button>
      <button className="gx-icon-btn gx-apps" aria-label={`Apps, ${project.apps}`}>
        <Icon icon={GridViewIcon} size={16} />
        <small aria-hidden="true">{project.apps}</small>
      </button>
      <button className="gx-icon-btn" aria-label={`More options for ${project.client}`}><Icon icon={MoreHorizontalIcon} size={16} /></button>
      <button className="gx-icon-btn" aria-label={`Expand ${project.client} project`}><Icon icon={ArrowExpand01Icon} size={16} /></button>
    </div>
  )
}

// Column header for one card. Every card uses the same columns, so days line up across cards.
function GridHead({ legend }) {
  return (
    <div className="gx-head" role="rowgroup">
      <div className="gx-head-row" role="row">
        <div className="gx-cells gx-colheads">
          <span role="columnheader">Task</span>
          <span role="columnheader">Assigned</span>
          <span role="columnheader" className="gx-pct">Progress</span>
          <span role="columnheader">Dates</span>
        </div>
        <div className="gx-axis" role="columnheader">
          <div className="gx-axis-top">
            <strong>{MONTH[AXIS_START.getMonth()]} {AXIS_START.getFullYear()}</strong>
            {/* The key is shown once, in the first card: the cards are read top-down. */}
            {legend && (
              <ul className="gx-legend" aria-label="Chart key">
                <li><i className="gx-key-conflict" />End date before start, sized from day count</li>
                <li>
                  <svg width="20" height="12" aria-hidden="true">
                    <path d="M1 1 V6 q0 4 4 4 H18 M14.5 7 18 10 14.5 13" fill="none" stroke="#59636e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Starts after
                </li>
              </ul>
            )}
          </div>
          <div className="gx-days">
            {axis.map(({ day, weekend, today }) => (
              <span key={+day} className={(weekend ? 'gx-weekend' : '') + (today ? ' gx-today' : '')}>
                <small>{WEEKDAY[day.getDay()]}</small>
                <b>{day.getDate()}</b>
                {today && <span className="gx-sr">Today</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// One card per project, like the Timeline view: name row with actions, tab row, then the project's own grid.
function ProjectCard({ project, index, legend }) {
  const tasks = project.tasks
  const open = tasks != null
  const done = open ? tasks.filter((t) => t.pct === 100).length : 0
  const finish = open ? plannedFinish(tasks) : null
  return (
    <article className={'gx-project' + (open ? '' : ' gx-project-collapsed')} aria-label={`${project.client}, ${project.service}`}>
      <header className="gx-project-head">
        <button
          className="gx-icon-btn gx-toggle"
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${project.client} tasks`}
        >
          <Icon icon={open ? ArrowDown01Icon : ArrowRight01Icon} size={16} />
        </button>
        <h2 title={`${project.client} / ${project.service}`}>
          <span className="gx-trunc">{project.client}</span>
          <span className="gx-sep">/</span>
          <span className="gx-trunc">{project.service}</span>
        </h2>
        {/* Collapsed: no rows are visible, so no finish date or progress is claimed. */}
        {open ? (
          <span className="gx-facts">
            {finish && (
              <span className="gx-finish" title={FINISH_NOTE}>
                Planned finish <b>{fmt(finish)}</b>
                <span className="gx-sr">. {FINISH_NOTE}</span>
              </span>
            )}
            <span className="gx-done" aria-label={`${done} of ${tasks.length} tasks completed`}>
              <i><em style={{ width: `${(done / tasks.length) * 100}%` }} /></i>
              {done}/{tasks.length} completed
            </span>
          </span>
        ) : (
          <span className="gx-collapsed-note">Tasks collapsed</span>
        )}
        <ProjectTools project={project} />
      </header>

      {open && (
        <>
          <nav className="gx-ptabs" aria-label={`${project.client} sections`}>
            <button aria-current="page">General</button>
            <button>More info</button>
            <button>Project financials</button>
          </nav>
          <div className="gx-grid" role="table" aria-label={`${project.client} tasks, ${fmt(AXIS_START)} to ${fmt(axis[DAYS - 1].day)}, ${TODAY.getFullYear()}`}>
            <GridHead legend={legend} />
            <div className="gx-body">
              <div className="gx-overlay" aria-hidden="true">
                {axis.map(({ day, weekend }, i) => weekend && <i key={+day} className="gx-shade" style={{ left: i * COL }} />)}
                {[7, 14].map((i) => <i key={i} className="gx-week-line" style={{ left: i * COL }} />)}
                <i className="gx-now" style={{ left: (idx(TODAY) + 0.5) * COL }} />
              </div>
              <div className="gx-rows" role="rowgroup">
                {tasks.map((t) => (
                  <TaskRow key={t.name} task={t} project={project} />
                ))}
                <Links project={project} id={`gx-arrow-${index}`} />
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  )
}

export default function ProjectsGanttUX() {
  useEffect(() => {
    document.title = 'Gantt View · Projects · BRICK Construction'
  }, [])
  return (
    <div className="notion-research gx-page">
      <Sidebar estimateCount={20} reference activePage="projects" projectTools />
      <main className="nr-main gx-main">
        <nav className="gx-breadcrumb" aria-label="Breadcrumb">
          <button className="gx-icon-btn gx-icon-sm" aria-label="Back"><Icon icon={ArrowLeft01Icon} size={14} /></button>
          <button className="gx-icon-btn gx-icon-sm" aria-label="Forward"><Icon icon={ArrowRight01Icon} size={14} /></button>
          <span>Projects</span>
        </nav>
        <header className="nr-page-head">
          <div>
            <h1>Gantt View</h1>
            <button className="nr-tutorial gx-text-btn"><Icon icon={PlayCircleIcon} size={16} />Tutorial video</button>
          </div>
          <div className="nr-header-actions">
            <button className="nr-primary gx-primary"><Icon icon={PlusSignIcon} size={16} />Add</button>
          </div>
        </header>

        <div className="gx-viewbar">
          <nav className="gx-views" aria-label="Project views">
            <button><Icon icon={Clock01Icon} size={16} />Timeline</button>
            <button><Icon icon={Calendar03Icon} size={16} />Month</button>
            <button aria-current="page"><Icon icon={TimelineListIcon} size={16} />Gantt<small>Beta</small></button>
          </nav>
          <div className="gx-tools">
            <button className="gx-text-btn"><Icon icon={ArrowUpDownIcon} size={16} />Sort</button>
            <button className="gx-text-btn"><Icon icon={FilterHorizontalIcon} size={16} />Filters</button>
          </div>
        </div>

        <Briefing />

        {/* One card per project, as on the Timeline view. All cards share the same columns. */}
        <div className="gx-cards" style={{ '--col': `${COL}px`, '--days': DAYS, '--row': `${ROW}px` }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.client} project={p} index={i} legend={i === 0} />
          ))}
        </div>
      </main>
    </div>
  )
}

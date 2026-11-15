import { useEffect } from 'react'
import {
  Alert02Icon,
  ArrowExpand01Icon,
  ArrowLeft01Icon,
  ArrowUpDownIcon,
  Calendar03Icon,
  Camera01Icon,
  Task01Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  GridViewIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PlayCircleIcon,
  PlusSignIcon,
  TimelineListIcon,
} from '@hugeicons-pro/core-stroke-standard'
import Sidebar from './components/StandardSidebar'
import Icon from './ui/Icon'
import './codex-research.css'
import './projects-gantt.css'

/**
 * Projects, Gantt view. One static screen: each project is a single grid where
 * a task's details and its bar share one row, so nothing has to be matched by eye.
 * Bars are placed from the task's own start date and day count; the chart window
 * for each project is the 16 days shown in the source screen.
 */

const COL = 43.5 // px per day; 16 days fill the 696px chart
const ROW = 44
const TODAY = 10 // March 10, 2023

const MONTHS = { Feb: 1, Mar: 2 }
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Day index relative to the first visible day, both in March 2023.
const offset = ([mon, day], first) =>
  Math.round((new Date(2023, MONTHS[mon], day) - new Date(2023, 2, first)) / 864e5)

const projects = [
  {
    client: 'Erin Hannon',
    service: 'Bathroom Remodel',
    apps: 4,
    first: 1,
    tasks: [
      { name: 'Paint', pct: 75, avatar: 'erin-1', start: ['Feb', 20], end: ['Feb', 23], days: 3 },
      { name: 'Master Bathroom Shower', pct: 100, avatar: 'erin-2', start: ['Feb', 19], end: ['Feb', 25], days: 5 },
      { name: 'Bathroom Door Installation (1)', pct: 0, avatar: 'erin-3', start: ['Mar', 4], end: ['Feb', 8], days: 4 },
      { name: 'Master Bathroom Tile Floor Install', pct: 0, avatar: 'erin-4', start: ['Mar', 10], end: ['Mar', 11], days: 2 },
      { name: 'Bathroom Shower Install', pct: 0, avatar: 'erin-5', start: ['Mar', 10], end: ['Mar', 12], days: 3 },
      { name: 'Master Door Installation', pct: 24, avatar: 'erin-6', start: ['Mar', 6], end: ['Mar', 13], days: 7 },
    ],
  },
  {
    client: 'Mike Ehrtermtua',
    service: 'Tiles Service',
    apps: 4,
    first: 9,
    tasks: [
      { name: 'Paint', pct: 75, avatar: 'mike-1', start: ['Mar', 1], end: ['Mar', 8], days: 9 },
      { name: 'Master Bathroom Shower', pct: 100, avatar: 'mike-2', start: ['Mar', 1], end: ['Mar', 8], days: 9 },
      { name: 'Bathroom Door Installation (1)', pct: 0, avatar: 'mike-3', start: ['Mar', 11], end: ['Feb', 18], days: 8 },
      { name: 'Master Bathroom Tile Floor Install', pct: 0, avatar: 'mike-4', start: ['Mar', 10], end: ['Mar', 11], days: 2 },
      { name: 'Bathroom Shower Install', pct: 0, avatar: 'mike-5', start: ['Mar', 16], end: ['Mar', 19], days: 4, after: 3 },
      { name: 'Master Door Installation', pct: 24, avatar: 'mike-6', start: ['Feb', 10], end: ['Mar', 23], days: 34 },
    ],
  },
  // Only the header of this project is visible in the source screen.
  { client: 'Bif Tannen', service: 'Tile Service', apps: 4, first: 1, tasks: [] },
]

const endBeforeStart = (t) => offset(t.end, 1) < offset(t.start, 1)

// Where a task's bar sits in the 16-day window. A recorded end date that falls
// before the start cannot be drawn, so the bar falls back to the day count.
function span(task, first) {
  const s = offset(task.start, first)
  const e = endBeforeStart(task) ? s + task.days - 1 : offset(task.end, first)
  return { s, e, from: Math.max(s, 0), to: Math.min(e, 15) }
}

function Range({ task }) {
  const [sm, sd] = task.start
  const [em, ed] = task.end
  const bad = endBeforeStart(task)
  return (
    <div className="pg-range">
      <span className={bad ? 'pg-range-bad' : undefined}>
        {sm} {sd} – {em === sm && !bad ? ed : `${em} ${ed}`}
        {bad && (
          <span title="End date is before the start date">
            <Icon icon={Alert02Icon} size={13} />
            <span className="sr-only">End date is before the start date</span>
          </span>
        )}
      </span>
      <small>{task.days} days</small>
    </div>
  )
}

function Lane({ task, first }) {
  const { s, e, from, to } = span(task, first)
  if (e < 0) {
    return (
      <div className="pg-earlier">
        <Icon icon={ArrowLeft01Icon} size={12} />
        {task.start[0]} {task.start[1]} – {task.end[0] === task.start[0] ? task.end[1] : task.end.join(' ')}
      </div>
    )
  }
  const width = (to - from + 1) * COL - 4
  const inside = width > task.name.length * 6.4 + 24
  return (
    <>
      <div
        className={'pg-bar' + (s < 0 ? ' pg-bar-clipped' : '') + (task.pct === 100 ? ' pg-bar-done' : '')}
        style={{ left: from * COL + 2, width }}
        role="img"
        aria-label={`${task.name}, ${task.pct}% complete`}
      >
        <i style={{ width: `${task.pct}%` }} />
        {s < 0 && <Icon icon={ArrowLeft01Icon} size={12} className="pg-bar-arrow" />}
        {inside && <span>{task.name}</span>}
      </div>
      {!inside && (
        <span className="pg-bar-label" style={{ left: (to + 1) * COL + 6 }}>
          {task.name}
        </span>
      )}
    </>
  )
}

// Finish-to-start link: drop from the end of the earlier bar into the later one.
function Links({ project }) {
  const links = project.tasks.flatMap((t, i) => (t.after == null ? [] : [[t.after, i]]))
  if (!links.length) return null
  return (
    <svg className="pg-links" width={16 * COL} height={project.tasks.length * ROW} aria-hidden="true">
      <defs>
        <marker id="pg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1.5 6.5 4 1 6.5" fill="none" stroke="#9aa39c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {links.map(([a, b]) => {
        const pa = span(project.tasks[a], project.first)
        const pb = span(project.tasks[b], project.first)
        const x = (pa.to + 1) * COL - 12
        return (
          <path
            key={b}
            d={`M${x} ${a * ROW + ROW / 2 + 12} V${b * ROW + ROW / 2 - 6} q0 6 6 6 H${pb.from * COL}`}
            fill="none"
            stroke="#9aa39c"
            strokeWidth="1.3"
            markerEnd="url(#pg-arrow)"
          />
        )
      })}
    </svg>
  )
}

function ProjectPanel({ project }) {
  const days = Array.from({ length: 16 }, (_, i) => {
    const d = new Date(2023, 2, project.first + i)
    return { wd: WEEKDAY[d.getDay()], date: d.getDate(), weekend: d.getDay() % 6 === 0 }
  })
  const todayCol = TODAY - project.first
  const rows = project.tasks.length
  return (
    <article className="pg-project">
      <header className="pg-project-head">
        <h2>
          {project.client}
          <span className="pg-sep">/</span>
          <span>{project.service}</span>
        </h2>
        <div className="pg-actions">
          <button aria-label="Photos"><Icon icon={Camera01Icon} size={17} /></button>
          <button aria-label="Clipboard"><Icon icon={Task01Icon} size={17} /></button>
          <button aria-label="Edit project"><Icon icon={PencilEdit02Icon} size={17} /></button>
          <button aria-label={`Apps, ${project.apps}`} className="pg-apps">
            <Icon icon={GridViewIcon} size={17} />
            <small>{project.apps}</small>
          </button>
          <button aria-label="More options"><Icon icon={MoreHorizontalIcon} size={17} /></button>
          <span className="pg-divider" />
          <button aria-label="Expand project"><Icon icon={ArrowExpand01Icon} size={16} /></button>
        </div>
      </header>

      <div className="pg-subhead">
        <nav className="pg-tabs" aria-label={`${project.client} sections`}>
          <button aria-current="page">General</button>
          <button>More info</button>
        </nav>
        <span className="pg-month">March 2023</span>
      </div>

      <div className="pg-body">
        <div className="pg-table" role="table" aria-label={`${project.client} tasks`}>
          <div className="pg-row pg-head" role="row">
            <span role="columnheader">Event</span>
            <span role="columnheader">Progress</span>
            <span role="columnheader">Worker</span>
            <span role="columnheader">Dates</span>
          </div>
          {project.tasks.map((t) => (
            <div className="pg-row" role="row" key={t.name}>
              <span role="cell" className="pg-name">{t.name}</span>
              <span role="cell" className={'pg-pct' + (t.pct === 0 ? ' pg-pct-zero' : '') + (t.pct === 100 ? ' pg-pct-done' : '')}>
                <b>{t.pct}%</b>
                <i><em style={{ width: `${t.pct}%` }} /></i>
              </span>
              <span role="cell">
                <img className="pg-avatar" src={`${import.meta.env.BASE_URL}reference/gantt/${t.avatar}.png`} alt="Assigned worker" />
              </span>
              <span role="cell"><Range task={t} /></span>
            </div>
          ))}
          {rows > 0 && (
            <div className="pg-add">
              <button><Icon icon={PlusSignIcon} size={14} />Add event</button>
            </div>
          )}
        </div>

        <div className="pg-chart" style={{ '--col': `${COL}px` }}>
          <div className="pg-days">
            {days.map((d, i) => (
              <div key={i} className={(d.weekend ? 'pg-weekend' : '') + (i === todayCol ? ' pg-today' : '')}>
                <span>{d.wd}</span>
                <strong>{d.date}</strong>
                {i === todayCol && <span className="sr-only">Today</span>}
              </div>
            ))}
          </div>
          <div className="pg-lanes">
            <div className="pg-weekends" aria-hidden="true">
              {days.map((d, i) => d.weekend && <i key={i} style={{ left: i * COL }} />)}
            </div>
            {project.tasks.map((t) => (
              <div className="pg-lane" key={t.name}>
                <Lane task={t} first={project.first} />
              </div>
            ))}
            <Links project={project} />
            {rows > 0 && <div className="pg-lane pg-lane-add" />}
            <div className="pg-now" style={{ left: (todayCol + 0.5) * COL }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsGantt() {
  useEffect(() => {
    document.title = 'Projects · BRICK Construction'
  }, [])
  return (
    <div className="notion-research pg-page">
      <Sidebar estimateCount={20} reference activePage="projects" />
      <main className="nr-main pg-main">
        <header className="nr-page-head">
          <div>
            <h1>Projects</h1>
            <button className="nr-tutorial"><Icon icon={PlayCircleIcon} size={16} />Tutorial video</button>
          </div>
          <div className="nr-header-actions">
            <button className="nr-primary"><Icon icon={PlusSignIcon} size={17} />New project</button>
          </div>
        </header>

        <div className="pg-viewbar">
          <nav className="nr-tabs pg-views" aria-label="Project views">
            <button><span><Icon icon={Clock01Icon} size={15} />Timeline</span></button>
            <button><span><Icon icon={Calendar03Icon} size={15} />Month</span></button>
            <button aria-current="page"><span><Icon icon={TimelineListIcon} size={15} />Gantt<small>Beta</small></span></button>
          </nav>
          <div className="pg-tools">
            <button><Icon icon={ArrowUpDownIcon} size={15} />Sort</button>
            <button><Icon icon={FilterHorizontalIcon} size={15} />Filters</button>
          </div>
        </div>

        <div className="pg-list">
          {projects.map((p) => (
            <ProjectPanel key={p.client} project={p} />
          ))}
        </div>
      </main>
    </div>
  )
}

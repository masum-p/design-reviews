import { useEffect, useRef, useState } from 'react'
import {
  Alert02Icon,
  ArrowExpand01Icon,
  ArrowLeft01Icon,
  ArrowHorizontalIcon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  Bathtub01Icon,
  Calendar03Icon,
  CalendarRemove01Icon,
  Call02Icon,
  Camera01Icon,
  Clock01Icon,
  Door01Icon,
  FilterHorizontalIcon,
  Folder01Icon,
  GridViewIcon,
  LaborIcon,
  Location01Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  PaintBucketIcon,
  PencilEdit02Icon,
  PlayCircleIcon,
  PlusSignIcon,
  RhombusIcon,
  Task01Icon,
  TimelineListIcon,
  UserIcon,
  Wrench01Icon,
} from '@hugeicons-pro/core-stroke-standard'
import Sidebar from './components/StandardSidebar'
import Icon from './ui/Icon'
import './codex-research.css'
import './projects-timeline.css'

/**
 * Projects, Timeline view. Follows the source frame's structure (title, breadcrumb,
 * one card per project with a coloured left rail, day lanes, More info state) and
 * adds the Today panel and the neutral palette shared with the Gantt view.
 *
 * The source was captured on Sat Apr 15, 2023 (its blue position marker sits in the
 * Apr 15 lane; dates are from 2023). Every date is replayed against today,
 * Mon Oct 12, 2026, keeping its distance from today.
 */

const TODAY = new Date(2026, 9, 12)
const SHIFT = Math.round((TODAY - new Date(2023, 3, 15)) / 864e5)
const d = (month, day) => new Date(2023, month - 1, day + SHIFT)
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fmt = (date) => `${MON[date.getMonth()]} ${date.getDate()}`
const fmtLong = (date) => `${fmt(date)}, ${date.getFullYear()}`
const sameDay = (a, b) => +a === +b

// Faces cropped from the source screenshot (sprite offsets).
const portrait = { FA: [535, 508], RH: [775, 508], TI: [1014, 508], JH: [1256, 508], YA: [832, 916], JA: [979, 916], SA: [1129, 916] }
function Avatar({ id, name }) {
  const [x, y] = portrait[id]
  const label = name ? { role: 'img', 'aria-label': name, title: name } : { 'aria-hidden': true }
  return <i className="px-avatar" {...label} style={{ backgroundPosition: `${10 - x}px ${10 - y}px` }} />
}
const initials = (name) => name.split(' ').map((w) => w[0]).join('')

// A task as shown in the source. Fields the source cuts off (assignee, notes) stay empty.
// Type icons follow the source: paint bucket, bathtub, hard-hat worker, wrench, rhombus.
const task = (name, icon, time, extra = {}) => ({ name, icon, time, ...extra })

const COMPLETE_BY = d(5, 4)
const projects = [
  {
    client: 'Erin Hannon',
    service: 'Bathroom Remodel',
    tone: 'coral',
    done: 6,
    total: 30,
    due: 6,
    apps: 4,
    
    lanes: [
      { date: d(4, 15), hours: true, tasks: [task('Composite Roof Installation', RhombusIcon, '8:00 AM for 4 hours', { person: 'Faruk Ahmad', id: 'FA', notes: 2, flag: true })] },
      {
        date: d(4, 16),
        tasks: [
          task('Master Bathroom Shower', Bathtub01Icon, '8:00 AM for 4.30 hours', { person: 'Rakibul Hassan', id: 'RH', notes: 6 }),
          task('Additional Option: Decorative Band', PaintBucketIcon, '8:00 AM for 4 hours'),
        ],
      },
      { date: d(4, 17), hours: true, tasks: [task('Master Bathroom Shower', Bathtub01Icon, '8:00 AM for 4.30 hours', { person: 'Tufayel Islam', id: 'TI', notes: 29 })] },
      {
        date: d(4, 18),
        tasks: [
          task('Bathroom Door Installation', Bathtub01Icon, '8:00 AM for 4 hours', { person: 'Jamal Hossain', id: 'JH', notes: 2 }),
          task('Paint', PaintBucketIcon, '8:00 AM for 4 hours'),
        ],
      },
      // The source repeats "April 15" after April 18 and greys the lane out. Kept as recorded.
      {
        date: d(4, 15),
        outOfOrder: true,
        tasks: [
          task('Miscellaneous Labor', LaborIcon, '8:00 AM for 4 hours', { person: 'Faruk Ahmad', id: 'FA', notes: 2 }),
          task('Paint', PaintBucketIcon, '8:00 AM for 4 hours'),
        ],
      },
    ],
  },
  { client: 'Ryan Howard', service: 'Bathroom Remodel', tone: 'blue', done: 6, total: 25, apps: 4, details: true },
  {
    client: 'Nijum Chy',
    service: 'Bathroom Remodel',
    tone: 'violet',
    done: 6,
    total: 30,
    due: 2,
    lanes: [
      { date: d(4, 15), tasks: [task('Paint', PaintBucketIcon, '8:00 AM for 4 hours', { person: 'Faruk Ahmad', id: 'FA', notes: 2, flag: true })] },
      {
        date: d(4, 16),
        tasks: [
          task('Master Bathroom Shower', Bathtub01Icon, '8:00 AM for 4.30 hours', { person: 'Rakibul Hassan', id: 'RH', notes: 2 }),
          task('Additional Option: Decorative Band', Wrench01Icon, null),
        ],
      },
      { date: d(4, 17), hours: true, tasks: [task('Master Bathroom Shower', Bathtub01Icon, '8:00 AM for 4.30 hours', { person: 'Tufayel Islam', id: 'TI', notes: 2 })] },
      { date: d(4, 18), milestone: true, tasks: [] },
    ],
  },
]

// The source marks these tasks with an orange clock.
const FLAG = { label: 'Flagged for attention', icon: Clock01Icon }

// Morning briefing, derived only from the visible lanes.
const todays = projects.flatMap((p) =>
  (p.lanes || []).filter((l) => sameDay(l.date, TODAY) && !l.outOfOrder).flatMap((l) => l.tasks.map((t) => ({ ...t, project: p }))),
)
const startTime = (t) => t.time && t.time.split(' for ')[0]
// Same person, same start time, today, on different jobs.
const overlaps = Object.values(
  todays.filter((t) => t.person).reduce((acc, t) => {
    const key = `${t.person}|${startTime(t)}`
    ;(acc[key] = acc[key] || []).push(t)
    return acc
  }, {}),
).filter((group) => new Set(group.map((t) => t.project.client)).size > 1)

const attention = [
  ...overlaps.map((g) => ({
    key: 'overlap' + g[0].person,
    lead: <Avatar id={g[0].id} name={g[0].person} />,
    title: g.map((t) => t.name).join(' and '),
    sub: g.map((t) => t.project.client).join(', '),
    icon: Alert02Icon,
    reason: `Same worker, both at ${startTime(g[0])}`,
    tip: g.map((t) => `${t.name} (${t.project.client})`).join(' and ') + `, both at ${startTime(g[0])}`,
  })),
  ...projects
    .filter((p) => p.due)
    .map((p) => ({ key: 'due' + p.client, lead: <span className="px-initials">{initials(p.client)}</span>, title: p.client, sub: p.service, icon: Clock01Icon, reason: `${p.due} tasks due` })),
  ...projects.flatMap((p) =>
    (p.lanes || [])
      .map((l, i) => ({ l, prev: p.lanes[i - 1] }))
      .filter(({ l }) => l.outOfOrder)
      .map(({ l, prev }) => ({
        key: 'order' + p.client,
        lead: <span className="px-initials">{initials(p.client)}</span>,
        title: p.client,
        sub: l.tasks.map((t) => t.name).join(', '),
        icon: CalendarRemove01Icon,
        reason: `Date out of order · ${fmt(l.date)} listed after ${fmt(prev.date)}`,
      })),
  ),
]

function Briefing() {
  return (
    <section className="px-brief" aria-label={`Today, ${WEEKDAY[TODAY.getDay()]} ${fmtLong(TODAY)}`}>
      <div className="px-brief-col">
        <h2>
          Starts today<span>{todays.length}</span>
        </h2>
        <ul>
          {todays.map((t) => (
            <li key={t.project.client + t.name}>
              <Avatar id={t.id} name={t.person} />
              <span className="px-brief-task">
                <span className="px-trunc" title={t.name}>{t.name}</span>
                {t.flag && <Marker flag={FLAG} />}
                <small className="px-trunc" title={t.project.client}>{t.project.client}</small>
              </span>
              <span className="px-brief-meta">
                {startTime(t)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-brief-col">
        <h2>
          Needs attention<span>{attention.length}</span>
        </h2>
        <ul>
          {attention.map((a) => (
            <li key={a.key} title={a.tip}>
              {a.lead}
              <span className="px-brief-task">
                <span className="px-trunc" title={a.title}>{a.title}</span>
                <small className="px-trunc" title={a.sub}>{a.sub}</small>
              </span>
              <span className="px-brief-meta">
                <Icon icon={a.icon} size={12} strokeWidth={1.8} className="px-warn-icon" />
                {a.reason}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Marker({ flag }) {
  return (
    <span className="px-marker" title={flag.label}>
      <Icon icon={flag.icon} size={14} strokeWidth={1.8} />
      <span className="px-sr">{flag.label}</span>
    </span>
  )
}

function Task({ t }) {
  return (
    <div className="px-task">
      <div className="px-task-title">
        {t.flag && <Marker flag={FLAG} />}
        <Icon icon={t.icon} size={15} />
        <span className="px-trunc" title={t.name}>{t.name}</span>
      </div>
      {t.time && <div className="px-time">{t.time}</div>}
      {t.person && (
        <div className="px-person">
          <Avatar id={t.id} />
          <span className="px-trunc" title={t.person}>{t.person}</span>
        </div>
      )}
      {t.notes != null && (
        <button className="px-notes" aria-label={`${t.notes} notes for ${t.name}`}>
          Notes ({t.notes})
        </button>
      )}
    </div>
  )
}

function Lane({ lane }) {
  const today = sameDay(lane.date, TODAY) && !lane.outOfOrder
  const label = `${WEEKDAY[lane.date.getDay()]} ${fmt(lane.date)}`
  return (
    <div className={'px-lane' + (today ? ' px-lane-today' : '') + (lane.outOfOrder ? ' px-lane-muted' : '')}>
      <div className="px-lane-date">
        <span className="px-connector" aria-hidden="true"><Icon icon={ArrowHorizontalIcon} size={14} /></span>
        {/* The milestone circle covers its lane header in the source; the date moves into the circle. */}
        <span className={lane.milestone ? 'px-sr' : undefined}>{label}</span>
        {today && <span className="px-sr">, today</span>}
        {/* Position marker: blue dot on the header, line through the middle of the lane, behind the cards. */}
        {today && <i className="px-now-dot" aria-hidden="true" />}
      </div>
      {today && <i className="px-now-line" aria-hidden="true" />}
      <div className="px-lane-tasks">
        {lane.tasks.map((t, j) => (
          <Task key={j} t={t} />
        ))}
        {lane.hours && (
          <div className="px-hours">
            <button className="px-icon-btn px-icon-sm" aria-label="Add time"><Icon icon={PlusSignIcon} size={14} /></button>
            <s>5 hours</s>
          </div>
        )}
        {lane.milestone && (
          <div className="px-milestone">
            <span>To be</span>
            <span>completed</span>
            <small>{label}</small>
          </div>
        )}
      </div>
    </div>
  )
}

// Lanes scroll sideways, as in the source; the slim track mirrors the scroll position.
function Schedule({ project }) {
  const ref = useRef(null)
  const [thumb, setThumb] = useState({ left: 0, width: 100 })
  const update = () => {
    const el = ref.current
    if (!el) return
    const width = (el.clientWidth / el.scrollWidth) * 100
    setThumb({ width, left: (el.scrollLeft / el.scrollWidth) * 100 })
  }
  useEffect(update, [])
  return (
    <div className="px-schedule">
      <div className="px-scroller" ref={ref} onScroll={update} tabIndex={0} aria-label={`${project.client} task timeline, scrolls sideways`}>
        <div className="px-lanes">
          {/* Earlier lanes are cut off in the source: shown as a clipped lane, not invented tasks. */}
          <div className="px-earlier">
            <div className="px-lane-date"><span className="px-sr">Earlier lanes</span></div>
            <div className="px-earlier-body" />
          </div>
          {project.lanes.map((l, i) => (
            <Lane key={i} lane={l} />
          ))}
        </div>
      </div>
      <div className="px-schedule-foot">
        {project.due && (
          <button className="px-due-pill" aria-label={`Show ${project.due} due tasks, earlier in the schedule`}>
            <Icon icon={ArrowLeft01Icon} size={12} />
            <Icon icon={Clock01Icon} size={12} />
            {project.due} due
          </button>
        )}
        <div className="px-track" aria-hidden="true">
          <i style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }} />
        </div>
      </div>
    </div>
  )
}

function Details() {
  return (
    <div className="px-details">
      <span className="px-stamp" aria-label={`Estimate approved on ${fmtLong(d(3, 31))}`}>
        <span className="px-stamp-word" aria-hidden="true">Estimate approved</span>
        <span className="px-stamp-date" aria-hidden="true">{fmtLong(d(3, 31))}</span>
      </span>
      <div className="px-facts-row">
        <span className="px-fact"><Icon icon={UserIcon} size={14} />Ryan Howard</span>
        <span className="px-fact"><Icon icon={Folder01Icon} size={14} />Bathroom Remodel</span>
        <span className="px-fact"><Icon icon={Door01Icon} size={14} />Door -1772</span>
      </div>
      <div className="px-contact-actions">
        <button className="px-square-btn" aria-label="Call Ryan Howard"><Icon icon={Call02Icon} size={16} /></button>
        <button className="px-square-btn" aria-label="Email Ryan Howard"><Icon icon={Mail01Icon} size={16} /></button>
        <button className="px-square-btn" aria-label="Ryan Howard's location"><Icon icon={Location01Icon} size={16} /></button>
      </div>
      <div className="px-roles">
        <div>
          <h3>Sales rep.</h3>
          <Contact name="Faruk Ahmad" id="FA" />
        </div>
        <div>
          <h3>Project man.</h3>
          <Contact name="Faruk Ahmad" id="JH" />
        </div>
        <div className="px-workers">
          <h3>Workers</h3>
          <div>
            <Contact name="Yeasin Arafat" id="YA" />
            <Contact name="Jamal Ahmad" id="JA" />
            <Contact name="Safayet Ahmad" id="SA" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Contact({ name, id }) {
  return (
    <div className="px-contact">
      <Avatar id={id} />
      <span>{name}</span>
      <button className="px-icon-btn px-icon-sm" aria-label={`Call ${name}`}><Icon icon={Call02Icon} size={14} /></button>
    </div>
  )
}

// Left rail, as in the source: due badge, completed tasks, complete-by date.
function Rail({ project }) {
  const { due, done, total, client } = project
  return (
    <aside className="px-rail" aria-label={`${client} summary`}>
      {due && (
        <div className="px-due-badge">
          <Icon icon={Clock01Icon} size={18} />
          <span>{due} Due</span>
        </div>
      )}
      <div className="px-rail-block">
        <span className="px-rail-num">{done}/{total}</span>
        <span className="px-rail-label">Completed tasks</span>
        <span className="px-rail-bar" role="img" aria-label={`${done} of ${total} tasks completed`}><i style={{ width: `${(done / total) * 100}%` }} /></span>
      </div>
      <div className="px-rail-block px-rail-split">
        <span className="px-rail-label">Deadline</span>
        <span className="px-rail-date">{fmtLong(COMPLETE_BY)}</span>
      </div>
    </aside>
  )
}

function Project({ project }) {
  const { client, service, apps, details, tone } = project
  return (
    <article className={`px-project px-tone-${tone}`}>
      <Rail project={project} />
      <div className="px-project-main">
        <header className="px-project-head">
          <h2 title={`${client} / ${service}`}>
            <span className="px-trunc">{client}</span>
            <span className="px-sep">/</span>
            <span className="px-trunc">{service}</span>
          </h2>
          <div className="px-actions">
            <button className="px-icon-btn" aria-label={`Photos for ${client}`}><Icon icon={Camera01Icon} size={16} /></button>
            <button className="px-icon-btn" aria-label={`Clipboard for ${client}`}><Icon icon={Task01Icon} size={16} /></button>
            <button className="px-icon-btn" aria-label={`Edit ${client} project`}><Icon icon={PencilEdit02Icon} size={16} /></button>
            <button className="px-icon-btn px-apps" aria-label={apps ? `Apps, ${apps}` : 'Apps'}>
              <Icon icon={GridViewIcon} size={16} />
              {apps && <small aria-hidden="true">{apps}</small>}
            </button>
            <button className="px-icon-btn" aria-label={`More options for ${client}`}><Icon icon={MoreHorizontalIcon} size={16} /></button>
            <button className="px-icon-btn" aria-label={`Expand ${client} project`}><Icon icon={ArrowExpand01Icon} size={16} /></button>
          </div>
        </header>
        <nav className="px-tabs" aria-label={`${client} sections`}>
          <button aria-current={!details ? 'page' : undefined}>General</button>
          <button aria-current={details ? 'page' : undefined}>More info</button>
          <button>Project financials</button>
        </nav>
        {details ? <Details /> : <Schedule project={project} />}
      </div>
    </article>
  )
}

export default function ProjectsTimeline() {
  useEffect(() => {
    document.title = 'Timeline View · Projects · BRICK Construction'
  }, [])
  return (
    <div className="notion-research px-page">
      <Sidebar estimateCount={20} reference activePage="projects" projectTools />
      <main className="nr-main px-main">
        <nav className="px-breadcrumb" aria-label="Breadcrumb">
          <button className="px-icon-btn px-icon-sm" aria-label="Back"><Icon icon={ArrowLeft01Icon} size={14} /></button>
          <button className="px-icon-btn px-icon-sm" aria-label="Forward"><Icon icon={ArrowRight01Icon} size={14} /></button>
          <span>Projects</span>
        </nav>
        <header className="nr-page-head">
          <div>
            <h1>Timeline View</h1>
            <button className="nr-tutorial px-text-btn"><Icon icon={PlayCircleIcon} size={16} />Tutorial video</button>
          </div>
          <div className="nr-header-actions">
            <button className="nr-primary px-primary"><Icon icon={PlusSignIcon} size={16} />Add</button>
          </div>
        </header>

        <div className="px-viewbar">
          <nav className="px-views" aria-label="Project views">
            <button aria-current="page"><Icon icon={Clock01Icon} size={16} />Timeline</button>
            <button><Icon icon={Calendar03Icon} size={16} />Month</button>
            <button><Icon icon={TimelineListIcon} size={16} />Gantt<small>Beta</small></button>
          </nav>
          <div className="px-tools">
            <button className="px-text-btn"><Icon icon={ArrowUpDownIcon} size={16} />Sort</button>
            <button className="px-text-btn"><Icon icon={FilterHorizontalIcon} size={16} />Filters</button>
          </div>
        </div>

        <Briefing />

        <div className="px-projects">
          {projects.map((p, i) => (
            <Project key={i} project={p} />
          ))}
        </div>
      </main>
    </div>
  )
}

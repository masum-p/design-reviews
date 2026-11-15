import { daysBetween, formatDate, money, plural, round2, sum } from '../lib/format.js'

/** Every relative label on the screen is measured from this one date. */
export const TODAY = '2026-09-10'

/** A draft this old has usually already lost the job to whoever answered first. */
const STALE_DRAFT_DAYS = 5

/** Past this, a quote nobody has replied to needs a phone call, not another email. */
const COLD_QUOTE_DAYS = 10

/** A quote inside this window expires before the next weekly review. */
const EXPIRING_SOON_DAYS = 7

/**
 * Eight live estimates for BRICK Construction.
 *
 * Only the scope lines and the dates are authored. Estimate value, section
 * totals, invoicing gaps and every "N days ago" label are derived from them
 * below, so no two numbers on the screen can disagree with each other.
 *
 * `invoicing` exists only on accepted work, because that is the only stage
 * where "have I billed this yet" is a real question.
 */
const records = [
  {
    id: 'EST-1092',
    stage: 'draft',
    client: 'Doris Muller',
    project: 'Entryway tile service',
    site: 'Brighton, NY',
    editedOn: '2026-09-09',
    scope: [
      { trade: 'Demo', label: 'Removal of existing tile', amount: 872.08 },
      { trade: 'Tile', label: 'Tile supply', amount: 2199.0 },
      { trade: 'Labor', label: 'Installation labor', amount: 3200.0 },
    ],
  },
  {
    id: 'EST-1087',
    stage: 'draft',
    client: 'Gary Lindberg',
    project: 'Master bathroom remodel',
    site: 'Rochester, NY',
    editedOn: '2026-09-03',
    scope: [
      { trade: 'Demo', label: 'Demolition and disposal', amount: 1240.0 },
      { trade: 'Plumbing', label: 'Plumbing rough-in', amount: 3180.5 },
      { trade: 'Tile', label: 'Tile and waterproofing', amount: 4620.75 },
      { trade: 'Carpentry', label: 'Fixtures and finish carpentry', amount: 2905.02 },
    ],
  },
  {
    id: 'EST-1089',
    stage: 'sent',
    client: 'Susan Santoro',
    project: 'Full kitchen renovation',
    site: 'Pittsford, NY',
    sentOn: '2026-08-15',
    openedOn: '2026-08-16',
    expiresOn: '2026-09-14',
    scope: [
      { trade: 'Demo', label: 'Demolition and disposal', amount: 2980.0 },
      { trade: 'Cabinetry', label: 'Cabinetry and millwork', amount: 9450.25 },
      { trade: 'Plumbing', label: 'Plumbing and gas', amount: 4120.5 },
      { trade: 'Electrical', label: 'Electrical and lighting', amount: 3285.0 },
      { trade: 'Tile', label: 'Countertops and tile', amount: 3500.0 },
    ],
  },
  {
    id: 'EST-1088',
    stage: 'sent',
    client: 'Kathleen Reed',
    project: 'Kitchen backsplash tiling',
    site: 'Rochester, NY',
    sentOn: '2026-08-26',
    openedOn: null,
    expiresOn: '2026-09-25',
    scope: [
      { trade: 'Prep', label: 'Surface preparation', amount: 486.0 },
      { trade: 'Tile', label: 'Tile supply', amount: 1142.4 },
      { trade: 'Labor', label: 'Installation labor', amount: 1681.25 },
    ],
  },
  {
    id: 'EST-1093',
    stage: 'sent',
    client: 'Ray Delgado',
    project: 'Garage conversion to home office',
    site: 'Webster, NY',
    sentOn: '2026-09-08',
    openedOn: '2026-09-09',
    expiresOn: '2026-10-08',
    scope: [
      { trade: 'Framing', label: 'Framing and insulation', amount: 4850.0 },
      { trade: 'Electrical', label: 'Electrical and lighting', amount: 2940.0 },
      { trade: 'Drywall', label: 'Drywall and finish', amount: 3180.0 },
      { trade: 'Flooring', label: 'Flooring', amount: 1865.0 },
    ],
  },
  {
    id: 'EST-1091',
    stage: 'accepted',
    client: 'Gary Lindberg',
    project: 'Cedar deck and pergola',
    site: 'Rochester, NY',
    acceptedOn: '2026-09-03',
    startsOn: '2026-09-14',
    billing: { invoiced: 0, paid: 0 },
    scope: [
      { trade: 'Materials', label: 'Lumber and hardware', amount: 1418.03 },
      { trade: 'Framing', label: 'Framing labor', amount: 900.0 },
      { trade: 'Carpentry', label: 'Railing and finish', amount: 400.0 },
    ],
  },
  {
    id: 'EST-1090',
    stage: 'accepted',
    client: 'Ken Trajanovski',
    project: 'Basement floor tiling',
    site: 'Greece, NY',
    acceptedOn: '2026-09-07',
    startsOn: null,
    billing: { invoiced: 7867.41, paid: 7867.41 },
    scope: [
      { trade: 'Prep', label: 'Subfloor leveling', amount: 2140.0 },
      { trade: 'Tile', label: 'Tile supply', amount: 7318.52 },
      { trade: 'Labor', label: 'Installation labor', amount: 8610.0 },
      { trade: 'Finishing', label: 'Grout and sealing', amount: 1600.0 },
    ],
  },
  {
    id: 'EST-1086',
    stage: 'accepted',
    client: 'Marisol Vega',
    project: 'Front porch rebuild',
    site: 'Irondequoit, NY',
    acceptedOn: '2026-08-20',
    startsOn: '2026-09-01',
    billing: { invoiced: 12335.03, paid: 9335.03 },
    scope: [
      { trade: 'Demo', label: 'Demolition and haul-away', amount: 1180.0 },
      { trade: 'Framing', label: 'Framing and decking', amount: 6240.0 },
      { trade: 'Carpentry', label: 'Railing and columns', amount: 3410.0 },
      { trade: 'Painting', label: 'Paint and seal', amount: 1505.03 },
    ],
  },
]

/**
 * The middle column of a row. Each stage answers a different question, so each
 * stage builds its own answer rather than being squeezed into shared columns.
 *
 * `flag` is the one amber line a row is allowed. Everything else stays neutral,
 * so amber on this screen always means "time is working against you".
 */
function readSignal(record) {
  if (record.stage === 'draft') {
    const idle = daysBetween(record.editedOn, TODAY)
    return {
      idle,
      primary: idle === 0 ? 'Edited today' : `Edited ${plural(idle, 'day')} ago`,
      secondary: 'Never sent to the client',
      /* The lines above already state the wait, so the flag adds the judgement. */
      flag: idle >= STALE_DRAFT_DAYS ? 'Quote overdue' : null,
    }
  }

  if (record.stage === 'sent') {
    const idle = daysBetween(record.sentOn, TODAY)
    const untilExpiry = daysBetween(TODAY, record.expiresOn)
    const openedDays = record.openedOn ? daysBetween(record.openedOn, TODAY) : null

    let flag = null
    if (untilExpiry <= EXPIRING_SOON_DAYS) flag = `Expires in ${plural(untilExpiry, 'day')}`
    else if (idle >= COLD_QUOTE_DAYS) flag = 'Going cold'

    return {
      idle,
      expiring: untilExpiry <= EXPIRING_SOON_DAYS,
      primary: `Sent ${plural(idle, 'day')} ago`,
      /* Opened-and-silent needs a call; never-opened needs a resend. Different jobs. */
      secondary:
        openedDays === null
          ? 'Client has not opened it'
          : `Opened ${openedDays === 0 ? 'today' : `${plural(openedDays, 'day')} ago`}`,
      flag,
    }
  }

  const idle = daysBetween(record.acceptedOn, TODAY)
  const started = record.startsOn ? daysBetween(record.startsOn, TODAY) >= 0 : false

  return {
    idle,
    unscheduled: !record.startsOn,
    primary: `Accepted ${plural(idle, 'day')} ago`,
    secondary: record.startsOn
      ? `${started ? 'Started' : 'Starts'} ${formatDate(record.startsOn)}`
      : 'Crew not scheduled',
    flag: null,
  }
}

/** Invoicing is always expressed as a share of the signed value, never a bare percent. */
function readBilling(record, value) {
  if (!record.billing) return null

  const { invoiced, paid } = record.billing
  const leftToBill = round2(value - invoiced)

  return {
    invoiced,
    paid,
    leftToBill,
    unpaid: round2(invoiced - paid),
    share: value === 0 ? 0 : invoiced / value,
    fullyBilled: leftToBill === 0,
  }
}

const prepared = records.map((record) => {
  const value = sum(record.scope.map((line) => line.amount))

  return {
    ...record,
    value,
    trades: [...new Set(record.scope.map((line) => line.trade))],
    signal: readSignal(record),
    billing: readBilling(record, value),
  }
})

/**
 * Section order itself never changes, so the page a contractor learns on Monday
 * is the page they get on Friday. Only the order inside a section is ranked, and
 * each one ranks by whatever it is actually about: for unsent and unanswered
 * quotes that is age, because age is the thing that gets worse on its own; for
 * won work it is money not yet invoiced, so a fully billed job sinks to the
 * bottom instead of sitting at the top of a list about billing.
 */
const inStage = (stage, rank) => prepared.filter((row) => row.stage === stage).sort(rank)

const byAge = (a, b) => b.signal.idle - a.signal.idle
const byUnbilled = (a, b) => b.billing.leftToBill - a.billing.leftToBill || byAge(a, b)

const drafts = inStage('draft', byAge)
const sent = inStage('sent', byAge)
const accepted = inStage('accepted', byUnbilled)

const totalOf = (rows) => sum(rows.map((row) => row.value))
const staleDrafts = drafts.filter((row) => row.signal.flag).length
const expiringSoon = sent.filter((row) => row.signal.expiring).length
const goingCold = sent.filter((row) => row.signal.flag && !row.signal.expiring).length

export const leftToBill = sum(accepted.map((row) => row.billing.leftToBill))

/**
 * Three sections in lifecycle order: what you owe a client, what a client owes
 * you an answer on, and what you have already won. The summary strip at the top
 * of the page renders from this same list, so the two can never fall out of step.
 */
export const SECTIONS = [
  {
    id: 'draft',
    label: 'Drafts to finish',
    blurb: 'Waiting on you. None of these has reached a client yet.',
    columnLabel: 'Draft age',
    rows: drafts,
    total: totalOf(drafts),
    note: staleDrafts
      ? `${staleDrafts} overdue to the client`
      : 'All touched in the last few days',
  },
  {
    id: 'sent',
    label: 'Out with clients',
    blurb: 'Sent and awaiting a decision. Longest wait first.',
    columnLabel: 'Client response',
    rows: sent,
    total: totalOf(sent),
    note: expiringSoon
      ? `${expiringSoon} expires within the week`
      : goingCold
        ? `${goingCold} going cold`
        : `${plural(sent.length, 'quote')} awaiting a reply`,
  },
  {
    id: 'accepted',
    label: 'Accepted work',
    blurb: 'Signed work. The bar shows how much of each job has been invoiced.',
    columnLabel: 'Invoicing',
    rows: accepted,
    total: totalOf(accepted),
    note: `${money(leftToBill)} still to invoice`,
  },
]

export const estimates = prepared
export const pipelineValue = sum(prepared.map((row) => row.value))

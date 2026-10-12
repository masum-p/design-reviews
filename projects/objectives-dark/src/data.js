export const PEOPLE = {
  priya: { id: 'priya', name: 'Priya Raman', tint: 'teal' },
  daniel: { id: 'daniel', name: 'Daniel Okafor', tint: 'indigo' },
  marta: { id: 'marta', name: 'Marta Ilves', tint: 'amber' },
  ben: { id: 'ben', name: 'Ben Whitfield', tint: 'rose' },
  sofia: { id: 'sofia', name: 'Sofia Marchetti', tint: 'violet' },
  noah: { id: 'noah', name: 'Noah Kim', tint: 'sky' },
}

export const TEAM = [PEOPLE.priya, PEOPLE.daniel, PEOPLE.marta]

export const OBJECTIVE = {
  title: 'Simplify & clarify our product, messaging, presentations of things we do for this quarter',
  description:
    'So when is it okay to use lorem ipsum? First, lorem ipsum works well for staging. It’s like the props in a furniture store.',
  status: 'On Track',
  progress: 38,
  updatedLabel: '3 days ago',
  team: 'Marketing',
  cycle: 'Q1 Goals',
}

export const CHART_DAYS = ['Dec 1', 'Dec 2', 'Dec 3', 'Dec 4', 'Dec 5', 'Dec 6']

// One entry per day, from the left edge of the plot. `expected` is the plan we
// committed to at the start of the cycle and never changes.
export const INITIAL_ACTUAL = [14, 21, 42]
export const EXPECTED = [8, 18, 30, 44, 62, 63]

export const INITIAL_KEY_RESULTS = [
  {
    id: 'kr-1',
    owner: 'daniel',
    title: 'Maximum paid user acquisition cost of $23',
    unit: '%',
    start: 0,
    current: 70,
    goal: 90,
    due: '2024-06-12',
  },
  {
    id: 'kr-2',
    owner: 'ben',
    title: 'Increase the CTR% to above industry average 3.5%',
    unit: '%',
    start: 0,
    current: 70,
    goal: 90,
    due: '2024-06-12',
  },
  {
    id: 'kr-3',
    owner: 'noah',
    title: '1 test from a product review site for paid promotion',
    unit: '%',
    start: 0,
    current: 70,
    goal: 90,
    due: '2024-06-12',
  },
]

export const INITIAL_INITIATIVES = [
  {
    id: 'in-1',
    owner: 'sofia',
    title: 'Organize an online survey with min 100 answer to rate our various...',
    due: '2024-06-12',
    done: false,
  },
  {
    id: 'in-2',
    owner: 'daniel',
    title: 'Get 6 earned placements in mainstream media',
    due: '2024-06-12',
    done: false,
  },
  {
    id: 'in-3',
    owner: 'noah',
    title: 'Get 6 earned placements in mainstream media',
    due: '2024-06-12',
    done: false,
  },
  {
    id: 'in-4',
    owner: 'ben',
    title: 'Conduct 12 online client surveys and analyse the Results',
    due: '2024-06-12',
    done: true,
  },
]

export const STATUSES = ['On Track', 'At Risk', 'Off Track']

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatValue(value, unit) {
  const rounded = Math.round(value * 100) / 100
  if (unit === '$') return `$${rounded}`
  if (unit === '%') return `${rounded}%`
  return `${rounded}`
}

// Works whether the metric climbs (page count) or falls (cost per signup).
export function keyResultProgress({ start, current, goal }) {
  const span = goal - start
  if (span === 0) return current === goal ? 100 : 0
  const ratio = (current - start) / span
  return Math.max(0, Math.min(100, Math.round(ratio * 100)))
}

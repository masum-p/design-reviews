/* ---------------------------------------------------------------------------
   Illustrative data for the MonRize Merchants overview. Nothing here is live.

   The page now holds two distinct scopes, and the data is grouped to match:

   1. CURRENT POSITION — balances and the upcoming payout run. A snapshot of
      right now; the date filter does not apply to it.
   2. HISTORICAL PERFORMANCE — everything derived from `days`, i.e. the
      selected reporting period Sep 21 – 27, 2026 compared with the 7 days
      before it (Sep 14 – 20).

   Historical figures are all derived from the daily series so the period stays
   internally consistent:

     volume        1,109,600   sum of `days[].volume`
     net revenue      29,970   sum of `days[].revenue` = 2.70% of volume
     payouts       1,052,480   volume − fees (29,970) − reserve held (27,150)
     payments         24,318   succeeded attempts, avg ticket €45.63
     chargebacks          92   0.38% of succeeded payments

   Sun 27 is today, so it is a day still in progress: its totals are partial
   and the page marks it as such rather than presenting it as closed.
--------------------------------------------------------------------------- */

const TODAY = '2026-09-27'

export const period = {
  label: 'Last 7 days',
  range: 'Sep 21 – 27, 2026',
  compare: 'Sep 14 – 20',
  currency: 'EUR',
}

export const days = [
  { day: 'Mon 21', date: '2026-09-21', volume: 148000, prevVolume: 133000, revenue: 4020 },
  { day: 'Tue 22', date: '2026-09-22', volume: 162400, prevVolume: 145600, revenue: 4380 },
  { day: 'Wed 23', date: '2026-09-23', volume: 159600, prevVolume: 142800, revenue: 4310 },
  { day: 'Thu 24', date: '2026-09-24', volume: 184200, prevVolume: 166400, revenue: 4970 },
  { day: 'Fri 25', date: '2026-09-25', volume: 213800, prevVolume: 189200, revenue: 5770 },
  { day: 'Sat 26', date: '2026-09-26', volume: 126400, prevVolume: 116800, revenue: 3410 },
  { day: 'Sun 27', date: '2026-09-27', volume: 115200, prevVolume: 105000, revenue: 3110 },
]

/* Index of the day that has not closed yet, or -1 when the selected range ends
   before today. Everything that marks "in progress" keys off this. */
export const partialIndex = days.findIndex((d) => d.date === TODAY)
export const partialDay = partialIndex === -1 ? null : days[partialIndex].day

export const peakDay = 4 // Fri 25, highlighted in the revenue chart

/* ---- current position (not filtered by the date range) ------------------- */

export const asOf = 'Today 14:00 CET'

export const payoutRun = {
  amount: '€268,340',
  when: 'Mon Sep 28, 09:00 CET',
  merchants: '38 merchants',
  rails: [
    { name: 'SEPA credit transfer', amount: '€214,120' },
    { name: 'SWIFT', amount: '€54,220' },
  ],
}

export const balances = [
  { code: 'EUR', name: 'Euro', native: '€59,609.00', eur: '€59,609', share: 67.0 },
  { code: 'GBP', name: 'British pound', native: '£15,043.00', eur: '€17,492', share: 19.6 },
  { code: 'USD', name: 'US dollar', native: '$10,180.00', eur: '€9,426', share: 10.6 },
  { code: 'UAH', name: 'Ukrainian hryvnia', native: '₴98,110.00', eur: '€2,158', share: 2.4 },
  { code: 'RUB', name: 'Russian ruble', native: '₽33,180.00', eur: '€348', share: 0.4 },
]

export const balanceTotal = '€89,033'

/* ---- historical performance (filtered by the date range) ----------------- */

export const kpis = [
  {
    label: 'Processed volume',
    value: '€1,109,600',
    delta: '+11.1%',
    tone: 'good',
    direction: 'up',
    note: '24,318 payments',
  },
  {
    label: 'Net revenue',
    value: '€29,970',
    delta: '+11.2%',
    tone: 'good',
    direction: 'up',
    note: '2.70% take rate',
  },
  {
    label: 'Reserve withheld',
    value: '€27,150',
    delta: '+2.4%',
    tone: 'flat',
    direction: 'up',
    note: 'During selected period',
  },
  {
    label: 'Chargeback rate',
    value: '0.38%',
    delta: '−0.06 pp',
    tone: 'good',
    direction: 'down',
    note: '92 of 24,318',
  },
]

export const outcomes = {
  attempts: '24,830',
  succeeded: { count: '24,318', share: 97.9 },
  failed: { count: '512', share: 2.1 },
  chargebacks: '92',
}

export const topMerchants = [
  { initials: 'NS', name: 'Northwind Studio', category: 'Digital goods', payout: '€214,380', share: 20.4 },
  { initials: 'LA', name: 'Lumen Apparel', category: 'Clothing', payout: '€168,240', share: 16.0 },
  { initials: 'VH', name: 'Velora Health', category: 'Healthcare', payout: '€142,910', share: 13.6 },
  { initials: 'OT', name: 'Orbit Travel Co.', category: 'Travel', payout: '€98,650', share: 9.4 },
  { initials: 'KA', name: 'Kestrel Audio', category: 'Electronics', payout: '€76,420', share: 7.3 },
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

const fullDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

/** Keeps money arithmetic free of floating point drift. */
export const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100

export const money = (value) => currency.format(round2(value))

/**
 * Splits money so the cents can be set smaller than the dollars. Large display
 * figures stay readable without dropping precision the summary is footing up.
 */
export const splitMoney = (value) => {
  const [dollars, cents] = money(value).split('.')
  return { dollars, cents: `.${cents}` }
}

export const sum = (values) => round2(values.reduce((total, value) => total + value, 0))

export const percent = (share) => `${Math.round(share * 100)}%`

/** Dates are plain YYYY-MM-DD, so read them at local noon to dodge timezone drift. */
export const toDate = (iso) => new Date(`${iso}T12:00:00`)

export const formatDate = (iso) => shortDate.format(toDate(iso))

export const formatFullDate = (iso) => fullDate.format(toDate(iso))

export const daysBetween = (fromIso, toIso) =>
  Math.round((toDate(toIso) - toDate(fromIso)) / 86400000)

export const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`

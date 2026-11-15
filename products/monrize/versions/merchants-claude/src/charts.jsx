/* ---------------------------------------------------------------------------
   Two static SVG charts. Both share the same plot geometry so the gridlines,
   axis type and day labels line up across the row.

   `partial` is the index of a day that has not closed yet (or -1). That day is
   drawn as provisional — dashed line segment and hollow marker on the volume
   chart, outlined bar on the revenue chart — so a partial total is never read
   as a finished one.
--------------------------------------------------------------------------- */

const TOP = 4 // top of the plot area
const BASE = 100 // zero line
const LABEL_Y = 118 // day labels sit below the zero line
const SPAN = BASE - TOP

export function Legend({ items }) {
  return (
    <ul className="legend">
      {items.map((item) => (
        <li key={item.label}>
          <span className={`swatch ${item.kind}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/* Daily processed volume, current period against the one before it. */
export function VolumeChart({ days, partial = -1 }) {
  const width = 660 // card content width, so the last label lands on the edge
  const gutter = 46
  const max = 240000
  const ticks = [240000, 180000, 120000, 60000, 0]

  const x = (i) => gutter + (i * (width - gutter)) / (days.length - 1)
  const y = (v) => BASE - (v / max) * SPAN
  const points = (key, from, to) =>
    days
      .slice(from, to)
      .map((d, i) => `${x(from + i).toFixed(1)},${y(d[key]).toFixed(1)}`)
      .join(' ')

  // The closed part of the series runs solid; the leg into an unfinished day
  // is drawn separately so it can be dashed.
  const lastClosed = partial === -1 ? days.length - 1 : partial - 1

  return (
    <svg className="chart" width={width} height={LABEL_Y + 6} role="img"
      aria-label="Daily processed volume for Sep 21 to 27, 2026 against the previous seven days. Sun 27 is still in progress.">
      {ticks.map((t) => (
        <g key={t}>
          <line className="grid" x1={gutter} x2={width} y1={y(t)} y2={y(t)} />
          <text className="axis" x={gutter - 10} y={y(t) + 4} textAnchor="end">
            {t === 0 ? '€0' : `€${t / 1000}k`}
          </text>
        </g>
      ))}

      <polyline className="series-prev" points={points('prevVolume', 0, days.length)} />
      <polyline className="series-now" points={points('volume', 0, lastClosed + 1)} />
      {partial > 0 && (
        <polyline className="series-now partial" points={points('volume', partial - 1, partial + 1)} />
      )}

      {days.map((d, i) =>
        i === partial ? (
          <circle key={d.day} className="dot open" cx={x(i)} cy={y(d.volume)} r="3" />
        ) : (
          <circle key={d.day} className="dot" cx={x(i)} cy={y(d.volume)} r="2.5" />
        ),
      )}

      {days.map((d, i) => (
        <text key={d.day} className={i === partial ? 'axis partial' : 'axis'}
          x={x(i)} y={LABEL_Y}
          textAnchor={i === 0 ? 'start' : i === days.length - 1 ? 'end' : 'middle'}>
          {d.day}
        </text>
      ))}
    </svg>
  )
}

/* Daily net revenue for the same seven days, peak day picked out in accent. */
export function RevenueChart({ days, peak, partial = -1 }) {
  const width = 392
  const gutter = 42
  const max = 6000
  const ticks = [6000, 4000, 2000, 0]
  const barWidth = 26
  const step = (width - gutter - barWidth) / (days.length - 1)

  const x = (i) => gutter + i * step
  const y = (v) => BASE - (v / max) * SPAN

  const barClass = (i) =>
    i === partial ? 'bar partial' : i === peak ? 'bar peak' : 'bar'

  return (
    <svg className="chart" width={width} height={LABEL_Y + 6} role="img"
      aria-label="Daily net revenue for Sep 21 to 27, 2026, peaking on Friday 25. Sun 27 is still in progress.">
      {ticks.map((t) => (
        <g key={t}>
          <line className="grid" x1={gutter} x2={width} y1={y(t)} y2={y(t)} />
          <text className="axis" x={gutter - 10} y={y(t) + 4} textAnchor="end">
            {t === 0 ? '€0' : `€${t / 1000}k`}
          </text>
        </g>
      ))}

      {days.map((d, i) => (
        <rect key={d.day} className={barClass(i)} rx="2"
          x={x(i)} y={y(d.revenue)} width={barWidth} height={BASE - y(d.revenue)} />
      ))}

      {days.map((d, i) => (
        <text key={d.day} className={i === partial ? 'axis partial' : 'axis'}
          x={x(i) + barWidth / 2} y={LABEL_Y} textAnchor="middle">
          {d.day}
        </text>
      ))}
    </svg>
  )
}

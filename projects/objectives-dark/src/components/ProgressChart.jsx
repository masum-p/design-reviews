import { CHART_DAYS } from '../data'

// Plot geometry in percent of the plot box, matched to the reference layout:
// the first day sits just inside the left edge, the last just inside the right.
const X_START = 8
const X_STEP = 17.5
const GRID_VALUES = [100, 80, 60, 40, 20]
const AXIS_TICKS = [100, 80, 60, 40, 20, 0]

const xFor = (index) => X_START + index * X_STEP
const yFor = (value) => 100 - Math.max(0, Math.min(100, value))

function toPath(points) {
  return points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

export default function ProgressChart({ actual, expected, selectedIndex, onSelect }) {
  const actualPoints = [
    { x: 0, y: yFor(0) },
    ...actual.map((value, index) => ({ x: xFor(index), y: yFor(value) })),
  ]

  const lastActualIndex = actual.length - 1
  const expectedPoints = [
    { x: xFor(lastActualIndex), y: yFor(actual[lastActualIndex]) },
    ...expected
      .map((value, index) => ({ value, index }))
      .filter((point) => point.index > lastActualIndex)
      .map((point) => ({ x: xFor(point.index), y: yFor(point.value) })),
  ]

  const selected = Math.min(selectedIndex, lastActualIndex)
  const selectedValue = actual[selected]
  const plotHeight = 150

  return (
    <section aria-labelledby="chart-heading">
      <h4 id="chart-heading" className="text-[13px] font-medium text-[#EDEDED]">
        Progress Over Time
      </h4>

      <div className="mt-4 flex gap-2">
        <div
          className="relative w-6 text-[10px] tabular-nums leading-none text-faint"
          style={{ height: plotHeight }}
          aria-hidden="true"
        >
          {AXIS_TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${yFor(tick)}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: plotHeight }}>
            {GRID_VALUES.map((value) => (
              <div
                key={value}
                className="absolute inset-x-0 border-t border-dashed border-ink-700"
                style={{ top: `${yFor(value)}%` }}
                aria-hidden="true"
              />
            ))}
            <div
              className="absolute inset-x-0 bottom-0 border-t border-ink-600"
              aria-hidden="true"
            />

            <div
              className="absolute bottom-0 rounded-t bg-accent-400/[0.09]"
              style={{
                left: `${xFor(selected) - 2.75}%`,
                width: '5.5%',
                top: `${yFor(selectedValue)}%`,
              }}
              aria-hidden="true"
            />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <path
                d={toPath(expectedPoints)}
                fill="none"
                stroke="#484848"
                strokeWidth="1.75"
                strokeDasharray="6 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={toPath(actualPoints)}
                fill="none"
                stroke="#3ECF8E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {actual.map((value, index) => (
              <button
                key={CHART_DAYS[index]}
                type="button"
                onClick={() => onSelect(index)}
                onMouseEnter={() => onSelect(index)}
                onFocus={() => onSelect(index)}
                aria-label={`${CHART_DAYS[index]}: ${value} out of 100`}
                aria-pressed={index === selected}
                className="absolute -ml-3 -mt-3 grid h-6 w-6 place-items-center rounded-full"
                style={{ left: `${xFor(index)}%`, top: `${yFor(value)}%` }}
              >
                <span
                  className={`block rounded-full transition-all duration-150 ${
                    index === selected
                      ? 'h-2 w-2 bg-accent-400 ring-[3px] ring-accent-400/20'
                      : 'h-1.5 w-1.5 bg-accent-400/0 ring-2 ring-accent-400/0'
                  }`}
                />
              </button>
            ))}

            {/* Clamped inside the plot box so the first and last day never clip. */}
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: `${Math.max(28, Math.min(72, xFor(selected)))}%`,
                top: `${yFor(selectedValue)}%`,
                transform: 'translate(-50%, calc(-100% - 12px))',
              }}
              role="status"
            >
              <div className="whitespace-nowrap rounded-md border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-[11px] font-medium text-[#D4D4D4] shadow-md shadow-black/30">
                You hit <span className="tabular-nums text-accent-300">{selectedValue}</span> on{' '}
                {CHART_DAYS[selected]}
              </div>
            </div>
          </div>

          <div className="relative mt-2 h-3.5" aria-hidden="true">
            {CHART_DAYS.map((day, index) => (
              <span
                key={day}
                className={`absolute -translate-x-1/2 whitespace-nowrap text-[10px] tabular-nums ${
                  index === selected ? 'font-medium text-[#D4D4D4]' : 'text-faint'
                }`}
                style={{ left: `${xFor(index)}%` }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 rounded-full bg-accent-400" />
          Current Progress
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 rounded-full bg-[#606060]" />
          Expected Progress
        </span>
      </div>
    </section>
  )
}

import RingAvatar from './RingAvatar'
import { PEOPLE, formatDate, formatValue, keyResultProgress } from '../data'

export default function KeyResultRow({ keyResult, onEdit }) {
  const person = PEOPLE[keyResult.owner]
  const progress = keyResultProgress(keyResult)

  return (
    <button
      type="button"
      onClick={() => onEdit(keyResult)}
      className="group flex w-full gap-2.5 rounded-lg px-2 py-3 text-left transition-colors hover:bg-ink-800 active:bg-ink-750"
    >
      <RingAvatar person={person} progress={progress} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-medium leading-snug text-[#D4D4D4] transition-colors group-hover:text-white">
            {keyResult.title}
          </p>
        </div>

        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] leading-tight text-muted">
          <span>Start: {formatValue(keyResult.start, keyResult.unit)}</span>
          <span className="text-ink-600">&bull;</span>
          <span>Current: {formatValue(keyResult.current, keyResult.unit)}</span>
          <span className="text-ink-600">&bull;</span>
          <span>Goal: {formatValue(keyResult.goal, keyResult.unit)}</span>
        </p>
        <p className="mt-1 text-[11px] leading-tight text-faint">
          {formatDate(keyResult.due)}
          <span className="sr-only">, owned by {person.name}</span>
        </p>
      </div>
    </button>
  )
}

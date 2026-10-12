import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import Avatar from './Avatar'
import { PEOPLE, formatDate } from '../data'

export default function InitiativeRow({ initiative, onToggle }) {
  const person = PEOPLE[initiative.owner]

  return (
    <div className="flex gap-2.5 rounded-lg p-2 transition-colors hover:bg-ink-800">
      <div className="relative shrink-0">
        <Avatar person={person} size={32} />
        <button
          type="button"
          onClick={() => onToggle(initiative.id)}
          role="switch"
          aria-checked={initiative.done}
          aria-label={`Mark "${initiative.title}" as ${initiative.done ? 'not done' : 'done'}`}
          className={`absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full ring-2 ring-ink-850 transition-colors ${
            initiative.done
              ? 'bg-accent-500 text-ink-950 hover:bg-accent-400'
              : 'bg-ink-700 text-faint hover:bg-ink-600 hover:text-[#D4D4D4]'
          }`}
        >
          <HugeiconsIcon icon={Tick02Icon} size={10} strokeWidth={3.5} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[13px] font-medium leading-snug ${
            initiative.done ? 'text-faint line-through decoration-faint' : 'text-[#D4D4D4]'
          }`}
        >
          {initiative.title}
        </p>
        <p className="mt-1 text-[11px] leading-tight text-faint">
          {formatDate(initiative.due)}
          <span className="sr-only">, owned by {person.name}</span>
        </p>
      </div>
    </div>
  )
}

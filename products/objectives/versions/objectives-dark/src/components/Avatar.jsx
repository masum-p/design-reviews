const TINTS = {
  teal: 'bg-[#123B36] text-accent-200',
  indigo: 'bg-[#1D2144] text-[#AEB6F5]',
  amber: 'bg-[#3A2C12] text-[#F0CE92]',
  rose: 'bg-[#3B1D26] text-[#F2AFBE]',
  violet: 'bg-[#2C1D3D] text-[#D6B4F3]',
  sky: 'bg-[#122E42] text-[#9AD1F0]',
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ person, size = 32, className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium tracking-wide ${
        TINTS[person.tint] ?? TINTS.teal
      } ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      title={person.name}
      aria-hidden="true"
    >
      {initials(person.name)}
    </span>
  )
}

export function AvatarStack({ people }) {
  return (
    <div className="flex items-center">
      {people.map((person, index) => (
        <span
          key={person.id}
          className="rounded-full ring-2 ring-ink-900"
          style={{ marginLeft: index === 0 ? 0 : -8, zIndex: people.length - index }}
        >
          <Avatar person={person} size={26} />
        </span>
      ))}
      <span className="sr-only">Owners: {people.map((person) => person.name).join(', ')}</span>
    </div>
  )
}

import { useId } from 'react'

const CONTROL =
  'w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-[13px] text-[#EDEDED] placeholder:text-faint transition-colors focus:border-accent-600 [color-scheme:dark]'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-faint">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] text-faint">{hint}</span> : null}
    </label>
  )
}

export function TextInput({ label, hint, className = '', ...props }) {
  return (
    <Field label={label} hint={hint}>
      <input className={`${CONTROL} ${className}`} {...props} />
    </Field>
  )
}

export function TextArea({ label, hint, className = '', ...props }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={`${CONTROL} resize-none leading-relaxed ${className}`} {...props} />
    </Field>
  )
}

export function Select({ label, hint, children, className = '', ...props }) {
  return (
    <Field label={label} hint={hint}>
      <select className={`${CONTROL} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  )
}

export function RangeInput({ label, value, onChange, min = 0, max = 100, suffix = '%' }) {
  const id = useId()
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-wider text-faint">
          {label}
        </label>
        <span className="text-[13px] font-medium tabular-nums text-accent-300">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-600 accent-accent-500"
      />
    </div>
  )
}

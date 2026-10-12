const VARIANTS = {
  primary:
    'bg-accent-700 text-[#123525] shadow-[inset_0_1px_0_0_#ffffff20] hover:bg-accent-600 active:bg-accent-800 disabled:bg-ink-700 disabled:text-faint',
  secondary:
    'bg-ink-800 text-[#D4D4D4] border border-ink-600 hover:bg-ink-750 active:bg-ink-800 disabled:text-faint disabled:hover:bg-ink-800',
  ghost:
    'text-muted hover:text-[#D4D4D4] hover:bg-ink-800 active:bg-ink-750 disabled:text-faint disabled:hover:bg-transparent',
  danger: 'text-[#F2AFBE] hover:bg-[#3B1D26] hover:text-[#F6C9D3] active:bg-[#331820]',
}

const SIZES = {
  sm: 'gap-1.5 rounded-md px-3 py-1.5 text-xs',
  md: 'gap-2 rounded-md px-3.5 py-2 text-[13px]',
}

export default function Button({
  variant = 'secondary',
  size = 'sm',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-150 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

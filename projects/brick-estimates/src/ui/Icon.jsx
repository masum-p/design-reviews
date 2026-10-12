import { HugeiconsIcon } from '@hugeicons/react'

export default function Icon({ icon, size = 18, strokeWidth = 1.7, className = '' }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    />
  )
}

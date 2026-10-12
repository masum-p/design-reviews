import { useEffect, useRef, useState } from 'react'

// Layout inside this component keys off its own measured width, not the
// viewport, so it lays out correctly in a narrow column of a wider app.
export default function useContainerWidth(fallback = 660) {
  const ref = useRef(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next) setWidth(Math.round(next))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

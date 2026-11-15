import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Dialog({ title, description, onClose, onSubmit, children, footer }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const first = panelRef.current?.querySelector(FOCUSABLE)
    first?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])
      if (nodes.length === 0) return
      const start = nodes[0]
      const end = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault()
        end.focus()
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault()
        start.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  // Portalled so the dialog is never clipped or offset by the host app layout.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 text-left sm:items-center sm:p-6">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative w-full max-w-lg rounded-t-2xl border border-ink-700 bg-ink-850 shadow-2xl shadow-black/60 sm:rounded-2xl"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.(event)
          }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ink-700 px-5 py-4">
            <div>
              <h2 id="dialog-title" className="text-[15px] font-medium text-[#EDEDED]">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 -mt-1 rounded-lg p-2 text-faint transition-colors hover:bg-ink-800 hover:text-[#D4D4D4]"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-5">{children}</div>

          <div className="flex items-center justify-end gap-2 border-t border-ink-700 px-5 py-3.5">
            {footer}
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

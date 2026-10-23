import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      const focusable = el.querySelector<HTMLElement>(
        'input, textarea, select, button:not([data-modal-close])',
      )
      focusable?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        'fixed inset-0 z-50 m-auto w-[min(24rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-visible border-0 bg-transparent p-0 backdrop:bg-black/50',
        className,
      )}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div
        className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="mb-4 text-base font-semibold text-foreground">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}

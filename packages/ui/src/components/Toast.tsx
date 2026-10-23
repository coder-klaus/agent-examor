import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

type ToastItem = { id: number; message: string; tone: 'success' | 'error' | 'info' }

const ToastContext = createContext<{
  push: (message: string, tone?: ToastItem['tone']) => void
} | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((message: string, tone: ToastItem['tone'] = 'info') => {
    const id = Date.now()
    setItems((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 text-sm shadow-lg',
              t.tone === 'success' && 'border-emerald-500/40',
              t.tone === 'error' && 'border-red-500/40',
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

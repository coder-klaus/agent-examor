import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '../lib/cn'

export type DeckRow = { id: number; name: string; createdAt?: string }

export type DeckTarget =
  | { mode: 'existing'; deckId: number }
  | { mode: 'new'; deckName: string }

function matchDeckName(name: string, query: string) {
  if (!query.trim()) return true
  return name.toLowerCase().includes(query.trim().toLowerCase())
}

export function DeckCombobox({
  decks,
  target,
  onChange,
  className,
}: {
  decks: DeckRow[]
  target: DeckTarget
  onChange: (t: DeckTarget) => void
  className?: string
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const displayLabel = useMemo(() => {
    if (target.mode === 'new') return target.deckName
    return decks.find((d) => d.id === target.deckId)?.name ?? ''
  }, [target, decks])

  useEffect(() => {
    if (!open) setQuery(displayLabel)
  }, [open, displayLabel])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = useMemo(
    () => decks.filter((d) => matchDeckName(d.name, query)),
    [decks, query],
  )

  const trimmed = query.trim()
  const exact = trimmed && decks.some((d) => d.name === trimmed)

  return (
    <div ref={rootRef} className={cn('relative mb-3', className)}>
      <label className="mb-1 block text-sm font-medium">目标牌组</label>
      <input
        className="w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
        value={open ? query : displayLabel}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="搜索或新建牌组名称"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
      />
      {open && (
        <ul
          id={listId}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-[var(--radius-md)] border border-border bg-card py-1 shadow-md"
          role="listbox"
        >
          {filtered.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-muted',
                  target.mode === 'existing' && target.deckId === d.id && 'bg-muted font-medium',
                )}
                onClick={() => {
                  onChange({ mode: 'existing', deckId: d.id })
                  setOpen(false)
                }}
              >
                {d.name}
              </button>
            </li>
          ))}
          {trimmed && !exact && (
            <li>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-muted"
                onClick={() => {
                  onChange({ mode: 'new', deckName: trimmed })
                  setOpen(false)
                }}
              >
                新建「{trimmed}」
              </button>
            </li>
          )}
          {filtered.length === 0 && !trimmed && (
            <li className="px-3 py-2 text-sm text-muted-foreground">暂无牌组，输入名称以新建</li>
          )}
        </ul>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {target.mode === 'existing' ? '导入将追加到已有牌组' : '导入将创建新牌组'}
      </p>
    </div>
  )
}

export function pickDefaultDeckTarget(decks: DeckRow[]): DeckTarget {
  if (decks.length === 0) return { mode: 'new', deckName: '默认牌组' }
  const sorted = [...decks].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  const preferred = decks.find((d) => d.name === '默认牌组') ?? sorted[0]
  return { mode: 'existing', deckId: preferred.id }
}

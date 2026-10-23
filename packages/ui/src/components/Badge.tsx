import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type Tone = 'default' | 'success' | 'warning' | 'muted'

const tones: Record<Tone, string> = {
  default: 'bg-primary/15 text-primary',
  success: 'bg-emerald-500/15 text-emerald-600',
  warning: 'bg-amber-500/15 text-amber-700',
  muted: 'bg-muted text-muted-foreground',
}

export function Badge({
  className,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

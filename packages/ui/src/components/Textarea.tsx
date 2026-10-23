import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[8rem] w-full resize-y rounded-[var(--radius-md)] border border-border bg-background px-3 py-2 text-base text-foreground outline-none ring-primary/30 focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}

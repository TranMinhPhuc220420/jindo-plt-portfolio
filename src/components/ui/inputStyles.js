import { cn } from '../../lib/cn'

export const inputClassName = cn(
  'w-full rounded-xl border border-border bg-overlay px-4 py-2.5 text-sm text-foreground',
  'placeholder:text-muted focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40',
)

export const checkboxClassName = cn(
  'rounded border-border bg-overlay text-primary focus:ring-primary',
)

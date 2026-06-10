import { cn } from '../../lib/cn'

export function Chip({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-overlay px-2.5 py-1 text-xs font-medium text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

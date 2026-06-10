import { cn } from '../../lib/cn'

const statusStyles = {
  live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  beta: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  internal: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
}

export function Badge({ children, status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        status ? statusStyles[status] : 'bg-overlay text-muted border-border',
        className,
      )}
    >
      {children}
    </span>
  )
}

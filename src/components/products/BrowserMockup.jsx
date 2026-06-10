import { cn } from '../../lib/cn'

export function BrowserMockup({ children, className, url = 'app.pltsolutions.dev' }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface shadow-card',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="mx-auto flex-1 max-w-[200px] truncate rounded-md bg-chrome-bar px-3 py-1 text-center text-[10px] text-muted">
          {url}
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">{children}</div>
    </div>
  )
}

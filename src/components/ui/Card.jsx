import { cn } from '../../lib/cn'

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-glass',
        hover &&
          'transition-colors duration-200 hover:border-primary/40',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

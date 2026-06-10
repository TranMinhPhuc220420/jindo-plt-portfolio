import { cn } from '../../lib/cn'

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-glass backdrop-blur-xl',
        hover &&
          'transition-all duration-300 hover:border-primary/30 hover:shadow-glow-sm dark:hover:shadow-glow-sm hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

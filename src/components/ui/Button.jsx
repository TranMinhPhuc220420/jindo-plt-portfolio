import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-primary text-white shadow-glow-sm dark:shadow-glow-sm hover:shadow-glow dark:hover:shadow-glow hover:bg-primary-deep border border-primary/30',
  ghost:
    'bg-overlay text-foreground border border-border hover:bg-overlay-hover hover:border-border',
  outline:
    'bg-transparent text-foreground border border-border hover:border-primary/40 hover:text-primary',
}

export function Button({
  children,
  variant = 'primary',
  className,
  href,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variants[variant],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

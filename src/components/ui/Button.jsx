import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-deep border border-primary',
  ghost:
    'bg-overlay text-foreground border border-border hover:bg-overlay-hover hover:border-border',
  outline:
    'bg-transparent text-foreground border border-border hover:border-primary hover:text-primary',
}

export function Button({
  children,
  variant = 'primary',
  className,
  href,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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

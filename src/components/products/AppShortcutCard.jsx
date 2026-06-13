import { cn } from '../../lib/cn'

function getInitial(title) {
  return title?.trim().charAt(0).toUpperCase() || '?'
}

export function AppShortcutCard({ product }) {
  const { title, iconUrl, url } = product
  const hasUrl = Boolean(url && url !== '#')

  const content = (
    <>
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-elevated',
          'transition-transform duration-200 group-hover:scale-105',
        )}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-lg font-semibold text-primary">
            {getInitial(title)}
          </span>
        )}
      </div>
      <span className="line-clamp-2 text-center text-sm font-medium text-foreground">
        {title}
      </span>
    </>
  )

  const className = cn(
    'group flex flex-col items-center gap-3 rounded-lg border border-border bg-glass p-4',
    'transition-colors duration-200',
    hasUrl && 'hover:border-primary/40 cursor-pointer',
    !hasUrl && 'opacity-60 cursor-default',
  )

  if (!hasUrl) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={title}
    >
      {content}
    </a>
  )
}

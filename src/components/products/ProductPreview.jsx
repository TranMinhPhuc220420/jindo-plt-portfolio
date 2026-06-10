import { cn } from '../../lib/cn'

export function ProductPreview({ image, title, className }) {
  if (image) {
    return (
      <img
        src={image}
        alt={`${title} preview`}
        className={cn('h-full w-full object-cover', className)}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-end bg-surface-elevated p-6',
        className,
      )}
      role="img"
      aria-label={`${title} preview placeholder`}
    >
      <div className="space-y-2">
        <div className="h-2 w-1/3 rounded-sm bg-border" />
        <div className="h-2 w-1/2 rounded-sm bg-border-subtle" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-md border border-border bg-surface" />
          <div className="h-16 rounded-md border border-border bg-surface" />
          <div className="h-16 rounded-md border border-border bg-surface" />
        </div>
      </div>
    </div>
  )
}

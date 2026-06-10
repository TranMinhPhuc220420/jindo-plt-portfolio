import { cn } from '../../lib/cn'

export function ProductPreview({ gradient, image, title, className }) {
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
        'flex h-full w-full flex-col justify-end bg-gradient-to-br p-6',
        gradient,
        className,
      )}
      role="img"
      aria-label={`${title} preview placeholder`}
    >
      <div className="space-y-2">
        <div className="h-2 w-1/3 rounded-full bg-white/20" />
        <div className="h-2 w-1/2 rounded-full bg-white/10" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-lg bg-white/5 border border-white/10" />
          <div className="h-16 rounded-lg bg-white/5 border border-white/10" />
          <div className="h-16 rounded-lg bg-white/5 border border-white/10" />
        </div>
      </div>
    </div>
  )
}

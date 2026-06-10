import { Badge } from '../ui/Badge'
import { Chip } from '../ui/Chip'

export function ProductMeta({ category, status, tags }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-primary">
        {category}
      </span>
      {status && <Badge status={status}>{status}</Badge>}
      {tags?.slice(0, 3).map((tag) => (
        <Chip key={tag}>{tag}</Chip>
      ))}
    </div>
  )
}

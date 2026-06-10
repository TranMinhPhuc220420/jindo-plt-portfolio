import { useTranslation } from 'react-i18next'
import { Badge } from '../ui/Badge'
import { Chip } from '../ui/Chip'

export function ProductMeta({ category, status, tags }) {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow">{category}</span>
      {status && <Badge status={status}>{t(`status.${status}`)}</Badge>}
      {tags?.slice(0, 3).map((tag) => (
        <Chip key={tag}>{tag}</Chip>
      ))}
    </div>
  )
}

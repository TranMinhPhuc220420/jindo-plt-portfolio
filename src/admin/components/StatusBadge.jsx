import { useTranslation } from 'react-i18next'
import { Badge } from '../../components/ui/Badge'

export function StatusBadge({ status }) {
  const { t } = useTranslation('common')
  return <Badge status={status}>{t(`status.${status}`)}</Badge>
}

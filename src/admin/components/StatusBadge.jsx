import { Badge } from '../../components/ui/Badge'

export function StatusBadge({ status }) {
  return <Badge status={status}>{status}</Badge>
}

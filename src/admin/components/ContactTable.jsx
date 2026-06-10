import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { checkboxClassName } from '../../components/ui/inputStyles'
import { formatDistanceToNow } from '../lib/formatDate'

export function ContactTable({
  contacts,
  selectedIds,
  onSelect,
  onToggleSelect,
  onToggleSelectAll,
  onDelete,
}) {
  const { t } = useTranslation(['admin', 'common'])

  if (contacts.length === 0) {
    return <p className="py-12 text-center text-muted">{t('admin:contacts.empty')}</p>
  }

  const allSelected =
    contacts.length > 0 && contacts.every((c) => selectedIds.has(c.id))
  const someSelected = contacts.some((c) => selectedIds.has(c.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-overlay text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected
                }}
                onChange={onToggleSelectAll}
                className={checkboxClassName}
                aria-label={t('admin:contacts.table.selectAll')}
              />
            </th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.name')}</th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.email')}</th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.company')}</th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.message')}</th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.date')}</th>
            <th className="px-4 py-3 font-medium">{t('admin:contacts.table.status')}</th>
            <th className="px-4 py-3 font-medium text-right">
              {t('admin:contacts.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              onClick={() => onSelect(contact)}
              className="cursor-pointer hover:bg-overlay-muted"
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(contact.id)}
                  onChange={() => onToggleSelect(contact.id)}
                  className={checkboxClassName}
                  aria-label={t('admin:contacts.table.selectContact', { name: contact.name })}
                />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                <span className="flex items-center gap-2">
                  {!contact.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  {contact.name}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{contact.email}</td>
              <td className="px-4 py-3 text-muted">{contact.company || '—'}</td>
              <td className="max-w-xs truncate px-4 py-3 text-muted">{contact.message}</td>
              <td className="px-4 py-3 text-muted whitespace-nowrap">
                {formatDistanceToNow(contact.created_at)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    contact.is_read ? 'text-muted' : 'font-medium text-primary'
                  }
                >
                  {contact.is_read
                    ? t('admin:contacts.table.read')
                    : t('admin:contacts.table.unread')}
                </span>
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onDelete(contact)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                    {t('common:actions.delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

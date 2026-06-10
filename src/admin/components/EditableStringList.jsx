import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { inputClassName } from '../../components/ui/inputStyles'
import { cn } from '../../lib/cn'

export function EditableStringList({
  items = [],
  onChange,
  placeholder,
  addLabel,
  emptyLabel,
}) {
  const { t } = useTranslation('admin')

  const resolvedPlaceholder = placeholder ?? t('editableList.placeholder')
  const resolvedAddLabel = addLabel ?? t('editableList.addItem')
  const resolvedEmptyLabel = emptyLabel ?? t('editableList.empty')

  function updateItem(index, value) {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, ''])
  }

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-overlay-muted px-4 py-3 text-sm text-muted">
          {resolvedEmptyLabel}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated text-xs font-medium text-muted"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={resolvedPlaceholder}
                className={cn(inputClassName, 'min-w-0 flex-1')}
                aria-label={t('editableList.itemAria', { index: index + 1 })}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label={t('editableList.removeItemAria', { index: index + 1 })}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-overlay px-3 py-2 text-sm text-muted transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus size={16} />
        {resolvedAddLabel}
      </button>
    </div>
  )
}

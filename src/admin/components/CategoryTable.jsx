import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePointerRowReorder } from '../hooks/usePointerRowReorder'

const ROW_GRID =
  'grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3'

function CategoryRowContent({ category, onDelete, dragHandle, className }) {
  const { t } = useTranslation(['admin', 'common'])

  return (
    <div className={cn(ROW_GRID, className)}>
      {dragHandle}

      <span className="truncate font-medium text-foreground">{category.name}</span>

      <span className="truncate font-mono text-sm text-muted">{category.id}</span>

      <div className="flex items-center justify-end gap-2">
        <Link
          to={`/admin/categories/${category.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-primary/30 hover:text-primary"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Pencil size={14} />
          {t('common:actions.edit')}
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(category)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-red-500/30 hover:text-red-400"
        >
          <Trash2 size={14} />
          {t('common:actions.delete')}
        </button>
      </div>
    </div>
  )
}

function DragHandle({ label, onPointerDown, isDragging }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-muted',
        'touch-none transition-colors select-none',
        'hover:bg-overlay hover:text-foreground',
        isDragging ? 'cursor-grabbing bg-primary/10 text-primary' : 'cursor-grab',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
      aria-label={label}
      onPointerDown={onPointerDown}
    >
      <GripVertical size={16} />
    </button>
  )
}

function DragOverlay({ overlay, category }) {
  if (!overlay || !category) return null

  return createPortal(
    <div
      className="pointer-events-none fixed z-[100] rounded-xl border border-primary/30 bg-background shadow-2xl shadow-black/25 ring-1 ring-primary/20"
      style={{
        left: overlay.x,
        top: overlay.y,
        width: overlay.width,
        transform: 'translateX(0)',
      }}
    >
      <CategoryRowContent
        category={category}
        onDelete={() => {}}
        dragHandle={
          <div className="flex h-8 w-8 cursor-grabbing items-center justify-center rounded-md bg-primary/10 text-primary">
            <GripVertical size={16} />
          </div>
        }
        className="py-3.5"
      />
    </div>,
    document.body,
  )
}

export function CategoryTable({ categories, onReorder, onDelete, reordering }) {
  const { t } = useTranslation('admin')

  const {
    setRowRef,
    dragId,
    overId,
    overlay,
    startDrag,
    isDragging,
  } = usePointerRowReorder({
    items: categories,
    getId: (category) => category.id,
    onReorder,
    disabled: reordering,
  })

  const overlayCategory = overlay
    ? categories.find((category) => category.id === overlay.id)
    : null

  if (categories.length === 0) {
    return <p className="py-12 text-center text-muted">{t('categories.empty')}</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">{t('categories.reorderHint')}</p>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <div className="min-w-[480px]">
          <div
            className={cn(
              ROW_GRID,
              'border-b border-border bg-overlay text-xs uppercase tracking-wider text-muted',
            )}
          >
            <span aria-hidden="true" />
            <span>{t('categories.table.name')}</span>
            <span>{t('categories.table.id')}</span>
            <span className="text-right">{t('categories.table.actions')}</span>
          </div>

          <div className={cn(isDragging && 'select-none')}>
            {categories.map((category) => {
              const isSource = dragId === category.id
              const isDropTarget = overId === category.id && dragId !== category.id

              return (
                <div
                  key={category.id}
                  ref={(node) => setRowRef(category.id, node)}
                  className={cn(
                    'relative border-b border-border-subtle bg-background transition-[opacity,background-color] duration-150 last:border-b-0',
                    'hover:bg-overlay-muted/80',
                    isSource && 'opacity-35',
                    isDropTarget && 'bg-primary/5',
                    reordering && 'pointer-events-none opacity-70',
                  )}
                >
                  {isDropTarget && (
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-primary"
                      aria-hidden="true"
                    />
                  )}

                  <CategoryRowContent
                    category={category}
                    onDelete={onDelete}
                    dragHandle={
                      <DragHandle
                        label={t('categories.table.dragCategory', { name: category.name })}
                        isDragging={isSource && isDragging}
                        onPointerDown={(event) => {
                          event.preventDefault()
                          startDrag(category.id, event)
                        }}
                      />
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <DragOverlay overlay={overlay} category={overlayCategory} />
    </div>
  )
}

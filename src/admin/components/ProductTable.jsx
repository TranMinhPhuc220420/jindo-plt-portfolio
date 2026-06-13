import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { usePointerRowReorder } from '../hooks/usePointerRowReorder'

const ROW_GRID =
  'grid grid-cols-[2.25rem_2.5rem_minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-3 px-4 py-3'

function IconThumbnail({ iconUrl, title }) {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className="h-8 w-8 rounded-lg border border-border object-cover"
      />
    )
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-overlay text-xs font-semibold text-primary">
      {title?.charAt(0).toUpperCase() || '?'}
    </span>
  )
}

function ProductRowContent({ product, onDelete, dragHandle, className }) {
  const { t } = useTranslation(['admin', 'common'])

  return (
    <div className={cn(ROW_GRID, className)}>
      {dragHandle}

      <IconThumbnail iconUrl={product.iconUrl} title={product.title} />

      <span className="truncate font-medium text-foreground">{product.title}</span>

      <span className="truncate text-muted">
        {product.url ? (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {product.url}
          </a>
        ) : (
          '—'
        )}
      </span>

      <div className="flex items-center justify-end gap-2">
        <Link
          to={`/admin/products/${product.id}`}
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
            onDelete(product)
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

function DragOverlay({ overlay, product }) {
  if (!overlay || !product) return null

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
      <ProductRowContent
        product={product}
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

export function ProductTable({ products, onReorder, onDelete, reordering }) {
  const { t } = useTranslation('admin')

  const {
    setRowRef,
    dragId,
    overId,
    overlay,
    startDrag,
    isDragging,
  } = usePointerRowReorder({
    items: products,
    getId: (product) => product.id,
    onReorder,
    disabled: reordering,
  })

  const overlayProduct = overlay
    ? products.find((product) => product.id === overlay.id)
    : null

  if (products.length === 0) {
    return <p className="py-12 text-center text-muted">{t('products.empty')}</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">{t('products.reorderHint')}</p>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <div className="min-w-[640px]">
          <div
            className={cn(
              ROW_GRID,
              'border-b border-border bg-overlay text-xs uppercase tracking-wider text-muted',
            )}
          >
            <span aria-hidden="true" />
            <span>{t('products.table.icon')}</span>
            <span>{t('products.table.title')}</span>
            <span>{t('products.table.url')}</span>
            <span className="text-right">{t('products.table.actions')}</span>
          </div>

          <div className={cn(isDragging && 'select-none')}>
            {products.map((product) => {
              const isSource = dragId === product.id
              const isDropTarget = overId === product.id && dragId !== product.id

              return (
                <div
                  key={product.id}
                  ref={(node) => setRowRef(product.id, node)}
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

                  <ProductRowContent
                    product={product}
                    onDelete={onDelete}
                    dragHandle={
                      <DragHandle
                        label={t('products.table.dragProduct', { title: product.title })}
                        isDragging={isSource && isDragging}
                        onPointerDown={(event) => {
                          event.preventDefault()
                          startDrag(product.id, event)
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

      <DragOverlay overlay={overlay} product={overlayProduct} />
    </div>
  )
}

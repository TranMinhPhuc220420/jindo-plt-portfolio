import { useTranslation } from 'react-i18next'
import { CheckCircle2, Circle } from 'lucide-react'
import { AppShortcutCard } from '../../components/products/AppShortcutCard'
import { Card } from '../../components/ui/Card'
import { cn } from '../../lib/cn'

function isValidUrl(value) {
  if (!value?.trim()) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function ShortcutFormPreview({ product }) {
  const { t } = useTranslation('admin')
  const hasTitle = Boolean(product.title?.trim())
  const hasUrl = isValidUrl(product.url)

  const checklist = [
    { key: 'title', done: hasTitle, label: t('products.form.checklist.title') },
    { key: 'url', done: hasUrl, label: t('products.form.checklist.url') },
    {
      key: 'icon',
      done: Boolean(product.iconUrl?.trim()),
      label: t('products.form.checklist.icon'),
      optional: true,
    },
  ]

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border-subtle px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          {t('products.form.preview.title')}
        </h3>
        <p className="mt-0.5 text-sm text-muted">
          {t('products.form.preview.description')}
        </p>
      </div>

      <div className="flex justify-center bg-overlay-muted/50 px-5 py-8">
        <div className="w-[140px]">
          <AppShortcutCard
            product={{
              title: product.title?.trim() || t('products.form.preview.placeholderTitle'),
              iconUrl: product.iconUrl,
              url: hasUrl ? product.url : undefined,
            }}
          />
        </div>
      </div>

      <div className="space-y-2 border-t border-border-subtle px-5 py-4">
        <p className="text-label-sm font-medium uppercase tracking-wider text-muted">
          {t('products.form.checklist.heading')}
        </p>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 size={16} className="shrink-0 text-primary" />
              ) : (
                <Circle size={16} className="shrink-0 text-muted" />
              )}
              <span
                className={cn(
                  item.done ? 'text-foreground' : 'text-muted',
                  item.optional && !item.done && 'text-muted',
                )}
              >
                {item.label}
                {item.optional && (
                  <span className="ml-1 text-label-sm text-muted">
                    ({t('products.form.checklist.optional')})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {hasTitle && hasUrl && (
          <p className="pt-1 text-sm text-primary">
            {t('products.form.checklist.ready')}
          </p>
        )}
      </div>
    </Card>
  )
}

export { isValidUrl }

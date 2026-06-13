import { useTranslation } from 'react-i18next'
import { AppShortcutGrid } from './AppShortcutGrid'

/**
 * @param {{ categories: { id: string, name: string, sortOrder: number }[], products: { id: string, categoryId?: string | null, sortOrder: number }[] }} props
 */
export function AppShortcutGroupedGrid({ categories, products }) {
  const { t } = useTranslation('public')

  const productsByCategory = new Map()
  const uncategorized = []

  for (const product of products) {
    if (product.categoryId) {
      const list = productsByCategory.get(product.categoryId) ?? []
      list.push(product)
      productsByCategory.set(product.categoryId, list)
    } else {
      uncategorized.push(product)
    }
  }

  const sortedCategories = [...categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )

  const sections = sortedCategories
    .filter((category) => productsByCategory.has(category.id))
    .map((category) => ({
      id: category.id,
      title: category.name,
      products: productsByCategory.get(category.id) ?? [],
    }))

  if (uncategorized.length > 0) {
    sections.push({
      id: '__uncategorized__',
      title: t('catalog.uncategorized'),
      products: uncategorized,
    })
  }

  if (sections.length === 0) {
    return <AppShortcutGrid products={products} />
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id}>
          <h3 className="mb-6 text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {section.title}
          </h3>
          <AppShortcutGrid products={section.products} />
        </section>
      ))}
    </div>
  )
}

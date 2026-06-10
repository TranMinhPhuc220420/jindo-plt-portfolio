import { useTranslation } from 'react-i18next'
import { Section } from '../layout/Section'
import { StickyProductPanel } from './StickyProductPanel'

export function FeaturedProducts({ products }) {
  const { t } = useTranslation('public')

  return (
    <Section id="featured" className="border-t border-border-subtle">
      <div className="mb-16 text-center md:text-left">
        <p className="eyebrow">{t('featured.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t('featured.title')}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{t('featured.description')}</p>
      </div>

      <div className="space-y-32">
        {products.map((product) => (
          <StickyProductPanel key={product.id} product={product} />
        ))}
      </div>
    </Section>
  )
}

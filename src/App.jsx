import { useTranslation } from 'react-i18next'
import { RootLayout } from './app/layout/RootLayout'
import { HeroSection } from './components/hero/HeroSection'
import { AppShortcutGroupedGrid } from './components/products/AppShortcutGroupedGrid'
import { Section } from './components/layout/Section'
import { TechStackMarquee } from './components/tech/TechStackMarquee'
import { ContactFooter } from './components/contact/ContactFooter'
import { useProducts } from './hooks/useProducts'
import { useCategories } from './hooks/useCategories'
import { techStack } from './data/tech-stack'

function App() {
  const { t } = useTranslation('public')
  const { products, loading, error } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()

  return (
    <RootLayout>
      <HeroSection />
      <Section id="products" className="border-t border-border-subtle">
        <div className="mb-12 text-center md:text-left">
          <p className="eyebrow">{t('catalog.eyebrow')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t('catalog.title')}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{t('catalog.description')}</p>
        </div>
        {loading || categoriesLoading ? (
          <p className="py-20 text-center text-muted">{t('catalog.loading')}</p>
        ) : error ? (
          <p className="py-20 text-center text-red-400">{t('catalog.error')}</p>
        ) : (
          <AppShortcutGroupedGrid categories={categories} products={products} />
        )}
      </Section>
      <TechStackMarquee items={techStack} />
      <ContactFooter />
    </RootLayout>
  )
}

export default App

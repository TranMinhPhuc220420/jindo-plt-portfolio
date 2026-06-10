import { useTranslation } from 'react-i18next'
import { RootLayout } from './app/layout/RootLayout'
import { HeroSection } from './components/hero/HeroSection'
import { FeaturedProducts } from './components/products/FeaturedProducts'
import { ProductBentoGrid } from './components/products/ProductBentoGrid'
import { Section } from './components/layout/Section'
import { TechStackMarquee } from './components/tech/TechStackMarquee'
import { ContactFooter } from './components/contact/ContactFooter'
import { useProducts } from './hooks/useProducts'
import { techStack } from './data/tech-stack'

function App() {
  const { t } = useTranslation('public')
  const { featuredProducts, bentoProducts, loading, error } = useProducts()

  return (
    <RootLayout>
      <HeroSection />
      {loading ? (
        <Section id="featured">
          <p className="py-20 text-center text-muted">{t('catalog.loading')}</p>
        </Section>
      ) : error ? (
        <Section id="featured">
          <p className="py-20 text-center text-red-400">{t('catalog.error')}</p>
        </Section>
      ) : (
        <>
          <FeaturedProducts products={featuredProducts} />
          <Section id="products" className="border-t border-border-subtle">
            <div className="mb-12 text-center md:text-left">
              <p className="eyebrow">{t('catalog.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t('catalog.title')}
              </h2>
              <p className="mt-4 max-w-2xl text-muted">{t('catalog.description')}</p>
            </div>
            <ProductBentoGrid products={bentoProducts} />
          </Section>
        </>
      )}
      <TechStackMarquee items={techStack} />
      <ContactFooter />
    </RootLayout>
  )
}

export default App

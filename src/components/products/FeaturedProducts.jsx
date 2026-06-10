import { Section } from '../layout/Section'
import { StickyProductPanel } from './StickyProductPanel'

export function FeaturedProducts({ products }) {
  return (
    <Section id="featured" className="border-t border-border-subtle">
      <div className="mb-16 text-center md:text-left">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Flagship Products
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Built to scale, designed to impress
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Scroll through our flagship applications — each engineered for
          performance, clarity, and a premium user experience.
        </p>
      </div>

      <div className="space-y-32">
        {products.map((product) => (
          <StickyProductPanel key={product.id} product={product} />
        ))}
      </div>
    </Section>
  )
}

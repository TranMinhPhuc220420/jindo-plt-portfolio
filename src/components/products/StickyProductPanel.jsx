import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Code2, ExternalLink } from 'lucide-react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Chip } from '../ui/Chip'
import { BrowserMockup } from './BrowserMockup'
import { ProductImageCarousel } from './ProductImageCarousel'

export function StickyProductPanel({ product }) {
  const { ref, progress } = useScrollProgress()
  const highlightCount = product.highlights.length
  const displayImages =
    product.images?.length > 0
      ? product.images
      : product.previewImage
        ? [product.previewImage]
        : []

  const activeIndex = useMemo(() => {
    if (highlightCount <= 1) return 0
    return Math.min(
      Math.floor(progress * highlightCount),
      highlightCount - 1,
    )
  }, [progress, highlightCount])

  return (
    <div
      ref={ref}
      className="relative"
      style={{ minHeight: `${Math.max(highlightCount, 1) * 60}vh` }}
    >
      <div className="sticky top-24 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <BrowserMockup url={`${product.id}.pltsolutions.dev`}>
          <ProductImageCarousel
            images={displayImages}
            gradient={product.gradient}
            title={product.title}
          />
        </BrowserMockup>

        <div className="flex flex-col gap-6 py-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                {product.category}
              </span>
              <Badge status={product.status}>{product.status}</Badge>
            </div>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {product.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {product.longDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>

          <div className="space-y-4">
            {product.highlights.map((highlight, i) => (
              <motion.div
                key={highlight}
                animate={{
                  opacity: i === activeIndex ? 1 : 0.35,
                  x: i === activeIndex ? 0 : -4,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-overlay-muted p-4"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    i === activeIndex
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-overlay text-muted border border-border'
                  }`}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">{highlight}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {product.liveUrl && (
              <Button href={product.liveUrl}>
                View live
                <ExternalLink size={16} />
              </Button>
            )}
            {product.repoUrl && (
              <Button href={product.repoUrl} variant="ghost">
                <Code2 size={16} />
                Source
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { Card } from '../ui/Card'
import { BrowserMockup } from './BrowserMockup'
import { ProductMeta } from './ProductMeta'
import { ProductImageCarousel } from './ProductImageCarousel'

export function ProductCard({ product }) {
  const { t } = useTranslation('common')
  const {
    title,
    description,
    category,
    status,
    tags,
    images,
    previewImage,
    liveUrl,
  } = product
  const displayImages =
    images?.length > 0 ? images : previewImage ? [previewImage] : []

  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      <BrowserMockup
        url={`${product.id}.pltsolutions.dev`}
        className="rounded-none border-0 border-b border-border"
      >
        <ProductImageCarousel
          images={displayImages}
          title={title}
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </BrowserMockup>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <ProductMeta category={category} status={status} tags={tags} />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted">{description}</p>
        {liveUrl && (
          <a
            href={liveUrl}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-deep"
          >
            {t('actions.viewLive')}
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </Card>
  )
}

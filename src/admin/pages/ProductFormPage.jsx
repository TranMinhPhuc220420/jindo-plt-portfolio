import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Globe, ImageIcon, Link2, Settings2, Type } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { checkboxClassName, inputClassName } from '../../components/ui/inputStyles'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'
import { ProductImageUploader } from '../components/ProductImageUploader'
import { EditableStringList } from '../components/EditableStringList'
import { mapProductFromDb, mapProductToDb } from '../../lib/productMapper'

const DEFAULT_GRADIENT = 'from-surface-elevated via-surface to-background'

const emptyProduct = {
  id: '',
  title: '',
  description: '',
  longDescription: '',
  category: '',
  status: 'live',
  tags: [],
  gradient: DEFAULT_GRADIENT,
  previewImage: '',
  images: [],
  liveUrl: '',
  repoUrl: '',
  featured: false,
  layout: 'standard',
  highlights: [],
  sortOrder: 0,
}

function parseList(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ProductFormPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const [product, setProduct] = useState(emptyProduct)
  const [tagsInput, setTagsInput] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const resolvedSlug = useMemo(
    () => slugify(product.id || product.title),
    [product.id, product.title],
  )

  useEffect(() => {
    if (isNew) return

    async function fetchProduct() {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        const mapped = mapProductFromDb(data)
        setProduct(mapped)
        setTagsInput(mapped.tags.join(', '))
      }
      setLoading(false)
    }

    fetchProduct()
  }, [id, isNew])

  function updateField(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = mapProductToDb({
      ...product,
      tags: parseList(tagsInput),
      highlights: product.highlights.map((s) => s.trim()).filter(Boolean),
      gradient: product.gradient || DEFAULT_GRADIENT,
      id: isNew ? slugify(product.id || product.title) : product.id,
    })

    if (!payload.id || !payload.title || !payload.description) {
      setError(t('admin:products.requiredFields'))
      setSubmitting(false)
      return
    }

    const { error: saveError } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', product.id)

    if (saveError) {
      setError(saveError.message)
      setSubmitting(false)
      return
    }

    navigate('/admin/products')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 animate-pulse">
        <div className="h-4 w-32 rounded-md bg-overlay" />
        <div className="h-8 w-64 rounded-md bg-overlay" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-64 rounded-lg bg-overlay" />
            <div className="h-48 rounded-lg bg-overlay" />
          </div>
          <div className="space-y-4">
            <div className="h-48 rounded-lg bg-overlay" />
            <div className="h-32 rounded-lg bg-overlay" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto pb-24">
      <header className="mb-8 space-y-4">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t('admin:products.backToProducts')}
        </Link>
        <div>
          <h2 className="text-h1 text-foreground">
            {isNew ? t('admin:products.newProduct') : t('admin:products.editProduct')}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {isNew
              ? t('admin:products.newDescription')
              : t('admin:products.editDescription', {
                  title: product.title || product.id,
                })}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <div className="space-y-6">
            <FormSection
              icon={Type}
              title={t('admin:products.sections.basics.title')}
              description={t('admin:products.sections.basics.description')}
            >
              {isNew && (
                <Field
                  label={t('admin:products.fields.id')}
                  required
                  hint={t('admin:products.fields.idHint')}
                  htmlFor="product-id"
                >
                  <input
                    id="product-id"
                    type="text"
                    value={product.id}
                    onChange={(e) => updateField('id', e.target.value)}
                    placeholder={t('admin:products.fields.idPlaceholder')}
                    className={inputClassName}
                    pattern="[a-z0-9-]*"
                  />
                  {resolvedSlug && (
                    <p className="mt-1.5 text-label-sm text-muted">
                      {t('admin:products.fields.willBeSavedAs')}{' '}
                      <code className="rounded-sm bg-overlay px-1.5 py-0.5 text-foreground">
                        {resolvedSlug}
                      </code>
                    </p>
                  )}
                </Field>
              )}

              <Field
                label={t('admin:products.fields.title')}
                required
                htmlFor="product-title"
              >
                <input
                  id="product-title"
                  type="text"
                  required
                  value={product.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder={t('admin:products.fields.titlePlaceholder')}
                  className={inputClassName}
                />
              </Field>

              <Field
                label={t('admin:products.fields.shortDescription')}
                required
                hint={t('admin:products.fields.shortDescriptionHint')}
                htmlFor="product-description"
              >
                <textarea
                  id="product-description"
                  required
                  rows={2}
                  maxLength={280}
                  value={product.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={inputClassName}
                />
                <p className="mt-1 text-right text-label-sm text-muted">
                  {product.description.length}/280
                </p>
              </Field>

              <Field
                label={t('admin:products.fields.longDescription')}
                hint={t('admin:products.fields.longDescriptionHint')}
                htmlFor="product-long-description"
              >
                <textarea
                  id="product-long-description"
                  rows={5}
                  value={product.longDescription}
                  onChange={(e) => updateField('longDescription', e.target.value)}
                  placeholder={t('admin:products.fields.longDescriptionPlaceholder')}
                  className={inputClassName}
                />
              </Field>
            </FormSection>

            <FormSection
              icon={Settings2}
              title={t('admin:products.sections.classification.title')}
              description={t('admin:products.sections.classification.description')}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label={t('admin:products.fields.category')}
                  required
                  htmlFor="product-category"
                >
                  <input
                    id="product-category"
                    type="text"
                    required
                    value={product.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    placeholder={t('admin:products.fields.categoryPlaceholder')}
                    className={inputClassName}
                  />
                </Field>

                <Field
                  label={t('admin:products.fields.sortOrder')}
                  hint={t('admin:products.fields.sortOrderHint')}
                  htmlFor="product-sort"
                >
                  <input
                    id="product-sort"
                    type="number"
                    min={0}
                    value={product.sortOrder}
                    onChange={(e) =>
                      updateField('sortOrder', parseInt(e.target.value, 10) || 0)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t('admin:products.fields.status')} htmlFor="product-status">
                  <select
                    id="product-status"
                    value={product.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className={inputClassName}
                  >
                    <option value="live">{t('common:status.live')}</option>
                    <option value="beta">{t('common:status.beta')}</option>
                    <option value="internal">{t('common:status.internal')}</option>
                  </select>
                </Field>

                <Field label={t('admin:products.fields.gridLayout')} htmlFor="product-layout">
                  <select
                    id="product-layout"
                    value={product.layout}
                    onChange={(e) => updateField('layout', e.target.value)}
                    className={inputClassName}
                  >
                    <option value="featured">{t('admin:products.layout.featured')}</option>
                    <option value="standard">{t('admin:products.layout.standard')}</option>
                    <option value="wide">{t('admin:products.layout.wide')}</option>
                    <option value="tall">{t('admin:products.layout.tall')}</option>
                  </select>
                </Field>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-overlay-muted p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t('admin:products.fields.featuredProduct')}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {t('admin:products.fields.featuredProductHint')}
                  </p>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className={checkboxClassName}
                    aria-label={t('admin:products.fields.featuredProductAria')}
                  />
                </label>
              </div>
            </FormSection>

            <FormSection
              icon={Globe}
              title={t('admin:products.sections.tagsHighlights.title')}
              description={t('admin:products.sections.tagsHighlights.description')}
            >
              <Field
                label={t('admin:products.fields.tags')}
                hint={t('admin:products.fields.tagsHint')}
                htmlFor="product-tags"
              >
                <input
                  id="product-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder={t('admin:products.fields.tagsPlaceholder')}
                  className={inputClassName}
                />
              </Field>

              <Field
                label={t('admin:products.fields.highlights')}
                hint={t('admin:products.fields.highlightsHint')}
              >
                <EditableStringList
                  items={product.highlights}
                  onChange={(highlights) => updateField('highlights', highlights)}
                  placeholder={t('admin:products.fields.highlightsPlaceholder')}
                  addLabel={t('admin:products.fields.highlightsAdd')}
                  emptyLabel={t('admin:products.fields.highlightsEmpty')}
                />
              </Field>
            </FormSection>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6">
            <FormSection
              icon={ImageIcon}
              title={t('admin:products.sections.media.title')}
              description={t('admin:products.sections.media.description')}
            >
              <ProductImageUploader
                images={product.images ?? []}
                onChange={(images) =>
                  setProduct((prev) => ({
                    ...prev,
                    images,
                    previewImage: images[0] ?? '',
                  }))
                }
              />
            </FormSection>

            <FormSection
              icon={Link2}
              title={t('admin:products.sections.links.title')}
              description={t('admin:products.sections.links.description')}
            >
              <Field label={t('admin:products.fields.liveUrl')} htmlFor="product-live-url">
                <input
                  id="product-live-url"
                  type="url"
                  value={product.liveUrl}
                  onChange={(e) => updateField('liveUrl', e.target.value)}
                  placeholder={t('admin:products.fields.liveUrlPlaceholder')}
                  className={inputClassName}
                />
              </Field>

              <Field label={t('admin:products.fields.repoUrl')} htmlFor="product-repo-url">
                <input
                  id="product-repo-url"
                  type="url"
                  value={product.repoUrl}
                  onChange={(e) => updateField('repoUrl', e.target.value)}
                  placeholder={t('admin:products.fields.repoUrlPlaceholder')}
                  className={inputClassName}
                />
              </Field>
            </FormSection>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm lg:-mx-6 lg:px-6">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link to="/admin/products">
              <Button type="button" variant="ghost">
                {t('common:actions.cancel')}
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? t('admin:products.saving')
                : isNew
                  ? t('admin:products.createProduct')
                  : t('admin:products.saveChanges')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border-subtle px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted">
            <Icon size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
    </Card>
  )
}

function Field({ label, required, hint, htmlFor, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {hint && <p className="text-label-sm text-muted">{hint}</p>}
      {children}
    </div>
  )
}

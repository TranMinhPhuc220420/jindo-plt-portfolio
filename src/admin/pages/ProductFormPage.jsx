import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { inputClassName } from '../../components/ui/inputStyles'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'
import { IconField } from '../components/IconField'
import { isValidUrl, ShortcutFormPreview } from '../components/ShortcutFormPreview'
import { getNextSortOrder } from '../../lib/productOrder'
import { mapProductFromDb, mapProductToDb } from '../../lib/productMapper'

const emptyProduct = {
  id: '',
  title: '',
  description: '',
  iconUrl: '',
  url: '',
  sortOrder: 0,
  categoryId: null,
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function validateProduct(product, isNew, t) {
  const errors = {}

  if (!product.title?.trim()) {
    errors.title = t('admin:products.form.errors.titleRequired')
  }

  if (!product.url?.trim()) {
    errors.url = t('admin:products.form.errors.urlRequired')
  } else if (!isValidUrl(product.url)) {
    errors.url = t('admin:products.form.errors.urlInvalid')
  }

  if (isNew && product.id && !/^[a-z0-9-]+$/.test(product.id)) {
    errors.id = t('admin:products.form.errors.idInvalid')
  }

  return errors
}

export function ProductFormPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const [product, setProduct] = useState(emptyProduct)
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [categories, setCategories] = useState([])

  const resolvedSlug = useMemo(
    () => slugify(product.id || product.title),
    [product.id, product.title],
  )

  const canSubmit = useMemo(() => {
    return (
      Boolean(product.title?.trim()) &&
      isValidUrl(product.url) &&
      Object.keys(validateProduct(product, isNew, t)).length === 0
    )
  }, [product, isNew, t])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      setCategories((data ?? []).map((row) => ({ id: row.id, name: row.name })))
    }
    fetchCategories()
  }, [])

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
        setProduct(mapProductFromDb(data))
      }
      setLoading(false)
    }

    fetchProduct()
  }, [id, isNew])

  function updateField(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function showError(field) {
    return touched[field] ? fieldErrors[field] : undefined
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = validateProduct(product, isNew, t)
    setFieldErrors(errors)
    setTouched({ title: true, url: true, id: true })

    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)

    let sortOrder = product.sortOrder
    if (isNew) {
      try {
        sortOrder = await getNextSortOrder()
      } catch (err) {
        setError(err.message)
        setSubmitting(false)
        return
      }
    }

    const payload = mapProductToDb(
      {
        ...product,
        sortOrder,
        id: isNew ? slugify(product.id || product.title) : product.id,
      },
      { isNew },
    )

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
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 rounded-md bg-overlay" />
          <div className="h-8 w-64 rounded-md bg-overlay" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="h-96 rounded-lg bg-overlay" />
          <div className="h-72 rounded-lg bg-overlay" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl pb-28">
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

      <form onSubmit={handleSubmit}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <Card className="space-y-6 p-5 sm:p-6">
              <Field
                label={t('admin:products.fields.title')}
                required
                hint={t('admin:products.form.titleHint')}
                htmlFor="product-title"
                error={showError('title')}
              >
                <input
                  id="product-title"
                  type="text"
                  autoFocus={isNew}
                  value={product.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  onBlur={() => markTouched('title')}
                  placeholder={t('admin:products.fields.titlePlaceholder')}
                  className={cn(inputClassName, showError('title') && 'border-red-500/50')}
                  aria-invalid={Boolean(showError('title'))}
                />
              </Field>

              <Field
                label={t('admin:products.fields.shortDescription')}
                hint={t('admin:products.fields.shortDescriptionHint')}
                htmlFor="product-description"
              >
                <textarea
                  id="product-description"
                  rows={3}
                  value={product.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={t('admin:products.fields.shortDescription')}
                  className={cn(inputClassName, 'resize-y min-h-[4.5rem]')}
                />
              </Field>

              <Field
                label={t('admin:products.fields.appUrl')}
                required
                hint={t('admin:products.sections.links.description')}
                htmlFor="product-url"
                error={showError('url')}
              >
                <div className="flex gap-2">
                  <input
                    id="product-url"
                    type="url"
                    inputMode="url"
                    value={product.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    onBlur={() => markTouched('url')}
                    placeholder={t('admin:products.fields.appUrlPlaceholder')}
                    className={cn(
                      inputClassName,
                      'min-w-0 flex-1',
                      showError('url') && 'border-red-500/50',
                    )}
                    aria-invalid={Boolean(showError('url'))}
                  />
                  {isValidUrl(product.url) && (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
                      title={t('admin:products.form.testUrl')}
                    >
                      <ExternalLink size={16} />
                      <span className="hidden sm:inline">
                        {t('admin:products.form.testUrl')}
                      </span>
                    </a>
                  )}
                </div>
              </Field>

              <div className="border-t border-border-subtle pt-6">
                <Field
                  label={t('admin:products.sections.classification.title')}
                  hint={t('admin:products.sections.classification.description')}
                  htmlFor="product-category"
                >
                  <select
                    id="product-category"
                    value={product.categoryId ?? ''}
                    onChange={(e) =>
                      updateField('categoryId', e.target.value || null)
                    }
                    className={inputClassName}
                  >
                    <option value="">{t('admin:products.fields.categoryNone')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="border-t border-border-subtle pt-6">
                <Field
                  label={t('admin:products.sections.icon.title')}
                  hint={t('admin:products.sections.icon.description')}
                >
                  <IconField
                    value={product.iconUrl}
                    onChange={(iconUrl) => updateField('iconUrl', iconUrl)}
                  />
                </Field>
              </div>

              {isNew && (
                <details className="group border-t border-border-subtle pt-6">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                    <ChevronDown
                      size={16}
                      className="transition-transform group-open:rotate-180"
                    />
                    {t('admin:products.form.advanced')}
                  </summary>
                  <div className="mt-4">
                    <Field
                      label={t('admin:products.fields.id')}
                      hint={t('admin:products.fields.idHint')}
                      htmlFor="product-id"
                      error={showError('id')}
                    >
                      <input
                        id="product-id"
                        type="text"
                        value={product.id}
                        onChange={(e) => updateField('id', e.target.value)}
                        onBlur={() => markTouched('id')}
                        placeholder={t('admin:products.fields.idPlaceholder')}
                        className={cn(inputClassName, showError('id') && 'border-red-500/50')}
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
                  </div>
                </details>
              )}
            </Card>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-6">
            <ShortcutFormPreview product={product} />
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-sm lg:left-60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
            <p className="text-sm text-muted">
              {canSubmit
                ? t('admin:products.form.footerReady')
                : t('admin:products.form.footerIncomplete')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/admin/products">
                <Button type="button" variant="ghost">
                  {t('common:actions.cancel')}
                </Button>
              </Link>
              <Button type="submit" disabled={submitting || !canSubmit}>
                {submitting
                  ? t('admin:products.saving')
                  : isNew
                    ? t('admin:products.createProduct')
                    : t('admin:products.saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, required, hint, htmlFor, children, error, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {hint && <p className="text-label-sm text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

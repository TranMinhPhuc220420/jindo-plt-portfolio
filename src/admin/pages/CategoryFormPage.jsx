import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { inputClassName } from '../../components/ui/inputStyles'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'
import { getNextCategorySortOrder } from '../../lib/categoryOrder'
import { mapCategoryFromDb, mapCategoryToDb } from '../../lib/categoryMapper'

const emptyCategory = {
  id: '',
  name: '',
  sortOrder: 0,
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function validateCategory(category, isNew, t) {
  const errors = {}

  if (!category.name?.trim()) {
    errors.name = t('admin:categories.form.errors.nameRequired')
  }

  if (isNew && category.id && !/^[a-z0-9-]+$/.test(category.id)) {
    errors.id = t('admin:categories.form.errors.idInvalid')
  }

  return errors
}

export function CategoryFormPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const [category, setCategory] = useState(emptyCategory)
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const resolvedSlug = useMemo(
    () => slugify(category.id || category.name),
    [category.id, category.name],
  )

  const canSubmit = useMemo(() => {
    return (
      Boolean(category.name?.trim()) &&
      Object.keys(validateCategory(category, isNew, t)).length === 0
    )
  }, [category, isNew, t])

  useEffect(() => {
    if (isNew) return

    async function fetchCategory() {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCategory(mapCategoryFromDb(data))
      }
      setLoading(false)
    }

    fetchCategory()
  }, [id, isNew])

  function updateField(field, value) {
    setCategory((prev) => ({ ...prev, [field]: value }))
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

    const errors = validateCategory(category, isNew, t)
    setFieldErrors(errors)
    setTouched({ name: true, id: true })

    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)

    let sortOrder = category.sortOrder
    if (isNew) {
      try {
        sortOrder = await getNextCategorySortOrder()
      } catch (err) {
        setError(err.message)
        setSubmitting(false)
        return
      }
    }

    const payload = mapCategoryToDb({
      ...category,
      sortOrder,
      id: isNew ? slugify(category.id || category.name) : category.id,
    })

    const { error: saveError } = isNew
      ? await supabase.from('categories').insert(payload)
      : await supabase.from('categories').update(payload).eq('id', category.id)

    if (saveError) {
      setError(saveError.message)
      setSubmitting(false)
      return
    }

    navigate('/admin/categories')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 rounded-md bg-overlay" />
          <div className="h-8 w-64 rounded-md bg-overlay" />
        </div>
        <div className="h-48 rounded-lg bg-overlay" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <header className="mb-8 space-y-4">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {t('admin:categories.backToCategories')}
        </Link>
        <div>
          <h2 className="text-h1 text-foreground">
            {isNew ? t('admin:categories.newCategory') : t('admin:categories.editCategory')}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {isNew
              ? t('admin:categories.newDescription')
              : t('admin:categories.editDescription', {
                  name: category.name || category.id,
                })}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6 p-5 sm:p-6">
          <Field
            label={t('admin:categories.fields.name')}
            required
            hint={t('admin:categories.form.nameHint')}
            htmlFor="category-name"
            error={showError('name')}
          >
            <input
              id="category-name"
              type="text"
              autoFocus={isNew}
              value={category.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => markTouched('name')}
              placeholder={t('admin:categories.fields.namePlaceholder')}
              className={cn(inputClassName, showError('name') && 'border-red-500/50')}
              aria-invalid={Boolean(showError('name'))}
            />
          </Field>

          {isNew && (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  size={16}
                  className="transition-transform group-open:rotate-180"
                />
                {t('admin:categories.form.advanced')}
              </summary>
              <div className="mt-4">
                <Field
                  label={t('admin:categories.fields.id')}
                  hint={t('admin:categories.fields.idHint')}
                  htmlFor="category-id"
                  error={showError('id')}
                >
                  <input
                    id="category-id"
                    type="text"
                    value={category.id}
                    onChange={(e) => updateField('id', e.target.value)}
                    onBlur={() => markTouched('id')}
                    placeholder={t('admin:categories.fields.idPlaceholder')}
                    className={cn(inputClassName, showError('id') && 'border-red-500/50')}
                    pattern="[a-z0-9-]*"
                  />
                  {resolvedSlug && (
                    <p className="mt-1.5 text-label-sm text-muted">
                      {t('admin:categories.fields.willBeSavedAs')}{' '}
                      <code className="rounded-sm bg-overlay px-1.5 py-0.5 text-foreground">
                        {resolvedSlug}
                      </code>
                    </p>
                  )}
                </Field>
              </div>
            </details>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </p>
          )}
        </Card>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-sm lg:left-60">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
            <p className="text-sm text-muted">
              {canSubmit
                ? t('admin:categories.form.footerReady')
                : t('admin:categories.form.footerIncomplete')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/admin/categories">
                <Button type="button" variant="ghost">
                  {t('common:actions.cancel')}
                </Button>
              </Link>
              <Button type="submit" disabled={submitting || !canSubmit}>
                {submitting
                  ? t('admin:categories.saving')
                  : isNew
                    ? t('admin:categories.createCategory')
                    : t('admin:categories.saveChanges')}
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

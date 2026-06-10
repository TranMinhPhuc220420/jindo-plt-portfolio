import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { checkboxClassName, inputClassName } from '../../components/ui/inputStyles'
import { supabase } from '../../lib/supabase'
import { ProductImageUploader } from '../components/ProductImageUploader'
import { mapProductFromDb, mapProductToDb } from '../../lib/productMapper'

const emptyProduct = {
  id: '',
  title: '',
  description: '',
  longDescription: '',
  category: '',
  status: 'live',
  tags: [],
  gradient: 'from-violet-600/40 via-purple-900/30 to-black',
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
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const [product, setProduct] = useState(emptyProduct)
  const [tagsInput, setTagsInput] = useState('')
  const [highlightsInput, setHighlightsInput] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
        setHighlightsInput(mapped.highlights.join(', '))
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
      highlights: parseList(highlightsInput),
      id: isNew ? slugify(product.id || product.title) : product.id,
    })

    if (!payload.id || !payload.title || !payload.description) {
      setError('ID, title, and description are required.')
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
    return <p className="text-muted">Loading product...</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {isNew && (
            <Field label="ID (slug)" required>
              <input
                type="text"
                value={product.id}
                onChange={(e) => updateField('id', e.target.value)}
                placeholder="auto-generated from title if empty"
                className={inputClassName}
              />
            </Field>
          )}

          <Field label="Title" required>
            <input
              type="text"
              required
              value={product.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Description" required>
            <textarea
              required
              rows={2}
              value={product.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Long description">
            <textarea
              rows={4}
              value={product.longDescription}
              onChange={(e) => updateField('longDescription', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" required>
              <input
                type="text"
                required
                value={product.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Sort order">
              <input
                type="number"
                value={product.sortOrder}
                onChange={(e) =>
                  updateField('sortOrder', parseInt(e.target.value, 10) || 0)
                }
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={product.status}
                onChange={(e) => updateField('status', e.target.value)}
                className={inputClassName}
              >
                <option value="live">Live</option>
                <option value="beta">Beta</option>
                <option value="internal">Internal</option>
              </select>
            </Field>

            <Field label="Layout">
              <select
                value={product.layout}
                onChange={(e) => updateField('layout', e.target.value)}
                className={inputClassName}
              >
                <option value="featured">Featured</option>
                <option value="standard">Standard</option>
                <option value="wide">Wide</option>
                <option value="tall">Tall</option>
              </select>
            </Field>
          </div>

          <Field label="Tags (comma-separated)">
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
              className={inputClassName}
            />
          </Field>

          <Field label="Highlights (comma-separated)">
            <input
              type="text"
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Gradient (Tailwind classes)">
            <input
              type="text"
              value={product.gradient}
              onChange={(e) => updateField('gradient', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Product images">
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
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live URL">
              <input
                type="url"
                value={product.liveUrl}
                onChange={(e) => updateField('liveUrl', e.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Repo URL">
            <input
              type="url"
              value={product.repoUrl}
              onChange={(e) => updateField('repoUrl', e.target.value)}
              className={inputClassName}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={product.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
              className={checkboxClassName}
            />
            Featured product
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
            </Button>
            <Link to="/admin/products">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  )
}

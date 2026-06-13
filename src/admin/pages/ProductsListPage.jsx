import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { deleteProductImages } from '../../lib/productImages'
import { persistProductOrder } from '../../lib/productOrder'
import { mapProductFromDb } from '../../lib/productMapper'
import { ProductTable } from '../components/ProductTable'

export function ProductsListPage() {
  const { t } = useTranslation(['admin', 'common'])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .order('sort_order', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setProducts((data ?? []).map(mapProductFromDb))
    setError('')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      await loadProducts()
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [loadProducts])

  async function handleReorder(nextProducts) {
    const ordered = nextProducts.map((product, index) => ({
      ...product,
      sortOrder: index,
    }))

    const previous = products
    setProducts(ordered)
    setReordering(true)
    setError('')

    try {
      await persistProductOrder(ordered)
    } catch (err) {
      setProducts(previous)
      setError(err.message ?? t('admin:products.reorderError'))
    } finally {
      setReordering(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(t('admin:products.deleteConfirm', { title: product.title }))) {
      return
    }

    if (product.iconUrl) {
      await deleteProductImages([product.iconUrl])
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (deleteError) {
      alert(deleteError.message)
      return
    }

    const remaining = products
      .filter((p) => p.id !== product.id)
      .map((product, index) => ({ ...product, sortOrder: index }))

    setProducts(remaining)

    try {
      await persistProductOrder(remaining)
    } catch (err) {
      setError(err.message ?? t('admin:products.reorderError'))
      await loadProducts()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{t('admin:products.description')}</p>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={16} />
            {t('admin:products.addProduct')}
          </Button>
        </Link>
      </div>

      {loading && <p className="text-muted">{t('common:loading.products')}</p>}
      {reordering && (
        <p className="text-sm text-muted">{t('admin:products.reordering')}</p>
      )}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {!loading && (
        <ProductTable
          products={products}
          onReorder={handleReorder}
          onDelete={handleDelete}
          reordering={reordering}
        />
      )}
    </div>
  )
}

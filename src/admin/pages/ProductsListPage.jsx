import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { deleteProductImages } from '../../lib/productImages'
import { mapProductFromDb } from '../../lib/productMapper'
import { ProductTable } from '../components/ProductTable'

export function ProductsListPage() {
  const { t } = useTranslation(['admin', 'common'])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProducts((data ?? []).map(mapProductFromDb))
        setError('')
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(product) {
    if (!window.confirm(t('admin:products.deleteConfirm', { title: product.title }))) {
      return
    }

    const imageUrls = product.images?.length
      ? product.images
      : product.previewImage
        ? [product.previewImage]
        : []
    await deleteProductImages(imageUrls)

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (deleteError) {
      alert(deleteError.message)
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{t('admin:products.description')}</p>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={16} />
            {t('admin:products.addProduct')}
          </Button>
        </Link>
      </div>

      {loading && <p className="text-muted">{t('common:loading.products')}</p>}
      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {!loading && !error && (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </div>
  )
}

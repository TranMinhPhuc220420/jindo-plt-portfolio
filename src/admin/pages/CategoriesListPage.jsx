import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { persistCategoryOrder } from '../../lib/categoryOrder'
import { mapCategoryFromDb } from '../../lib/categoryMapper'
import { CategoryTable } from '../components/CategoryTable'

export function CategoriesListPage() {
  const { t } = useTranslation(['admin', 'common'])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)
  const [error, setError] = useState('')

  const loadCategories = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setCategories((data ?? []).map(mapCategoryFromDb))
    setError('')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      await loadCategories()
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [loadCategories])

  async function handleReorder(nextCategories) {
    const ordered = nextCategories.map((category, index) => ({
      ...category,
      sortOrder: index,
    }))

    const previous = categories
    setCategories(ordered)
    setReordering(true)
    setError('')

    try {
      await persistCategoryOrder(ordered)
    } catch (err) {
      setCategories(previous)
      setError(err.message ?? t('admin:categories.reorderError'))
    } finally {
      setReordering(false)
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(t('admin:categories.deleteConfirm', { name: category.name }))) {
      return
    }

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)

    if (deleteError) {
      alert(deleteError.message)
      return
    }

    const remaining = categories
      .filter((c) => c.id !== category.id)
      .map((c, index) => ({ ...c, sortOrder: index }))

    setCategories(remaining)

    try {
      await persistCategoryOrder(remaining)
    } catch (err) {
      setError(err.message ?? t('admin:categories.reorderError'))
      await loadCategories()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{t('admin:categories.description')}</p>
        <Link to="/admin/categories/new">
          <Button>
            <Plus size={16} />
            {t('admin:categories.addCategory')}
          </Button>
        </Link>
      </div>

      {loading && <p className="text-muted">{t('common:loading.categories')}</p>}
      {reordering && (
        <p className="text-sm text-muted">{t('admin:categories.reordering')}</p>
      )}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {!loading && (
        <CategoryTable
          categories={categories}
          onReorder={handleReorder}
          onDelete={handleDelete}
          reordering={reordering}
        />
      )}
    </div>
  )
}

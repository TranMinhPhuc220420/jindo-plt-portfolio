import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mapCategoryFromDb } from '../lib/categoryMapper'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setCategories((data ?? []).map(mapCategoryFromDb))
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

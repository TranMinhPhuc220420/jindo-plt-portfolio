import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mapProductFromDb } from '../lib/productMapper'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      setProducts((data ?? []).map(mapProductFromDb))
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

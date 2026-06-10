import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mapProductFromDb } from '../lib/productMapper'

export function useProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [bentoProducts, setBentoProducts] = useState([])
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

      const products = (data ?? []).map(mapProductFromDb)
      setFeaturedProducts(products.filter((p) => p.featured))
      setBentoProducts(products.filter((p) => !p.featured))
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return { featuredProducts, bentoProducts, loading, error }
}

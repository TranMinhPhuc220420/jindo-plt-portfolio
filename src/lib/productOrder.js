import { supabase } from './supabase'

export async function getNextSortOrder() {
  const { data, error } = await supabase
    .from('products')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.sort_order ?? -1) + 1
}

/** @param {{ id: string, sortOrder: number }[]} products */
export async function persistProductOrder(products) {
  const results = await Promise.all(
    products.map((product) =>
      supabase
        .from('products')
        .update({ sort_order: product.sortOrder })
        .eq('id', product.id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) throw failed.error
}

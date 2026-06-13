import { supabase } from './supabase'

export async function getNextCategorySortOrder() {
  const { data, error } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  if (error) throw error
  return (data?.[0]?.sort_order ?? -1) + 1
}

/** @param {{ id: string, sortOrder: number }[]} categories */
export async function persistCategoryOrder(categories) {
  const results = await Promise.all(
    categories.map((category) =>
      supabase
        .from('categories')
        .update({ sort_order: category.sortOrder })
        .eq('id', category.id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) throw failed.error
}

/** @param {import('@supabase/supabase-js').PostgrestSingleResponse<any>['data']} row */
export function mapCategoryFromDb(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order ?? 0,
  }
}

/** @param {ReturnType<typeof mapCategoryFromDb>} category */
export function mapCategoryToDb(category) {
  return {
    id: category.id,
    name: category.name,
    sort_order: category.sortOrder ?? 0,
  }
}

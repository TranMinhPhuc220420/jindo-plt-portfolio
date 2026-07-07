/** @param {import('@supabase/supabase-js').PostgrestSingleResponse<any>['data']} row */
export function mapProductFromDb(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    description: row.description?.trim() || undefined,
    iconUrl: row.icon_url ?? row.images?.[0] ?? row.preview_image ?? undefined,
    url: row.live_url ?? undefined,
    sortOrder: row.sort_order ?? 0,
    categoryId: row.category_id ?? null,
    categoryName: row.category?.name ?? null,
  }
}

/** @param {ReturnType<typeof mapProductFromDb>} product @param {{ isNew?: boolean }} [options] */
export function mapProductToDb(product, { isNew = false } = {}) {
  const managed = {
    title: product.title,
    icon_url: product.iconUrl || null,
    live_url: product.url || null,
    sort_order: product.sortOrder ?? 0,
    category_id: product.categoryId || null,
    description: product.description?.trim() || null,
  }

  if (!isNew) {
    return managed
  }

  return {
    id: product.id,
    ...managed,
    status: 'live',
    tags: [],
    gradient: '',
    featured: false,
    layout: 'standard',
    highlights: [],
    images: [],
    preview_image: null,
    repo_url: null,
    long_description: null,
  }
}

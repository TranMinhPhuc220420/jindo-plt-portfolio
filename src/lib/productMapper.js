/** @param {import('@supabase/supabase-js').PostgrestSingleResponse<any>['data']} row */
export function mapProductFromDb(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    iconUrl: row.icon_url ?? row.images?.[0] ?? row.preview_image ?? undefined,
    url: row.live_url ?? undefined,
    sortOrder: row.sort_order ?? 0,
  }
}

/** @param {ReturnType<typeof mapProductFromDb>} product */
export function mapProductToDb(product) {
  return {
    id: product.id,
    title: product.title,
    icon_url: product.iconUrl || null,
    live_url: product.url || null,
    sort_order: product.sortOrder ?? 0,
    description: '',
    category: '',
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

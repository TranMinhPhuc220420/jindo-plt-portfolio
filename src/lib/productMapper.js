/** @param {import('@supabase/supabase-js').PostgrestSingleResponse<any>['data']} row */
export function mapProductFromDb(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.long_description ?? '',
    category: row.category,
    status: row.status,
    tags: row.tags ?? [],
    gradient: row.gradient,
    images: row.images ?? [],
    previewImage: row.preview_image ?? row.images?.[0] ?? undefined,
    liveUrl: row.live_url ?? undefined,
    repoUrl: row.repo_url ?? undefined,
    featured: row.featured,
    layout: row.layout,
    highlights: row.highlights ?? [],
    sortOrder: row.sort_order ?? 0,
  }
}

/** @param {ReturnType<typeof mapProductFromDb>} product */
export function mapProductToDb(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    long_description: product.longDescription || null,
    category: product.category,
    status: product.status,
    tags: product.tags ?? [],
    gradient: product.gradient,
    images: product.images ?? [],
    preview_image: product.images?.[0] || product.previewImage || null,
    live_url: product.liveUrl || null,
    repo_url: product.repoUrl || null,
    featured: product.featured ?? false,
    layout: product.layout,
    highlights: product.highlights ?? [],
    sort_order: product.sortOrder ?? 0,
  }
}

import { supabase } from './supabase'

const BUCKET = 'product-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024

function getExtension(file) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName
  const fromType = file.type.split('/')[1]
  return fromType === 'jpeg' ? 'jpg' : fromType || 'jpg'
}

function validateImageFile(file) {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5 MB or smaller.'
  }
  return null
}

/** @param {File} file */
export async function uploadProductImage(file) {
  const validationError = validateImageFile(file)
  if (validationError) {
    return { url: null, error: validationError }
  }

  const path = `${crypto.randomUUID()}.${getExtension(file)}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/** Extract storage object path from a public URL */
export function getStoragePathFromUrl(url) {
  if (!url) return null
  try {
    const pathname = new URL(url).pathname
    const marker = `/object/public/${BUCKET}/`
    const idx = pathname.indexOf(marker)
    if (idx === -1) return null
    return decodeURIComponent(pathname.slice(idx + marker.length))
  } catch {
    return null
  }
}

/** @param {string[]} urls */
export async function deleteProductImages(urls) {
  const paths = (urls ?? [])
    .map(getStoragePathFromUrl)
    .filter(Boolean)

  if (paths.length === 0) return { error: null }

  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  return { error: error?.message ?? null }
}

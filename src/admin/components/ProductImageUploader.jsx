import { useRef, useState } from 'react'
import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'
import { deleteProductImages, uploadProductImage } from '../../lib/productImages'

export function ProductImageUploader({ images, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) return

    setError('')
    setUploading(true)

    const newUrls = []
    for (const file of files) {
      const { url, error: uploadError } = await uploadProductImage(file)
      if (uploadError) {
        setError(uploadError)
        continue
      }
      if (url) newUrls.push(url)
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls])
    }
    setUploading(false)
  }

  function handleInputChange(e) {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  async function handleRemove(url) {
    setError('')
    const { error: deleteError } = await deleteProductImages([url])
    if (deleteError) {
      setError(deleteError)
      return
    }
    onChange(images.filter((img) => img !== url))
  }

  function handleSetCover(index) {
    if (index === 0) return
    const next = [...images]
    const [cover] = next.splice(index, 1)
    onChange([cover, ...next])
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
          dragging
            ? 'border-primary/50 bg-primary/5'
            : 'border-border bg-overlay-muted hover:border-primary/30 hover:bg-overlay'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        {uploading ? (
          <p className="text-sm text-muted">Uploading...</p>
        ) : (
          <>
            <Upload size={24} className="text-muted" />
            <p className="text-sm text-foreground">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-muted">PNG, JPG, WebP — max 5 MB each</p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-xl border border-border bg-overlay"
            >
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="aspect-video w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-0.5 text-xs font-medium text-white">
                  <Star size={12} />
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetCover(index)
                    }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs text-white hover:bg-white/20"
                    title="Set as cover"
                  >
                    <ImagePlus size={14} />
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(url)
                  }}
                  className="flex items-center justify-center rounded-lg bg-red-500/80 px-2 py-1.5 text-xs text-white hover:bg-red-500"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

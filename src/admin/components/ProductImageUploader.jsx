import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Trash2, Upload } from 'lucide-react'
import { cn } from '../../lib/cn'
import { deleteProductImages, uploadProductImage } from '../../lib/productImages'

export function ProductImageUploader({ images, onChange }) {
  const { t } = useTranslation('admin')
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

  async function handleRemove(url, e) {
    e.stopPropagation()
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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 transition-colors ${
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
          <p className="text-sm text-muted">{t('imageUploader.uploading')}</p>
        ) : (
          <>
            <Upload size={24} className="text-muted" />
            <p className="text-sm text-foreground">{t('imageUploader.dropHint')}</p>
            <p className="text-xs text-muted">{t('imageUploader.formats')}</p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <>
          <p className="text-label-sm text-muted">{t('imageUploader.clickCoverHint')}</p>
          <div className="grid grid-cols-2 gap-3">
            {images.map((url, index) => {
              const isCover = index === 0

              return (
                <div
                  key={url}
                  className={cn(
                    'group relative overflow-hidden rounded-md border bg-overlay transition-colors',
                    isCover
                      ? 'border-primary ring-1 ring-primary/30'
                      : 'cursor-pointer border-border hover:border-primary/40',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSetCover(index)}
                    disabled={isCover}
                    className={cn('block w-full text-left', !isCover && 'cursor-pointer')}
                    aria-label={
                      isCover
                        ? t('imageUploader.coverImage', {
                            index: index + 1,
                            total: images.length,
                          })
                        : t('imageUploader.setImageAsCover', { index: index + 1 })
                    }
                    aria-current={isCover ? 'true' : undefined}
                  >
                    <img
                      src={url}
                      alt={t('imageUploader.productImage', { index: index + 1 })}
                      className="aspect-video w-full object-cover"
                      draggable={false}
                    />
                    {!isCover && (
                      <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 text-xs font-medium text-white opacity-0 transition-opacity group-hover:bg-foreground/40 group-hover:opacity-100">
                        {t('imageUploader.setCover')}
                      </span>
                    )}
                  </button>

                  {isCover && (
                    <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-white">
                      <Star size={12} />
                      {t('imageUploader.cover')}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleRemove(url, e)}
                    className="absolute right-2 top-2 z-10 rounded-md bg-red-500/90 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={t('imageUploader.removeImage', { index: index + 1 })}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

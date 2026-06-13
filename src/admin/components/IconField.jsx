import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, Upload } from 'lucide-react'
import { cn } from '../../lib/cn'
import { inputClassName } from '../../components/ui/inputStyles'
import {
  deleteProductImages,
  getStoragePathFromUrl,
  uploadProductImage,
} from '../../lib/productImages'

export function IconField({ value, onChange }) {
  const { t } = useTranslation('admin')
  const inputRef = useRef(null)
  const [mode, setMode] = useState(() =>
    value && !getStoragePathFromUrl(value) ? 'url' : 'upload',
  )
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file?.type.startsWith('image/')) return

    setError('')
    setUploading(true)

    if (value && getStoragePathFromUrl(value)) {
      await deleteProductImages([value])
    }

    const { url, error: uploadError } = await uploadProductImage(file)
    if (uploadError) {
      setError(uploadError)
    } else if (url) {
      onChange(url)
    }
    setUploading(false)
  }

  async function handleRemove() {
    setError('')
    if (value && getStoragePathFromUrl(value)) {
      const { error: deleteError } = await deleteProductImages([value])
      if (deleteError) {
        setError(deleteError)
        return
      }
    }
    onChange('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm transition-colors',
            mode === 'upload'
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted hover:text-foreground',
          )}
        >
          {t('products.iconField.upload')}
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm transition-colors',
            mode === 'url'
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border text-muted hover:text-foreground',
          )}
        >
          {t('products.iconField.url')}
        </button>
      </div>

      {value && (
        <div className="flex items-center gap-4">
          <img
            src={value}
            alt=""
            className="h-14 w-14 rounded-xl border border-border object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-red-400"
          >
            <Trash2 size={14} />
            {t('products.iconField.remove')}
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFile(file)
            }}
            className={cn(
              'flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8',
              'text-sm text-muted transition-colors hover:border-primary/40 hover:text-foreground',
              dragging ? 'border-primary/50 bg-primary/5' : 'border-border',
              uploading && 'pointer-events-none opacity-60',
            )}
          >
            <Upload size={20} />
            {uploading
              ? t('imageUploader.uploading')
              : t('products.iconField.dropHint')}
          </button>
          <p className="mt-1.5 text-label-sm text-muted">
            {t('products.iconField.formats')}
          </p>
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('products.iconField.urlPlaceholder')}
          className={inputClassName}
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

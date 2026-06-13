import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { inputClassName, checkboxClassName } from '../../components/ui/inputStyles'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'
import {
  DEFAULT_FOOTER_SETTINGS,
  mapFooterFromDb,
  mapFooterToDb,
} from '../../lib/footerMapper'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateFooter(settings, t) {
  const errors = {}

  if (!settings.address?.trim()) {
    errors.address = t('admin:footer.form.errors.addressRequired')
  }

  if (!settings.phone?.trim()) {
    errors.phone = t('admin:footer.form.errors.phoneRequired')
  }

  if (!settings.email?.trim()) {
    errors.email = t('admin:footer.form.errors.emailRequired')
  } else if (!isValidEmail(settings.email.trim())) {
    errors.email = t('admin:footer.form.errors.emailInvalid')
  }

  if (!settings.businessHours?.trim()) {
    errors.businessHours = t('admin:footer.form.errors.businessHoursRequired')
  }

  const urlFields = [
    ['socialInstagramUrl', settings.socialInstagramUrl, settings.socialInstagramEnabled],
    ['socialYoutubeUrl', settings.socialYoutubeUrl, settings.socialYoutubeEnabled],
    ['socialFacebookUrl', settings.socialFacebookUrl, settings.socialFacebookEnabled],
  ]

  for (const [field, value, enabled] of urlFields) {
    if (enabled && value?.trim() && !isValidUrl(value.trim())) {
      errors[field] = t('admin:footer.form.errors.urlInvalid')
    }
  }

  return errors
}

export function FooterSettingsPage() {
  const { t } = useTranslation(['admin', 'common'])
  const [settings, setSettings] = useState(DEFAULT_FOOTER_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const canSubmit = useMemo(() => {
    return Object.keys(validateFooter(settings, t)).length === 0
  }, [settings, t])

  useEffect(() => {
    async function fetchSettings() {
      const { data, error: fetchError } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()

      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setSettings(mapFooterFromDb(data))
      }

      setLoading(false)
    }

    fetchSettings()
  }, [])

  function updateField(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function showError(field) {
    return touched[field] ? fieldErrors[field] : undefined
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const errors = validateFooter(settings, t)
    setFieldErrors(errors)
    setTouched({
      address: true,
      phone: true,
      email: true,
      businessHours: true,
      socialInstagramUrl: true,
      socialYoutubeUrl: true,
      socialFacebookUrl: true,
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)

    const payload = mapFooterToDb(settings)
    const { error: saveError } = await supabase
      .from('footer_settings')
      .upsert(payload, { onConflict: 'id' })

    if (saveError) {
      setError(saveError.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 rounded-md bg-overlay" />
          <div className="h-8 w-64 rounded-md bg-overlay" />
        </div>
        <div className="h-48 rounded-lg bg-overlay" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <header className="mb-8">
        <h2 className="text-h1 text-foreground">{t('admin:footer.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('admin:footer.description')}</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="space-y-6 p-5 sm:p-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {t('admin:footer.sections.contact')}
              </h3>
            </div>

            <Field
              label={t('admin:footer.fields.address')}
              required
              htmlFor="footer-address"
              error={showError('address')}
            >
              <textarea
                id="footer-address"
                rows={2}
                value={settings.address}
                onChange={(e) => updateField('address', e.target.value)}
                onBlur={() => markTouched('address')}
                placeholder={t('admin:footer.fields.addressPlaceholder')}
                className={cn(inputClassName, showError('address') && 'border-red-500/50')}
                aria-invalid={Boolean(showError('address'))}
              />
            </Field>

            <Field
              label={t('admin:footer.fields.phone')}
              required
              htmlFor="footer-phone"
              error={showError('phone')}
            >
              <input
                id="footer-phone"
                type="text"
                value={settings.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                onBlur={() => markTouched('phone')}
                placeholder={t('admin:footer.fields.phonePlaceholder')}
                className={cn(inputClassName, showError('phone') && 'border-red-500/50')}
                aria-invalid={Boolean(showError('phone'))}
              />
            </Field>

            <Field
              label={t('admin:footer.fields.email')}
              required
              htmlFor="footer-email"
              error={showError('email')}
            >
              <input
                id="footer-email"
                type="email"
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder={t('admin:footer.fields.emailPlaceholder')}
                className={cn(inputClassName, showError('email') && 'border-red-500/50')}
                aria-invalid={Boolean(showError('email'))}
              />
            </Field>

            <Field
              label={t('admin:footer.fields.businessHours')}
              required
              htmlFor="footer-business-hours"
              hint={t('admin:footer.fields.businessHoursHint')}
              error={showError('businessHours')}
            >
              <input
                id="footer-business-hours"
                type="text"
                value={settings.businessHours}
                onChange={(e) => updateField('businessHours', e.target.value)}
                onBlur={() => markTouched('businessHours')}
                placeholder={t('admin:footer.fields.businessHoursPlaceholder')}
                className={cn(inputClassName, showError('businessHours') && 'border-red-500/50')}
                aria-invalid={Boolean(showError('businessHours'))}
              />
            </Field>
          </Card>

          <Card className="space-y-6 p-5 sm:p-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {t('admin:footer.sections.social')}
              </h3>
              <p className="mt-1 text-label-sm text-muted">
                {t('admin:footer.sections.socialHint')}
              </p>
            </div>

            <SocialField
              label={t('admin:footer.fields.socialInstagram')}
              enabled={settings.socialInstagramEnabled}
              onEnabledChange={(value) => updateField('socialInstagramEnabled', value)}
              urlId="footer-instagram"
              urlValue={settings.socialInstagramUrl}
              onUrlChange={(value) => updateField('socialInstagramUrl', value)}
              onUrlBlur={() => markTouched('socialInstagramUrl')}
              urlPlaceholder="https://instagram.com/..."
              error={showError('socialInstagramUrl')}
            />

            <SocialField
              label={t('admin:footer.fields.socialYoutube')}
              enabled={settings.socialYoutubeEnabled}
              onEnabledChange={(value) => updateField('socialYoutubeEnabled', value)}
              urlId="footer-youtube"
              urlValue={settings.socialYoutubeUrl}
              onUrlChange={(value) => updateField('socialYoutubeUrl', value)}
              onUrlBlur={() => markTouched('socialYoutubeUrl')}
              urlPlaceholder="https://youtube.com/..."
              error={showError('socialYoutubeUrl')}
            />

            <SocialField
              label={t('admin:footer.fields.socialFacebook')}
              enabled={settings.socialFacebookEnabled}
              onEnabledChange={(value) => updateField('socialFacebookEnabled', value)}
              urlId="footer-facebook"
              urlValue={settings.socialFacebookUrl}
              onUrlChange={(value) => updateField('socialFacebookUrl', value)}
              onUrlBlur={() => markTouched('socialFacebookUrl')}
              urlPlaceholder="https://facebook.com/..."
              error={showError('socialFacebookUrl')}
            />

            <SocialField
              label={t('admin:footer.fields.socialEmail')}
              enabled={settings.socialEmailEnabled}
              onEnabledChange={(value) => updateField('socialEmailEnabled', value)}
              hint={t('admin:footer.fields.socialEmailHint')}
              showUrl={false}
            />
          </Card>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
            >
              {t('admin:footer.saveSuccess')}
            </p>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-sm lg:left-60">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
            <p className="text-sm text-muted">
              {canSubmit
                ? t('admin:footer.form.footerReady')
                : t('admin:footer.form.footerIncomplete')}
            </p>
            <Button type="submit" disabled={submitting || !canSubmit}>
              {submitting ? t('admin:footer.saving') : t('admin:footer.saveChanges')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function SocialField({
  label,
  enabled,
  onEnabledChange,
  urlId,
  urlValue = '',
  onUrlChange,
  onUrlBlur,
  urlPlaceholder,
  error,
  hint,
  showUrl = true,
}) {
  const { t } = useTranslation('admin')
  const toggleId = `${urlId ?? label}-enabled`

  return (
    <div className="space-y-3 rounded-md border border-border bg-overlay/40 p-4">
      <label htmlFor={toggleId} className="flex cursor-pointer items-center gap-3">
        <input
          id={toggleId}
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className={checkboxClassName}
        />
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-label-sm text-muted">
          {enabled ? t('footer.fields.visible') : t('footer.fields.hidden')}
        </span>
      </label>

      {hint && <p className="text-label-sm text-muted">{hint}</p>}

      {showUrl && enabled && (
        <div className="space-y-1.5">
          <label htmlFor={urlId} className="block text-sm text-muted">
            {t('footer.fields.url')}
          </label>
          <input
            id={urlId}
            type="url"
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            onBlur={onUrlBlur}
            placeholder={urlPlaceholder}
            className={cn(inputClassName, error && 'border-red-500/50')}
            aria-invalid={Boolean(error)}
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, required, hint, htmlFor, children, error, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {hint && <p className="text-label-sm text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

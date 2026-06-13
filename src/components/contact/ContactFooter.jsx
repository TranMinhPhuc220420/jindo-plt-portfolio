import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import logoImg from '../../assets/hero.png'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'
import { supabase } from '../../lib/supabase'
import { inputClassName } from '../ui/inputStyles'

import instagramLogo from '../../assets/icons/instagram.png'
import youtubeLogo from '../../assets/icons/youtube.png'
import facebookLogo from '../../assets/icons/facebook.png'
import mailLogo from '../../assets/icons/mail.png'

const contactInfo = {
  address: '72 Nguyen Hue Boulevard, District 1, Ho Chi Minh City 700000, Vietnam',
  phone: '+84 28 3822 4567',
  email: 'hello@pltsolutions.com',
}

export function ContactFooter() {
  const { t } = useTranslation('public')
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const socialLinks = [
    { icon: instagramLogo, labelKey: 'social.instagram' },
    { icon: youtubeLogo, labelKey: 'social.youtube' },
    { icon: facebookLogo, labelKey: 'social.facebook' },
    { icon: mailLogo, labelKey: 'social.email' },
  ]

  const quickLinks = [
    { labelKey: 'nav.products', href: '#products' },
    { labelKey: 'nav.stack', href: '#stack' },
    { labelKey: 'nav.contact', href: '#contact' },
  ]

  const companyLinks = [
    { labelKey: 'footerLinks.aboutUs', href: '#' },
    { labelKey: 'footerLinks.careers', href: '#' },
    { labelKey: 'footerLinks.blog', href: '#' },
    { labelKey: 'footerLinks.caseStudies', href: '#' },
  ]

  const legalLinks = [
    { labelKey: 'footerLinks.privacyPolicy', href: '#' },
    { labelKey: 'footerLinks.termsOfService', href: '#' },
    { labelKey: 'footerLinks.cookiePolicy', href: '#' },
  ]

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name,
      email: form.email,
      company: form.company || null,
      message: form.message,
    })

    if (error) {
      setStatus({ type: 'error', message: t('contact.error') })
    } else {
      setStatus({ type: 'success', message: t('contact.success') })
      setForm({ name: '', email: '', company: '', message: '' })
    }
    setSubmitting(false)
  }

  return (
    <footer id="contact" className="border-t border-border-subtle py-20">
      <Container>
        <div className="rounded-lg border border-border bg-surface p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{t('contact.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t('contact.title')}
              </h2>
              <p className="mt-4 text-muted">{t('contact.description')}</p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button href="#">
                  <Mail size={16} />
                  {contactInfo.email}
                </Button>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon, labelKey }) => (
                    <a
                      key={labelKey}
                      href="#"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-overlay text-muted transition-colors hover:border-primary/30 hover:text-primary"
                      aria-label={t(labelKey)}
                    >
                      <img src={icon} alt="" className="h-6 w-6" />
                      <span className="sr-only">{t(labelKey)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClassName}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputClassName}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t('contact.form.company')}{' '}
                  <span className="text-muted">{t('contact.form.companyOptional')}</span>
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className={inputClassName}
                  placeholder={t('contact.form.companyPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={inputClassName}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              {status && (
                <p
                  className={
                    status.type === 'success'
                      ? 'rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-sm text-emerald-400'
                      : 'rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400'
                  }
                >
                  {status.message}
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                <Send size={16} />
                {submitting
                  ? t('actions.sending', { ns: 'common' })
                  : t('actions.sendMessage', { ns: 'common' })}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-border-subtle pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logoImg} alt="PLT SOLUTIONS Logo" className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {t('contact.footerDescription')}
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ icon, labelKey }) => (
                <a
                  key={labelKey}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-overlay text-muted transition-colors hover:border-primary/30 hover:text-primary"
                  aria-label={t(labelKey)}
                >
                  <img src={icon} alt="" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('contact.quickLinks')}</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('contact.company')}</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('contact.getInTouch')}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2.5 text-sm text-muted">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex gap-2.5 text-sm text-muted">
                <Phone size={16} className="shrink-0 text-primary" aria-hidden="true" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex gap-2.5 text-sm text-muted">
                <Mail size={16} className="shrink-0 text-primary" aria-hidden="true" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted">{t('contact.hours')}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-sm text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {t('contact.copyright')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map(({ labelKey, href }) => (
              <a
                key={labelKey}
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {t(labelKey)}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}

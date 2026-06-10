import { useState } from 'react'
import { Code2, Mail, Share2, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../layout/Container'
import { supabase } from '../../lib/supabase'

const socialLinks = [
  { icon: Code2, label: 'GitHub', href: 'https://github.com' },
  { icon: Share2, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@pltsolutions.dev' },
]

import { inputClassName } from '../ui/inputStyles'
export function ContactFooter() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

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
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' })
    } else {
      setStatus({ type: 'success', message: 'Message sent! We\'ll get back to you within 24 hours.' })
      setForm({ name: '', email: '', company: '', message: '' })
    }
    setSubmitting(false)
  }

  return (
    <footer id="contact" className="border-t border-border-subtle py-20">
      <Container>
        <div className="rounded-3xl border border-border bg-overlay-muted p-8 backdrop-blur-xl md:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Let&apos;s build something great
              </h2>
              <p className="mt-4 text-muted">
                Interested in our products or want to collaborate? Send us a
                message and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button href="mailto:hello@pltsolutions.dev">
                  <Mail size={16} />
                  hello@pltsolutions.dev
                </Button>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-overlay text-muted transition-colors hover:border-primary/30 hover:text-primary"
                      aria-label={label}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClassName}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputClassName}
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium text-foreground">
                  Company <span className="text-muted">(optional)</span>
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className={inputClassName}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={inputClassName}
                  placeholder="Tell us about your project..."
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
                {submitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-sm text-muted sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 border border-primary/30 text-xs font-bold text-primary">
              P
            </span>
            <span className="font-medium text-foreground">PLT Solutions</span>
          </div>
          <p>&copy; {new Date().getFullYear()} PLT Solutions. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

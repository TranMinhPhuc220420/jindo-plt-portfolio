import { useEffect, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'
import { ContactTable } from '../components/ContactTable'

export function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [marking, setMarking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: fetchError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setContacts(data ?? [])
        setError('')
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleMarkRead(contact) {
    if (contact.is_read) return
    setMarking(true)
    const { error: updateError } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', contact.id)

    if (updateError) {
      alert(updateError.message)
    } else {
      setSelected((prev) => (prev ? { ...prev, is_read: true } : null))
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, is_read: true } : c)),
      )
    }
    setMarking(false)
  }

  function handleSelect(contact) {
    setSelected(contact)
    if (!contact.is_read) {
      handleMarkRead(contact)
    }
  }

  function handleToggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleToggleSelectAll() {
    const allSelected = contacts.every((c) => selectedIds.has(c.id))
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)))
    }
  }

  async function handleDelete(contact) {
    if (
      !window.confirm(
        `Delete submission from "${contact.name}"? This cannot be undone.`,
      )
    ) {
      return
    }

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', contact.id)

    if (deleteError) {
      alert(deleteError.message)
      setDeleting(false)
      return
    }

    setContacts((prev) => prev.filter((c) => c.id !== contact.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(contact.id)
      return next
    })
    if (selected?.id === contact.id) {
      setSelected(null)
    }
    setDeleting(false)
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds]
    if (ids.length === 0) return

    if (
      !window.confirm(
        `Delete ${ids.length} submission(s)? This cannot be undone.`,
      )
    ) {
      return
    }

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', ids)

    if (deleteError) {
      alert(deleteError.message)
      setDeleting(false)
      return
    }

    const idSet = new Set(ids)
    setContacts((prev) => prev.filter((c) => !idSet.has(c.id)))
    if (selected && idSet.has(selected.id)) {
      setSelected(null)
    }
    setSelectedIds(new Set())
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Contact submissions from the public portfolio site.
        </p>
        {selectedIds.size > 0 && (
          <Button
            variant="ghost"
            onClick={handleBulkDelete}
            disabled={deleting}
            className="border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 size={16} />
            Delete selected ({selectedIds.size})
          </Button>
        )}
      </div>

      {loading && <p className="text-muted">Loading contacts...</p>}
      {error && (
        <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {!loading && !error && (
        <ContactTable
          contacts={contacts}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onDelete={handleDelete}
        />
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <Card className="relative z-10 w-full max-w-lg p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {selected.name}
                </h2>
                <p className="text-sm text-muted">{selected.email}</p>
                {selected.company && (
                  <p className="text-sm text-muted">{selected.company}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-muted hover:bg-overlay"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {selected.message}
            </p>

            <p className="mt-4 text-xs text-muted">
              {new Date(selected.created_at).toLocaleString()}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {!selected.is_read && (
                <Button
                  onClick={() => handleMarkRead(selected)}
                  disabled={marking}
                >
                  {marking ? 'Marking...' : 'Mark as read'}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => handleDelete(selected)}
                disabled={deleting}
                className="border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

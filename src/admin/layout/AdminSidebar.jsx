import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Mail, Package, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { supabase } from '../../lib/supabase'

const navItems = [
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail, showBadge: true },
]

export function AdminSidebar({ open, onClose }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      const { count } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
      setUnreadCount(count ?? 0)
    }

    fetchUnread()

    const channel = supabase
      .channel('contact_submissions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_submissions' },
        () => fetchUnread(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-sm font-bold text-primary">
              P
            </span>
            <span className="font-semibold text-foreground">PLT Admin</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-overlay lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, showBadge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-muted hover:bg-overlay hover:text-foreground border border-transparent',
                )
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {showBadge && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

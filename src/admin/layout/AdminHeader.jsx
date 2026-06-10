import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export function AdminHeader({ title, onMenuClick }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-overlay lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="hidden text-sm text-muted sm:inline">
          {user?.email}
        </span>
        <Button variant="ghost" onClick={handleSignOut} className="!px-3 !py-2">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { inputClassName } from '../../components/ui/inputStyles'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/admin/products" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate('/admin/products')
    } catch (err) {
      setError(err.message ?? 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-primary-deep/10 blur-[100px]" />
      </div>

      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-sm font-bold text-primary">
            P
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-foreground">
            PLT Admin
          </h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

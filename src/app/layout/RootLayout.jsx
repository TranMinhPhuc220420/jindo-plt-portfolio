import { SiteHeader } from '../../components/layout/SiteHeader'

export function RootLayout({ children }) {
  return (
    <div className="relative min-h-svh bg-background text-foreground antialiased">
      <SiteHeader />
      <main>{children}</main>
    </div>
  )
}

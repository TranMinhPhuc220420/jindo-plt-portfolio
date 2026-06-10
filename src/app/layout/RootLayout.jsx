import { SiteHeader } from '../../components/layout/SiteHeader'

export function RootLayout({ children }) {
  return (
    <div className="relative min-h-svh bg-background text-foreground antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-100"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-primary-deep/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet-900/10 blur-[100px]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      <SiteHeader />
      <main>{children}</main>
    </div>
  )
}

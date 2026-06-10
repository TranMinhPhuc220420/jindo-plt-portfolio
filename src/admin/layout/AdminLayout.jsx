import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

export function AdminLayout() {
  const { t } = useTranslation('admin')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  function getPageTitle(path) {
    if (path.startsWith('/admin/products/new')) return t('pages.newProduct')
    if (path.match(/^\/admin\/products\/[^/]+$/)) return t('pages.editProduct')
    if (path === '/admin/products') return t('pages.products')
    if (path === '/admin/contacts') return t('pages.contacts')
    return t('pages.admin')
  }

  const title = getPageTitle(pathname)

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-0">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

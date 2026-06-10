import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

const pageTitles = {
  '/admin/products': 'Products',
  '/admin/contacts': 'Contacts',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/admin/products/new')) return 'New Product'
  if (pathname.match(/^\/admin\/products\/[^/]+$/)) return 'Edit Product'
  return pageTitles[pathname] ?? 'Admin'
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-0">
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

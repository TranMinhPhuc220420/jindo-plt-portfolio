import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import { ProtectedRoute } from './admin/components/ProtectedRoute'
import { AdminLayout } from './admin/layout/AdminLayout'
import { LoginPage } from './admin/pages/LoginPage'
import { ProductsListPage } from './admin/pages/ProductsListPage'
import { ProductFormPage } from './admin/pages/ProductFormPage'
import { ContactsPage } from './admin/pages/ContactsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          <Route path="contacts" element={<ContactsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-muted">No products yet.</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-overlay text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-overlay-muted">
              <td className="px-4 py-3 font-medium text-foreground">
                {product.title}
              </td>
              <td className="px-4 py-3 text-muted">{product.category}</td>
              <td className="px-4 py-3">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-4 py-3 text-muted">
                {product.featured ? 'Yes' : 'No'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

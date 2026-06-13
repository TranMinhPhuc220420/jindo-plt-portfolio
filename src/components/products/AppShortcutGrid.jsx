import { motion } from 'framer-motion'
import { AppShortcutCard } from './AppShortcutCard'

export function AppShortcutGrid({ products }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          <AppShortcutCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'

export function ProductBentoGrid({ products }) {
  return (
    <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className={
            product.layout === 'wide'
              ? 'md:col-span-2'
              : product.layout === 'tall'
                ? 'md:row-span-2'
                : ''
          }
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}

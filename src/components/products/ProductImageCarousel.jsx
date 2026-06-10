import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { ProductPreview } from './ProductPreview'

const SWIPE_THRESHOLD = 48

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

export function ProductImageCarousel({ images = [], gradient, title, className }) {
  const list = images.filter(Boolean)

  if (list.length === 0) {
    return (
      <ProductPreview
        gradient={gradient}
        image={undefined}
        title={title}
        className={className}
      />
    )
  }

  if (list.length === 1) {
    return (
      <ProductPreview
        gradient={gradient}
        image={list[0]}
        title={title}
        className={className}
      />
    )
  }

  return (
    <Carousel
      key={list.join('|')}
      images={list}
      gradient={gradient}
      title={title}
      className={className}
    />
  )
}

function Carousel({ images, gradient, title, className }) {
  const [[index, direction], setSlide] = useState([0, 0])

  function goTo(nextIndex, nextDirection) {
    const wrapped =
      ((nextIndex % images.length) + images.length) % images.length
    setSlide([wrapped, nextDirection])
  }

  function paginate(step) {
    goTo(index + step, step)
  }

  function handleDragEnd(_, info) {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
  }

  return (
    <div
      className={cn('group/carousel relative h-full w-full overflow-hidden', className)}
      aria-label={`${title} image carousel`}
      aria-roledescription="carousel"
    >
      <div className={cn('absolute inset-0 -z-10 bg-gradient-to-br', gradient)} />

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img
            src={images[index]}
            alt={`${title} preview ${index + 1} of ${images.length}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white/90 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover/carousel:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white/90 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover/carousel:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight size={18} />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2.5 pt-10">
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={cn(
                'pointer-events-auto h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60',
              )}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
        <p className="mt-1.5 text-center text-[10px] font-medium text-white/70">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}

import { cn } from '../../lib/cn'
import { Container } from './Container'

export function Section({ id, children, className, containerClassName }) {
  return (
    <section id={id} className={cn('py-20 md:py-28', className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}

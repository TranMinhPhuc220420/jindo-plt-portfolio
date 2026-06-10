import { Section } from '../layout/Section'

function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex w-max gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
      >
        {doubled.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-overlay px-5 py-3 backdrop-blur-sm"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tech.color }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TechStackMarquee({ items }) {
  const half = Math.ceil(items.length / 2)
  const rowA = items.slice(0, half)
  const rowB = items.slice(half)

  return (
    <Section id="stack" className="border-t border-border-subtle overflow-hidden">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Technology
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Built with modern tools
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-muted">
          Our products are powered by battle-tested frameworks and
          infrastructure — chosen for speed, reliability, and developer experience.
        </p>
      </div>

      <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB.length ? rowB : rowA} reverse />
      </div>
    </Section>
  )
}

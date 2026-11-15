import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

// Ideia central do texto institucional do site atual da profissional.
const text =
  'Cada detalhe é projetado com intenção: o fluxo de atendimento, os acabamentos, os materiais, a luz. Função e estética a serviço da essência da marca.'
const words = text.split(' ')
const italicFrom = words.indexOf('Função')

function Word({ children, progress, range, italic }: { children: string; progress: MotionValue<number>; range: [number, number]; italic: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <m.span style={{ opacity }} className={italic ? 'italic text-sand' : undefined}>
      {children}{' '}
    </m.span>
  )
}

/** A frase se acende palavra a palavra, no ritmo da rolagem. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })

  return (
    <section aria-label="Manifesto" data-nav-dark className="bg-obsidian px-5 py-32 text-ivory md:px-10 md:py-52">
      <p
        ref={ref}
        className="mx-auto max-w-[1250px] font-serif text-[clamp(2rem,5vw,4.6rem)] leading-[1.12] tracking-[-0.01em]"
      >
        {reduce
          ? text
          : words.map((w, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / words.length, Math.min(1, (i + 3) / words.length)]}
                italic={i >= italicFrom}
              >
                {w}
              </Word>
            ))}
      </p>
    </section>
  )
}

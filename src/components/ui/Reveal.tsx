import { m, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { dur, ease, viewportOnce } from '../../animations/variants'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'p' | 'li' | 'span' | 'h2' | 'h3'
}

/** Fade + leve subida ao entrar na viewport. Conteúdo permanece visível com movimento reduzido. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = m[as] as ElementType
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: dur.base, ease, delay }}
    >
      {children}
    </Tag>
  )
}

interface LinesProps {
  lines: ReactNode[]
  className?: string
  delay?: number
  /** Dispara na montagem (hero) em vez de ao rolar */
  immediate?: boolean
  as?: 'h1' | 'h2' | 'p'
}

/** Revelação de títulos linha a linha, com máscara (overflow hidden). */
export function RevealLines({ lines, className, delay = 0, immediate, as = 'h2' }: LinesProps) {
  const reduce = useReducedMotion()
  const Tag = m[as] as ElementType
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <m.span
            className="block"
            initial={reduce ? false : { y: '105%' }}
            {...(immediate
              ? { animate: { y: 0 } }
              : { whileInView: { y: 0 }, viewport: viewportOnce })}
            transition={{ duration: dur.slow, ease, delay: delay + i * 0.12 }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

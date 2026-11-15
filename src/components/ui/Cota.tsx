import { m, useReducedMotion } from 'framer-motion'
import { ease, viewportOnce } from '../../animations/variants'

interface Props {
  label: string
  className?: string
}

const Tick = () => <span aria-hidden className="block h-3 w-px shrink-0 rotate-[35deg] bg-current" />

/**
 * Linha de cota — o traço de dimensão dos desenhos de arquitetura — usada como
 * rótulo de seção. As duas metades se desenham a partir do texto.
 */
export function Cota({ label, className = '' }: Props) {
  const reduce = useReducedMotion()
  const line = (origin: string) => (
    <m.span
      aria-hidden
      className={`h-px flex-1 bg-current opacity-45 ${origin}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.2, ease, delay: 0.15 }}
    />
  )
  return (
    <p className={`eyebrow flex items-center ${className}`}>
      <Tick />
      {line('origin-right')}
      <span className="px-4">{label}</span>
      {line('origin-left')}
      <Tick />
    </p>
  )
}

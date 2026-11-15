import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { ProjectImage } from '../../types'
import { Picture } from './Picture'
import { ease, viewportOnce } from '../../animations/variants'

interface Props {
  image: ProjectImage
  sizes: string
  className?: string
  /** intensidade do parallax em % (padrão sutil) */
  amount?: number
  imgClassName?: string
}

/** Imagem revelada por clip-path ao entrar na viewport, com parallax sutil interno. */
export function ParallaxImage({ image, sizes, className = '', amount = 8, imgClassName = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, reduce ? `-${amount}%` : `${amount}%`])

  return (
    <m.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={viewportOnce}
      transition={{ duration: 1.3, ease }}
    >
      <m.div style={{ y }} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Picture image={image} sizes={sizes} className={`h-full w-full object-cover ${imgClassName}`} />
      </m.div>
    </m.div>
  )
}

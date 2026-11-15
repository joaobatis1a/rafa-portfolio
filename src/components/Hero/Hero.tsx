import { useRef, useState } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { site, whatsappUrl } from '../../data/site'
import { projects } from '../../data/projects'
import { RevealLines } from '../ui/Reveal'
import { Picture } from '../ui/Picture'
import { Button } from '../ui/Button'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { ease, INTRO } from '../../animations/variants'

const cover = projects[0]

/**
 * Abertura em três tempos, como uma prancha de projeto:
 * 1. um quadro é desenhado a traço; 2. a imagem surge dentro dele;
 * 3. o quadro se expande até ocupar a tela e o texto entra.
 */

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Saída: a imagem volta a se recolher em um quadro enquanto a página avança
  const exitClip = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0% 0% 0% 0%)', reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 4% 12% 4%)'],
  )
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-14%'])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0])

  const box = mobile ? { top: '31%', right: '12%', bottom: '31%', left: '12%' } : { top: '25%', right: '32%', bottom: '25%', left: '32%' }
  const frame = `inset(${box.top} ${box.right} ${box.bottom} ${box.left})`
  const t = reduce ? { expand: 0, text: 0, done: 0 } : INTRO

  const fadeIn = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 20 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay: t.text + delay },
  })

  return (
    <section ref={ref} id="inicio" data-nav-dark className="relative h-[100svh] min-h-[620px] overflow-hidden bg-obsidian text-ivory">
      <m.div style={{ clipPath: exitClip }} className="absolute inset-0">
        <m.div
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: frame }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.5, ease, delay: t.expand }}
        >
          <m.div style={{ y: imgY }} className="absolute inset-x-0 -top-[6%] h-[112%]">
            <m.div
              className="h-full w-full"
              initial={reduce ? false : { opacity: 0, scale: 1.16 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ opacity: { duration: 0.7, delay: 0.45 }, scale: { duration: 3, ease } }}
            >
              <Picture image={cover.image} sizes="100vw" priority className="h-full w-full object-cover object-[40%_50%]" />
            </m.div>
          </m.div>
          {/* Contraste para leitura */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/25 to-obsidian/50" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-obsidian/65 via-obsidian/10 to-transparent" />
        </m.div>
      </m.div>

      {/* Quadro a traço + legenda da prancha (somente na abertura) */}
      {!reduce && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute"
          style={box}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: t.expand }}
        >
          <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <m.rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="none"
              stroke="#D6CABB"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </svg>
          <m.p
            className="eyebrow absolute inset-x-0 top-full mt-5 text-center text-sand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {site.name} — {site.role}
          </m.p>
        </m.div>
      )}

      <m.div
        style={{ y: textY, opacity: fade }}
        className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 pt-28 md:px-10 md:pb-16"
      >
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8 lg:col-span-7">
            <m.p {...fadeIn(0)} className="eyebrow mb-6 flex items-center gap-4 text-sand">
              <span aria-hidden className="h-px w-10 bg-sand" />
              {site.role}
            </m.p>

            <RevealLines
              as="h1"
              immediate
              delay={t.text + 0.1}
              className="display text-[clamp(2.9rem,min(8.4vw,13svh),8rem)]"
              lines={['Espaços que', 'traduzem marcas', <em key="e">em experiências.</em>]}
            />

            <m.div {...fadeIn(0.7)} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                href="#projetos"
                variant="light"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('projetos')
                }}
              >
                Explorar projetos
              </Button>
              <Button href={whatsappUrl()} target="_blank" rel="noopener noreferrer" variant="ghost-light">
                Vamos conversar
              </Button>
            </m.div>
          </div>

          <m.aside
            {...fadeIn(0.9)}
            className="hidden items-end justify-end md:col-span-4 md:flex lg:col-span-5"
          >
            {/* Indicador de rolagem em forma de cota vertical */}
            <div aria-hidden className="flex flex-col items-center gap-3">
              <span className="eyebrow [writing-mode:vertical-rl]">Role</span>
              <span className="relative block h-16 w-px overflow-hidden bg-ivory/25">
                <m.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-ivory"
                  animate={reduce ? undefined : { y: ['-100%', '200%'] }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
                />
              </span>
            </div>
          </m.aside>
        </div>
      </m.div>
    </section>
  )
}

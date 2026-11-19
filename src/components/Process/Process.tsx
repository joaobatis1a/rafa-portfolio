import { Suspense, lazy, useCallback, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { processSteps } from '../../data/services'
import { RevealLines } from '../ui/Reveal'
import { Cota } from '../ui/Cota'
import { PlanDrawing } from './PlanDrawing'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { ease } from '../../animations/variants'

const Maquete3D = lazy(() => import('./Maquete3D'))
const total = processSteps.length

function Heading() {
  return (
    <div>
      <Cota label="Processo" className="max-w-xs text-graphite" />
      <RevealLines
        className="display mt-6 text-[clamp(2.4rem,4vw,4rem)] md:mt-8"
        lines={['Do espaço vazio', <em key="e">ao projeto pronto.</em>]}
      />
    </div>
  )
}

/**
 * Um único formato para todos os tamanhos de tela: a ilustração fica fixa enquanto a rolagem
 * avança as etapas. No desktop a ilustração é a maquete 3D; no mobile, a prancha desenhada.
 * Sem WebGL, com movimento reduzido ou no celular, a prancha ocupa o mesmo lugar.
 */
export function Process() {
  const reduce = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  const { scrollTo } = useSmoothScroll()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total)))),
  )

  // Three.js só é baixado no desktop, quando a seção se aproxima
  const near = useInView(trackRef, { once: true, margin: '800px 0px 800px 0px' })
  const [failed, setFailed] = useState(false)
  const onFail = useCallback(() => setFailed(true), [])
  const use3D = desktop && near && !reduce && !failed

  const jump = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const range = el.offsetHeight - window.innerHeight
    scrollTo('processo-trilha', { offset: ((i + 0.5) / total) * range, hash: false })
  }

  const stage = active + 1
  const step = processSteps[active]
  const plan = (
    <div className="absolute inset-x-0 top-[26svh] bottom-[36svh] grid place-items-center px-5 md:inset-0 md:bottom-0 md:px-0 md:pb-16 md:pl-[34%] md:pr-10 md:pt-28">
      <PlanDrawing stage={stage} className="w-full md:max-h-[64svh]" />
    </div>
  )

  return (
    <section id="processo" className="relative bg-paper">
      <div ref={trackRef} id="processo-trilha" className="relative h-[320svh] md:h-[460svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {use3D ? (
            <Suspense fallback={plan}>
              <Maquete3D stage={stage} onFail={onFail} className="absolute inset-0" />
            </Suspense>
          ) : (
            plan
          )}

          {/* Título */}
          <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-24 md:px-10 md:pt-28">
            <div className="mx-auto max-w-[1600px]">
              <Heading />
            </div>
          </div>

          {/* Etapa atual + navegação */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
              <div aria-live="polite" className="min-h-[9.5rem] max-w-sm md:min-h-[13rem]">
                <AnimatePresence mode="wait">
                  <m.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <p className="font-serif text-5xl leading-none text-taupe lining-nums md:text-7xl">{step.number}</p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight md:mt-4 md:text-4xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite/85 md:mt-3">{step.description}</p>
                  </m.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-auto flex flex-col gap-4 md:items-end">
                {use3D && <p className="eyebrow text-graphite/60 md:text-right">Arraste para girar</p>}
                <div className="flex w-full gap-1.5 md:w-56">
                  {processSteps.map((s, i) => (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => jump(i)}
                      aria-label={`Etapa ${s.number}: ${s.title}`}
                      aria-current={i === active ? 'step' : undefined}
                      className="group relative h-8 flex-1"
                    >
                      <span
                        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-editorial ${
                          i <= active ? 'h-1 bg-obsidian' : 'h-px bg-obsidian/30 group-hover:h-1 group-hover:bg-obsidian/60'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

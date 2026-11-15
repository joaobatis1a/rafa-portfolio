import { Suspense, lazy, useCallback, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { processSteps } from '../../data/services'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Cota } from '../ui/Cota'
import { PlanDrawing } from './PlanDrawing'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { ease } from '../../animations/variants'

const Maquete3D = lazy(() => import('./Maquete3D'))
const total = processSteps.length

function Heading({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Cota label="Processo" className="max-w-xs text-graphite" />
      <RevealLines
        className="display mt-8 text-[clamp(2.4rem,4vw,4rem)]"
        lines={['Do espaço vazio', <em key="e">ao projeto pronto.</em>]}
      />
    </div>
  )
}

/**
 * Desktop: a maquete ocupa a tela e fica fixa enquanto a rolagem avança as etapas.
 * Sem WebGL ou com movimento reduzido, a prancha desenhada ocupa o mesmo lugar.
 */
function ProcessPinned() {
  const reduce = useReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total)))),
  )

  // Three.js só é baixado quando a seção se aproxima
  const near = useInView(trackRef, { once: true, margin: '800px 0px 800px 0px' })
  const [failed, setFailed] = useState(false)
  const onFail = useCallback(() => setFailed(true), [])
  const use3D = near && !reduce && !failed

  const jump = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const range = el.offsetHeight - window.innerHeight
    scrollTo('processo-trilha', { offset: ((i + 0.5) / total) * range, hash: false })
  }

  const stage = active + 1
  const step = processSteps[active]
  const plan = (
    <div className="absolute inset-0 grid place-items-center pb-16 pl-[34%] pr-10 pt-28">
      <PlanDrawing stage={stage} className="max-h-[64svh]" />
    </div>
  )

  return (
    <section id="processo" className="relative bg-paper">
      <div ref={trackRef} id="processo-trilha" className="relative h-[460svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {use3D ? (
            <Suspense fallback={plan}>
              <Maquete3D stage={stage} onFail={onFail} className="absolute inset-0" />
            </Suspense>
          ) : (
            plan
          )}

          {/* Título */}
          <div className="pointer-events-none absolute inset-x-0 top-0">
            <Heading className="mx-auto max-w-[1600px] px-10 pt-28" />
          </div>

          {/* Etapa atual + navegação */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-10 px-10 pb-12">
              <div aria-live="polite" className="min-h-[13rem] max-w-sm">
                <AnimatePresence mode="wait">
                  <m.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <p className="font-serif text-7xl leading-none text-taupe lining-nums">{step.number}</p>
                    <h3 className="mt-4 font-serif text-4xl leading-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-graphite/85">{step.description}</p>
                  </m.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-auto flex flex-col items-end gap-4">
                {use3D && <p className="eyebrow text-graphite/60">Arraste para girar</p>}
                <div className="flex w-56 gap-1.5">
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

/** No mobile cada etapa traz sua própria prancha, que se desenha ao entrar na tela. */
function InlinePlan({ stage }: { stage: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  return (
    <div ref={ref} className="mt-8">
      <PlanDrawing stage={seen ? stage : 0} />
    </div>
  )
}

function ProcessList() {
  return (
    <section id="processo" className="relative bg-paper px-5 py-28">
      <Heading className="mb-14" />
      <ol>
        {processSteps.map((s, i) => (
          <li key={s.number} className="border-t border-obsidian/15 py-10">
            <Reveal>
              <p className="font-serif text-6xl leading-none text-taupe lining-nums">{s.number}</p>
              <h3 className="mt-4 font-serif text-3xl leading-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite/85">{s.description}</p>
            </Reveal>
            <InlinePlan stage={i + 1} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Process() {
  const desktop = useMediaQuery('(min-width: 768px)')
  return desktop ? <ProcessPinned /> : <ProcessList />
}

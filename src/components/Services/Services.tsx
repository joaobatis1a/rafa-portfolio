import { useState } from 'react'
import { m } from 'framer-motion'
import { services } from '../../data/services'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Cota } from '../ui/Cota'
import { useFollower } from '../../hooks/useFollower'
import { ease } from '../../animations/variants'

const previews = [...new Set(services.map((s) => s.preview))]

/** Lista editorial: linhas, numeração e tipografia. Com mouse, um render acompanha o cursor. */
export function Services() {
  const [active, setActive] = useState<number | null>(null)
  const { x, y, onMouseMove } = useFollower()
  const current = active === null ? null : services[active].preview

  return (
    <section id="servicos" data-nav-dark className="relative bg-obsidian px-5 py-28 text-ivory md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Cota label="Serviços" className="text-sand" />
            <RevealLines
              className="display mt-10 text-[clamp(2.6rem,5vw,4.8rem)]"
              lines={['Do conceito', <em key="e">à obra.</em>]}
            />
            <Reveal delay={0.15} className="mt-8 max-w-xs text-sm leading-relaxed text-sand/80">
              <p>
                Projeto de ambientes comerciais com atenção ao uso, à marca e às exigências
                técnicas de cada local.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="md:col-span-8" onMouseMove={onMouseMove} onMouseLeave={() => setActive(null)}>
          {services.map((s, i) => (
            <Reveal as="li" key={s.number} delay={Math.min(i * 0.05, 0.2)} y={20}>
              <div
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`grid cursor-default grid-cols-[2.5rem_1fr] gap-x-4 border-t border-ivory/15 py-8 transition-opacity duration-500 md:grid-cols-[4rem_1.2fr_1fr] md:gap-x-8 md:py-10 ${
                  i === services.length - 1 ? 'border-b' : ''
                } ${active !== null && active !== i ? 'opacity-35' : ''}`}
              >
                <span className="eyebrow pt-2 text-taupe">{s.number}</span>
                <h3
                  className={`font-serif text-[1.9rem] leading-[1.05] transition-transform duration-700 ease-editorial md:text-[2.4rem] ${
                    active === i ? 'translate-x-2' : ''
                  }`}
                >
                  {s.title}
                </h3>
                <p className="col-start-2 mt-3 max-w-sm text-sm leading-relaxed text-sand/80 md:col-start-3 md:mt-1.5">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Prévia no toque: o render do serviço selecionado aparece abaixo da lista (em telas largas, o cursor faz esse papel) */}
        <div className="relative col-span-full mt-4 aspect-[4/5] overflow-hidden bg-graphite lg:hidden">
          {previews.map((name) => (
            <img
              key={name}
              src={`/img/${name}-640.avif`}
              alt=""
              loading="lazy"
              decoding="async"
              width={640}
              height={800}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-editorial ${
                current === name ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {active === null && (
            <p className="eyebrow absolute inset-x-0 bottom-5 text-center text-sand/80">Toque em um serviço para ver o render</p>
          )}
        </div>
      </div>

      {/* Prévia que acompanha o cursor (somente com mouse, em telas largas) */}
      <m.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:[@media(hover:hover)]:block"
      >
        <m.div
          className="relative ml-8 -mt-[21rem] aspect-[4/5] w-60 overflow-hidden bg-graphite"
          initial={false}
          animate={{
            clipPath: active === null ? 'inset(50% 0% 50% 0%)' : 'inset(0% 0% 0% 0%)',
            opacity: active === null ? 0 : 1,
          }}
          transition={{ duration: 0.6, ease }}
        >
          {previews.map((name) => (
            <img
              key={name}
              src={`/img/${name}-640.avif`}
              alt=""
              loading="lazy"
              decoding="async"
              width={640}
              height={800}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-editorial ${
                current === name ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
            />
          ))}
        </m.div>
      </m.div>
    </section>
  )
}

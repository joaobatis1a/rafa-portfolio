import { useCallback, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { projects } from '../../data/projects'
import type { Project } from '../../types'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Cota } from '../ui/Cota'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'
import { useFollower } from '../../hooks/useFollower'
import { ease } from '../../animations/variants'

// Composição assimétrica em 12 colunas: cada projeto tem posição, proporção e deslocamento próprios.
const layout: Record<string, { cls: string; aspect: string; sizes: string }> = {
  'danilas-semijoias': { cls: 'md:col-span-7', aspect: 'aspect-[4/3]', sizes: '(min-width:768px) 58vw, 100vw' },
  'loja-fitness': { cls: 'md:col-span-5 md:mt-56', aspect: 'aspect-[4/5]', sizes: '(min-width:768px) 42vw, 100vw' },
  'quiosque-acai': { cls: 'md:col-span-5 md:col-start-2', aspect: 'aspect-[4/5]', sizes: '(min-width:768px) 40vw, 100vw' },
  'escritorio-comercial': { cls: 'md:col-span-6 md:mt-40', aspect: 'aspect-[16/11]', sizes: '(min-width:768px) 50vw, 100vw' },
}

export function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [hovering, setHovering] = useState(false)
  const { x, y, onMouseMove } = useFollower()

  const close = useCallback(() => setOpenIndex(null), [])
  const navigate = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + projects.length) % projects.length)),
    [],
  )
  const open = useCallback((p: Project) => {
    setHovering(false)
    setOpenIndex(projects.indexOf(p))
  }, [])

  return (
    <section id="projetos" onMouseMove={onMouseMove} className="relative bg-sand/45 px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-20 grid gap-8 md:mb-32 md:grid-cols-12">
          <div className="md:col-span-3">
            <Cota label="Projetos" className="text-graphite md:mt-4" />
          </div>
          <div className="md:col-span-9">
            <RevealLines
              className="display text-[clamp(2.6rem,7vw,7rem)]"
              lines={['Espaços pensados', <em key="e">para marcas.</em>]}
            />
            <Reveal delay={0.15} className="mt-8 max-w-md text-graphite">
              <p className="leading-relaxed">
                Quatro projetos comerciais, apresentados em renders 3D. Abra um projeto para ver os
                detalhes.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="grid gap-x-10 gap-y-20 md:grid-cols-12 md:gap-y-24">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={open}
              onHover={setHovering}
              className={layout[p.id].cls}
              aspect={layout[p.id].aspect}
              sizes={layout[p.id].sizes}
            />
          ))}
        </div>
      </div>

      {/* Cursor próprio sobre as imagens (somente com mouse) */}
      <m.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(hover:hover)]:block"
      >
        <m.span
          className="eyebrow -ml-12 -mt-12 grid size-24 place-items-center bg-ivory text-obsidian"
          initial={false}
          animate={{ scale: hovering ? 1 : 0, opacity: hovering ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
        >
          Ver
        </m.span>
      </m.div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProjectModal key="modal" project={projects[openIndex]} onClose={close} onNavigate={navigate} />
        )}
      </AnimatePresence>
    </section>
  )
}

import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Project } from '../../types'
import { Picture } from '../ui/Picture'
import { ease, viewportOnce } from '../../animations/variants'

interface Props {
  project: Project
  className?: string
  aspect: string
  sizes: string
  onOpen: (p: Project) => void
  onHover: (hovering: boolean) => void
}

export function ProjectCard({ project, className = '', aspect, sizes, onOpen, onHover }: Props) {
  const reduce = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', reduce ? '-6%' : '6%'])

  return (
    <m.article
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 1, ease }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-haspopup="dialog"
        aria-label={`Abrir projeto ${project.title}`}
        className="group block w-full text-left"
      >
        <m.div
          ref={frameRef}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          className={`relative w-full overflow-hidden bg-sand [@media(hover:hover)]:cursor-none ${aspect}`}
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={viewportOnce}
          transition={{ duration: 1.3, ease }}
        >
          <m.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
            <Picture
              image={project.image}
              sizes={sizes}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
            />
          </m.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-obsidian/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          {/* Informações no hover (em toque, ficam no modal) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 text-ivory opacity-0 transition-all duration-700 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ul className="eyebrow flex flex-wrap gap-x-5 gap-y-2 text-sand">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          {/* Em telas de toque não há cursor: o "+" indica que o projeto abre */}
          <span className="absolute right-4 top-4 grid size-11 place-items-center bg-ivory text-obsidian [@media(hover:hover)]:hidden">
            <Plus size={18} aria-hidden />
          </span>
        </m.div>

        <div className="mt-5 flex items-baseline justify-between gap-6 border-b border-obsidian/15 pb-5">
          <div>
            <p className="eyebrow text-graphite/70">
              {project.number} — {project.category}
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-none md:text-4xl">
              <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-editorial group-hover:bg-[length:100%_1px]">
                {project.title}
              </span>
            </h3>
          </div>
          <span className="eyebrow hidden shrink-0 text-graphite/70 sm:block">Render 3D</span>
        </div>
      </button>
    </m.article>
  )
}

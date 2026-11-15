import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { Project } from '../../types'
import { Picture } from '../ui/Picture'
import { Button } from '../ui/Button'
import { whatsappUrl } from '../../data/site'
import { projects } from '../../data/projects'
import { ease } from '../../animations/variants'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

interface Props {
  project: Project
  onClose: () => void
  onNavigate: (dir: 1 | -1) => void
}

export function ProjectModal({ project, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { lock } = useSmoothScroll()

  // trava rolagem, foco inicial e retorno do foco ao fechar
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    lock(true)
    closeRef.current?.focus()
    return () => {
      lock(false)
      previous?.focus?.()
    }
  }, [lock])

  // Esc, setas e armadilha de foco
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNavigate(1)
      else if (e.key === 'ArrowLeft') onNavigate(-1)
      else if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate])

  const images = [project.image, ...(project.extra ?? [])]

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[60] flex items-stretch justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <m.div
        ref={panelRef}
        data-lenis-prevent
        className="relative my-0 w-full max-w-[1500px] overflow-y-auto bg-ivory md:my-6"
        initial={{ y: 60, clipPath: 'inset(8% 0 0 0)' }}
        animate={{ y: 0, clipPath: 'inset(0% 0 0 0)' }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.9, ease }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-ivory/90 px-5 py-3 backdrop-blur md:px-10">
          <p className="eyebrow text-taupe">
            {project.number} / 0{projects.length} — {project.category}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar projeto"
            className="grid size-12 place-items-center rounded-full transition-colors hover:bg-obsidian hover:text-ivory"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pb-12 md:px-10">
          <h3 id="modal-title" className="display text-[clamp(2.6rem,7vw,6.5rem)]">
            {project.title}
          </h3>

          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <div className="space-y-6 md:col-span-8">
              {images.map((img) => (
                <Picture
                  key={img.name}
                  image={img}
                  sizes="(min-width:768px) 62vw, 100vw"
                  className="h-auto w-full max-h-[80vh] object-cover"
                />
              ))}
              <p className="text-xs text-taupe">
                Render 3D — apresentação visual do projeto, não fotografia de obra executada.
              </p>
            </div>

            <div className="md:col-span-4">
              <p className="text-[1.02rem] leading-[1.8] text-graphite">{project.summary}</p>
              <ul className="mt-8 divide-y divide-obsidian/15 border-y border-obsidian/15">
                {project.highlights.map((h) => (
                  <li key={h} className="eyebrow py-4">
                    {h}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-10"
                href={whatsappUrl(`Olá, Rafaela! Vi o projeto "${project.title}" no seu portfólio e gostaria de conversar sobre um projeto parecido.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar sobre um projeto
              </Button>
            </div>
          </div>

          <div className="mt-14 flex justify-between border-t border-obsidian/15 pt-6">
            <button type="button" onClick={() => onNavigate(-1)} className="eyebrow flex min-h-12 items-center gap-3 hover:opacity-60">
              <ArrowLeft size={16} aria-hidden /> Anterior
            </button>
            <button type="button" onClick={() => onNavigate(1)} className="eyebrow flex min-h-12 items-center gap-3 hover:opacity-60">
              Próximo <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </m.div>
    </m.div>
  )
}

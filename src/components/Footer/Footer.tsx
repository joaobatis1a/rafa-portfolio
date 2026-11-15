import type { MouseEvent } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { site, mailtoUrl, whatsappUrl } from '../../data/site'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { ease, viewportOnce } from '../../animations/variants'

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const reduce = useReducedMotion()
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollTo(id)
  }
  return (
    <footer data-nav-dark className="overflow-hidden bg-obsidian px-5 pb-8 pt-20 text-ivory md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-sand">{site.role}</p>
            <p className="mt-5 max-w-xs font-serif text-2xl italic leading-snug text-ivory/85">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow mb-5 text-taupe">Navegação</p>
            <ul className="space-y-3">
              {site.nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={go(n.id)} className="text-sm text-sand transition-colors hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5 text-taupe">Contato</p>
            <ul className="space-y-3 text-sm text-sand">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ivory">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="break-words">
                <a href={mailtoUrl()} className="transition-colors hover:text-ivory">
                  {site.contact.email}
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ivory">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Assinatura: o nome ocupa a largura inteira da página */}
        <p aria-label={site.name} className="@container mt-20 overflow-hidden md:mt-28">
          <m.span
            aria-hidden
            className="block whitespace-nowrap text-center font-serif text-[16.2cqw] leading-[0.95] tracking-[-0.02em]"
            initial={reduce ? false : { y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1.4, ease }}
          >
            Rafaela <em>Ferreira</em>
          </m.span>
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/15 pt-6 text-xs text-taupe md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
          <p>Imagens dos projetos: renders 3D.</p>
          <a href="#inicio" onClick={go('inicio')} className="eyebrow group flex min-h-11 items-center gap-3 text-sand transition-colors hover:text-ivory">
            Voltar ao topo
            <ArrowUp size={14} aria-hidden className="transition-transform duration-500 ease-editorial group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  )
}

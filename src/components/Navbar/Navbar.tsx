import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../../data/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { ease, INTRO } from '../../animations/variants'

// "processo" não tem item no menu: enquanto está na tela, "Serviços" permanece ativo
const ids = [...site.nav.map((n) => n.id), 'processo']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [onDark, setOnDark] = useState(true)
  const reduce = useReducedMotion()
  const current = useActiveSection(ids)
  const active = current === 'processo' ? 'servicos' : current
  const { scrollTo, lock } = useSmoothScroll()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lock(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lock])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // espera o menu fechar e o scroll ser liberado antes de rolar
    setTimeout(() => scrollTo(id), open ? 350 : 0)
  }

  // O menu acompanha o fundo: observa quais seções escuras cruzam a faixa do cabeçalho
  useEffect(() => {
    const visible = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
        setOnDark(visible.size > 0)
      },
      { rootMargin: '-40px 0px -94% 0px' },
    )
    document.querySelectorAll('[data-nav-dark]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const light = open || !scrolled || onDark // texto claro

  return (
    <>
      <m.header
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: INTRO.done }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,backdrop-filter] duration-700 ease-editorial ${
          scrolled && !open ? `backdrop-blur-md ${onDark ? 'bg-obsidian/70' : 'bg-ivory/85'}` : ''
        } ${light ? 'text-ivory' : 'text-obsidian'}`}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10"
        >
          <a href="#inicio" onClick={go('inicio')} className="relative z-10 leading-none">
            <span className="block font-serif text-xl tracking-[0.18em] uppercase md:text-[1.35rem]">
              {site.name}
            </span>
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {site.nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={go(n.id)}
                  aria-current={active === n.id ? 'true' : undefined}
                  className="eyebrow group relative block py-2 opacity-80 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100"
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-editorial ${
                      active === n.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`eyebrow hidden min-h-11 items-center border px-5 transition-colors duration-500 lg:inline-flex ${
                light
                  ? 'border-ivory/60 hover:bg-ivory hover:text-obsidian'
                  : 'border-obsidian/50 hover:bg-obsidian hover:text-ivory'
              }`}
            >
              Solicitar projeto
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="relative z-10 grid size-12 place-items-center lg:hidden"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <m.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-current opacity-60"
        />
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-obsidian px-5 pt-28 pb-10 text-ivory lg:hidden"
          >
            <ul className="flex flex-col">
              {site.nav.map((n, i) => (
                <li key={n.id} className="overflow-hidden border-b border-ivory/10">
                  <m.a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.2 + i * 0.07 }}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="font-serif text-5xl leading-none">{n.label}</span>
                    <span className="eyebrow text-taupe">0{i + 1}</span>
                  </m.a>
                </li>
              ))}
            </ul>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-5"
            >
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow flex min-h-14 items-center justify-center bg-ivory text-obsidian"
              >
                Solicitar um projeto
              </a>
              <p className="text-sm text-sand/80">{site.contact.email}</p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}

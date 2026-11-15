import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

interface ScrollApi {
  scrollTo: (id: string, opts?: { offset?: number; hash?: boolean }) => void
  lock: (locked: boolean) => void
}

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {}, lock: () => {} })

/**
 * Lenis cuida somente do scroll suave. Framer Motion (useScroll/whileInView)
 * lê o scroll nativo da janela, então os dois convivem sem conflito. GSAP não é usado.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (id, { offset = 0, hash = true } = {}) => {
        const el = document.getElementById(id)
        if (!el) return
        if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.4, offset })
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' })
        if (hash) history.replaceState(null, '', `#${id}`)
      },
      lock: (locked) => {
        if (lenisRef.current) locked ? lenisRef.current.stop() : lenisRef.current.start()
        document.documentElement.style.overflow = locked ? 'hidden' : ''
      },
    }),
    [],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}

export const useSmoothScroll = () => useContext(ScrollContext)

import { LazyMotion, domAnimation } from 'framer-motion'
import { SmoothScrollProvider } from './hooks/useSmoothScroll'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { About } from './components/About/About'
import { Manifesto } from './components/Manifesto/Manifesto'
import { Projects } from './components/Projects/Projects'
import { Services } from './components/Services/Services'
import { Process } from './components/Process/Process'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'

export default function App() {
  return (
    // LazyMotion + componentes `m`: carrega só os recursos de animação usados (sem drag/layout)
    <LazyMotion features={domAnimation} strict>
    <SmoothScrollProvider>
      <a
        href="#sobre"
        className="eyebrow sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-3 focus:text-obsidian"
      >
        Ir para o conteúdo
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Manifesto />
        <Projects />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </SmoothScrollProvider>
    </LazyMotion>
  )
}

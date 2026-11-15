import { projects } from '../../data/projects'
import { Reveal, RevealLines } from '../ui/Reveal'
import { ParallaxImage } from '../ui/ParallaxImage'
import { Cota } from '../ui/Cota'

// Textos derivados do site atual. Sem formação, anos de experiência ou clientes inventados.
const pillars = [
  { title: 'Visão técnica e normativa', text: 'Projetos atentos às normas, às compatibilizações técnicas e à viabilidade de obra.' },
  { title: 'Experiência em shoppings', text: 'Ambientes comerciais complexos, com prazos e normas rigorosas.' },
  { title: 'Aproveitamento estratégico', text: 'Análise do espaço para ampliar a área útil de exposição e de atendimento.' },
  { title: 'Arquitetura da experiência', text: 'Ambientes que traduzem a identidade da marca e acolhem o cliente.' },
]

export function About() {
  return (
    <section id="sobre" className="relative bg-ivory px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-5">
          <Cota label="Sobre" className="text-graphite" />
          <ParallaxImage
            image={projects[0].extra![0]}
            sizes="(min-width:768px) 40vw, 100vw"
            className="mt-8 aspect-[4/5] w-full"
            imgClassName="object-[30%_50%]"
          />
          <Reveal className="mt-4">
            <p className="text-xs text-graphite/70">Render · Danila's Semijoias</p>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-28">
          <RevealLines
            className="display text-[clamp(2.4rem,5.2vw,5rem)]"
            lines={['Arquitetura é', <em key="e">posicionamento</em>, 'de marca.']}
          />

          <Reveal delay={0.1} className="mt-12 max-w-xl space-y-6 text-[1.02rem] leading-[1.8] text-graphite">
            <p>
              Sou Rafaela Ferreira, arquiteta com foco em arquitetura comercial. Crio espaços sob
              medida para marcas que querem se destacar no mercado.
            </p>
            <p>
              Para mim, um espaço comercial precisa funcionar bem na operação do dia a dia e, ao
              mesmo tempo, expressar quem a marca é para o cliente que entra.
            </p>
          </Reveal>

          <ul className="mt-16 grid gap-x-10 gap-y-9 border-t border-obsidian/15 pt-10 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08}>
                <h3 className="font-serif text-2xl leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/80">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

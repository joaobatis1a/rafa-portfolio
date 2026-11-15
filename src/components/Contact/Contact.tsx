import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { mailtoUrl, site, whatsappUrl } from '../../data/site'
import { Reveal, RevealLines } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { Cota } from '../ui/Cota'

export function Contact() {
  const { email, phoneDisplay, location } = site.contact
  return (
    <section id="contato" data-nav-dark className="relative overflow-hidden bg-graphite px-5 py-28 text-ivory md:px-10 md:py-44">
      <div className="relative mx-auto max-w-[1600px]">
        <Cota label="Contato" className="max-w-sm text-sand" />

        <RevealLines
          className="display mt-10 max-w-6xl text-[clamp(2.9rem,8vw,8.5rem)]"
          lines={['Seu próximo espaço', <em key="e">começa com uma</em>, 'boa ideia.']}
        />

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="max-w-md leading-relaxed text-sand/90">
              Conte sobre o seu negócio e o espaço que você tem em mente. A conversa inicial é o
              primeiro passo para entender o que o projeto precisa resolver.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={whatsappUrl()} target="_blank" rel="noopener noreferrer" variant="light">
                Chamar no WhatsApp
              </Button>
              <Button href={mailtoUrl()} variant="ghost-light">
                Enviar e-mail
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8">
            <dl className="divide-y divide-ivory/15 border-y border-ivory/15">
              <div className="flex items-center gap-5 py-6">
                <MessageCircle aria-hidden size={20} className="text-sand/70" />
                <div>
                  <dt className="eyebrow text-sand/70">WhatsApp</dt>
                  <dd className="mt-2 font-serif text-2xl">
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-sand">
                      {phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-5 py-6">
                <Mail aria-hidden size={20} className="text-sand/70" />
                <div className="min-w-0">
                  <dt className="eyebrow text-sand/70">E-mail</dt>
                  <dd className="mt-2 break-words font-serif text-xl sm:text-2xl">
                    <a href={mailtoUrl()} className="transition-colors hover:text-sand">
                      {email}
                    </a>
                  </dd>
                </div>
              </div>
              {/* Só aparece depois que a localização for confirmada (site.ts → pending: false) */}
              {!location.pending && (
                <div className="flex items-center gap-5 py-6">
                  <MapPin aria-hidden size={20} className="text-sand/70" />
                  <div>
                    <dt className="eyebrow text-sand/70">Localização</dt>
                    <dd className="mt-2 font-serif text-2xl">{location.label}</dd>
                  </div>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

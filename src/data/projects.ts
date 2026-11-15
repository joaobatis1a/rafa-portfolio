import type { Project } from '../types'

const w = [640, 1280, 1920]

/**
 * Imagens: renders 3D (Enscape) publicados no site atual da profissional.
 * São apresentações de projeto, não fotografias de obras executadas.
 */
export const projects: Project[] = [
  {
    id: 'danilas-semijoias',
    number: '01',
    title: "Danila's Semijoias",
    category: 'Varejo · Semijoias',
    summary:
      'Reforma e reorganização do espaço, com novo layout, pontos de exposição e iluminação estratégica.',
    highlights: ['Novo layout', 'Pontos de exposição', 'Iluminação estratégica'],
    image: { name: 'danilas-fachada', widths: w, width: 1920, height: 1080, alt: "Render da fachada e do interior da loja Danila's Semijoias" },
    extra: [
      { name: 'danilas-vitrine', widths: w, width: 1920, height: 1080, alt: "Render do balcão e das estantes iluminadas da Danila's Semijoias" },
    ],
    layout: 'wide',
    kind: 'render',
  },
  {
    id: 'loja-fitness',
    number: '02',
    title: 'Loja de Moda Fitness',
    category: 'Varejo · Moda',
    summary:
      'Design e posicionamento premium, com provadores amplos, iluminação cênica e expositores.',
    highlights: ['Provadores amplos', 'Iluminação cênica', 'Expositores'],
    image: { name: 'fitness', widths: w, width: 1920, height: 1080, alt: 'Render do interior de uma loja de moda fitness com iluminação em neon' },
    layout: 'wide',
    kind: 'render',
  },
  {
    id: 'quiosque-acai',
    number: '03',
    title: 'Quiosque de Açaí',
    category: 'Alimentação · Quiosque',
    summary:
      'Reforma e adaptação à nova identidade da marca, com fluxo dinâmico, iluminação focal e novo visual expositivo.',
    highlights: ['Nova identidade', 'Fluxo dinâmico', 'Iluminação focal'],
    image: { name: 'acai', widths: [640, 1280], width: 1280, height: 1600, alt: 'Render de um quiosque de açaí em um corredor de shopping' },
    layout: 'tall',
    kind: 'render',
  },
  {
    id: 'escritorio-comercial',
    number: '04',
    title: 'Escritório Comercial',
    category: 'Corporativo · Escritório',
    summary:
      'Arquitetura corporativa com caráter industrial, materiais aparentes e elementos industriais.',
    highlights: ['Caráter industrial', 'Materiais aparentes', 'Arquitetura corporativa'],
    image: { name: 'escritorio', widths: w, width: 1920, height: 1080, alt: 'Render de sala de reuniões com parede em mármore e mesa de madeira' },
    layout: 'wide',
    kind: 'render',
  },
]

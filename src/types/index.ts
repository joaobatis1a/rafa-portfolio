export interface ProjectImage {
  /** nome-base em /public/img (ex.: "fitness" → fitness-640/1280/1920.webp) */
  name: string
  widths: number[]
  width: number
  height: number
  alt: string
}

export interface Project {
  id: string
  number: string
  title: string
  category: string
  summary: string
  highlights: string[]
  image: ProjectImage
  layout: 'wide' | 'tall'
  /** Todos os projetos atuais são renders 3D (Enscape), não fotos de obra. */
  kind: 'render' | 'obra'
  extra?: ProjectImage[]
}

export interface Service {
  number: string
  title: string
  description: string
  /** nome-base de um render em /public/img */
  preview: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  /** o que esta etapa acrescenta à prancha ilustrativa */
  layer: string
  optional?: boolean
}

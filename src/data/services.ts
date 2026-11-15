import type { Service, ProcessStep } from '../types'

// Fonte: site atual + lista do briefing. Redação própria, sem promessas de escopo ou prazo.
// `preview`: render (em /public/img) exibido junto ao cursor ao passar pelo serviço.
export const services: Service[] = [
  { number: '01', title: 'Planejamento de espaços comerciais', description: 'Análise do espaço para ampliar a área útil de exposição e de atendimento.', preview: 'danilas-fachada' },
  { number: '02', title: 'Layout e fluxo de atendimento', description: 'Organização do percurso do cliente e da operação, com cada detalhe projetado com intenção.', preview: 'danilas-vitrine' },
  { number: '03', title: 'Iluminação estratégica', description: 'A luz como ferramenta para destacar produtos, criar atmosfera e reforçar a identidade da marca.', preview: 'fitness' },
  { number: '04', title: 'Escolha de materiais', description: 'Materiais e acabamentos coerentes com a marca, o uso e a viabilidade da obra.', preview: 'escritorio' },
  { number: '05', title: 'Arquitetura corporativa', description: 'Escritórios e ambientes de trabalho que unem funcionalidade e identidade.', preview: 'escritorio' },
  { number: '06', title: 'Shopping centers', description: 'Lojas e quiosques em ambientes complexos, com prazos e normas rigorosas.', preview: 'acai' },
  { number: '07', title: 'Compatibilização técnica e normativa', description: 'Projeto atento às normas e às compatibilizações técnicas necessárias à obra.', preview: 'danilas-fachada' },
]

// ETAPAS SUGERIDAS: a confirmar com a profissional antes da publicação.
export const processSteps: ProcessStep[] = [
  { number: '01', title: 'Diagnóstico', description: 'Entendimento da marca, da operação e da necessidade do espaço.', layer: 'Envoltória, aberturas e cotas.' },
  { number: '02', title: 'Conceito e planejamento', description: 'Definição da ideia central, do programa e do layout.', layer: 'Zonas funcionais e percurso do cliente.' },
  { number: '03', title: 'Desenvolvimento', description: 'Projeto com materiais, iluminação e apresentação visual do ambiente.', layer: 'Mobiliário e pontos de luz.' },
  { number: '04', title: 'Detalhamento e compatibilização', description: 'Documentação técnica e verificação normativa para a obra.', layer: 'Hachuras, corte e chamadas de detalhe.' },
  { number: '05', title: 'Acompanhamento e entrega', description: 'Suporte durante a execução, conforme o escopo contratado.', layer: 'Acabamentos aplicados e prancha final.', optional: true },
]

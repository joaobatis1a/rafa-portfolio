/**
 * Fonte única de verdade para identidade e contatos.
 * Itens com `pending: true` precisam de confirmação antes de publicar.
 */
export const site = {
  name: 'Rafaela Ferreira',
  role: 'Arquitetura Comercial',
  tagline: 'Espaços que traduzem marcas em experiências.',

  contact: {
    // Fonte: bloco de contato do site atual. Confirmar que o número é WhatsApp.
    phoneDisplay: '(81) 99546-4203',
    whatsappNumber: '5581995464203',
    email: 'rafaelaferreiraarquitetura@gmail.com',
    // O site atual mostra "Paulista – PE" no contato e "Rio de Janeiro" no rodapé.
    // Publicamos só a cidade, sinalizada como pendente, e nenhum endereço de rua.
    location: { label: 'Paulista, PE', pending: true },
    whatsappMessage:
      'Olá, Rafaela! Vi o seu portfólio e gostaria de conversar sobre um projeto de arquitetura comercial.',
  },

  // Nenhuma rede social verificada no site atual.
  social: [] as { label: string; href: string }[],

  nav: [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'contato', label: 'Contato' },
  ],
}

export const whatsappUrl = (message: string = site.contact.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`

export const mailtoUrl = (subject = 'Solicitação de projeto') =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`

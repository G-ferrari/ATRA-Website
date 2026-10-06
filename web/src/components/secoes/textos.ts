/* Textos de interface das páginas-mestras (feature paginas-mestras, D-55).
 *
 * O que o time de conteúdo escreve — selo, etiqueta, título, destaque, texto de
 * abertura, botão dos destaques, SEO — está na página-mestra, no admin. Aqui
 * fica só o cromo: rótulos repetidos em todo cartão ("Assistir", "páginas de
 * conteúdo exclusivo"), estados vazios e os textos padrão para quando o campo
 * do bloco fica em branco. */
export const TEXTOS_DAS_SECOES = {
  pt: {
    vazio: {
      solucoes: 'Nenhuma solução publicada.',
      segmentos: 'Nenhum segmento publicado.',
      midia: 'As matérias aparecem aqui assim que forem publicadas.',
    },
    acaoPadrao: {
      webinars: 'Garantir minha vaga',
      cases: 'Continuar lendo',
      blog: 'Ler artigo completo',
      midia: 'Leia a matéria',
      ebooks: 'Baixar E-book agora',
    },
    webinars: { eyebrow: 'Próximo Evento', acaoSecundaria: 'Ver detalhes' },
    midia: { ler: 'Leia a matéria', assistir: 'Assistir', novaAba: 'abre em outra aba' },
    ebooks: { selo: 'E-book', paginas: 'páginas de conteúdo exclusivo', cta: 'Baixar agora', rotuloDaCapa: 'E-book' },
    blog: { paginaDe: (n: number, total: number) => `Página ${n} de ${total}` },
    consultores: { metricas: ['No Time', 'Projetos Ativos', 'Satisfação'] },
  },
  en: {
    vazio: {
      solucoes: 'No published solutions.',
      segmentos: 'No published segments.',
      midia: 'Articles show up here as soon as they are published.',
    },
    acaoPadrao: {
      webinars: 'Save my seat',
      cases: 'Keep reading',
      blog: 'Read the full post',
      midia: 'Read the article',
      ebooks: 'Download the ebook',
    },
    webinars: { eyebrow: 'Next event', acaoSecundaria: 'See details' },
    midia: { ler: 'Read the article', assistir: 'Watch', novaAba: 'opens in a new tab' },
    ebooks: { selo: 'Ebook', paginas: 'pages of exclusive content', cta: 'Download now', rotuloDaCapa: 'E-book' },
    blog: { paginaDe: (n: number, total: number) => `Page ${n} of ${total}` },
    consultores: { metricas: ['On the team', 'Active projects', 'Satisfaction'] },
  },
} as const

/* O conteúdo do dia 1 das páginas-mestras (feature paginas-mestras, D-55) — os
 * textos que estavam nas constantes `TEXTOS`/`META` de cada rota em 05/10,
 * **literais** (D-22): o visual não muda no dia em que a página vira CMS.
 *
 * Separado da migração `20261005_230000_paginas_mestras_conteudo` para ter
 * teste e para o seed chegar ao mesmo resultado em banco novo.
 *
 * Carreiras e Insights não estão aqui: já eram páginas do CMS, e a migração só
 * as marca como páginas-mestras, sem tocar no conteúdo. */
import { FIM_EN, FIM_PT } from './fim-das-paginas'

type Secao = 'solucoes' | 'segmentos' | 'consultores' | 'blog' | 'webinars' | 'cases' | 'midia' | 'ebooks'
type Bloco = { blockType: string; id?: string | null; [campo: string]: unknown }
type PorIdioma<T> = { pt: T; en: T }

export type PaginaMestraInicial = {
  secao: Secao
  title: PorIdioma<string>
  slug: PorIdioma<string>
  seo: PorIdioma<{ metaTitle: string; metaDescription: string }>
  /** O layout em português, completo. */
  layout: Bloco[]
  /** Só os campos localizados de cada bloco, na mesma ordem. */
  layoutEn: Record<string, unknown>[]
}

const lista = (campos: Record<string, unknown> = {}) => ({ blockType: 'sectionListing', ...campos })
const destaques = (actionLabel: string) => ({ blockType: 'sectionFeatured', actionLabel })

export const PAGINAS_MESTRAS_INICIAIS: PaginaMestraInicial[] = [
  {
    secao: 'solucoes',
    title: { pt: 'Soluções', en: 'Solutions' },
    slug: { pt: 'solucoes', en: 'solutions' },
    seo: {
      pt: {
        metaTitle: 'Soluções',
        metaDescription:
          'IA e analytics avançada, dados e cloud, governança e FinOps, serviços especializados: a oferta da ATRA ponta a ponta.',
      },
      en: {
        metaTitle: 'Solutions',
        metaDescription:
          'AI and advanced analytics, data and cloud, governance and FinOps, specialized services: ATRA offerings end to end.',
      },
    },
    /* A etiqueta era "4 frentes"; o número agora é a contagem das abas. */
    layout: [lista({ eyebrow: 'Da estratégia à operação', chip: 'frentes', title: 'Soluções que ligam', highlight: 'dado a decisão' })],
    layoutEn: [{ eyebrow: 'From strategy to operations', chip: 'fronts', title: 'Solutions that turn', highlight: 'data into decisions' }],
  },
  {
    secao: 'segmentos',
    title: { pt: 'Segmentos', en: 'Segments' },
    slug: { pt: 'segmentos', en: 'segments' },
    seo: {
      pt: {
        metaTitle: 'Segmentos',
        metaDescription: 'As verticais de mercado que a ATRA atende, de serviços financeiros a saúde e varejo.',
      },
      en: {
        metaTitle: 'Segments',
        metaDescription: 'The market verticals ATRA serves, from financial services to healthcare and retail.',
      },
    },
    layout: [lista({ eyebrow: 'Para quem a gente resolve', chip: 'verticais', title: 'Dado é o mesmo.', highlight: 'O negócio, não.' })],
    layoutEn: [{ eyebrow: 'Who we solve it for', chip: 'verticals', title: 'The data is the same.', highlight: 'The business is not.' }],
  },
  {
    secao: 'consultores',
    title: { pt: 'Consultores', en: 'Consultants' },
    slug: { pt: 'consultores', en: 'consultants' },
    seo: {
      pt: { metaTitle: 'Consultores', metaDescription: 'Especialistas em dados, cloud e IA prontos para alocação rápida.' },
      en: { metaTitle: 'Consultants', metaDescription: 'Data, cloud and AI specialists ready for fast allocation.' },
    },
    /* ⚠️ O ponto final era escrito depois do destaque, fora dele. Agora é parte
     * do destaque — o único lugar em que a editora consegue escrevê-lo — e sai
     * em azul. Única diferença visual do dia 1. */
    layout: [
      lista({
        eyebrow: 'Especialistas em Dados, Cloud & IA',
        chip: 'Alocação Rápida',
        title: 'Acelere seus projetos de Dados e IA com',
        highlight: 'consultores de elite.',
        description:
          'Engenheiros de dados, cientistas, arquitetos cloud, analytics engineers e especialistas em governança prontos para integrar sua equipe.',
      }),
    ],
    layoutEn: [
      {
        eyebrow: 'Data, Cloud & AI specialists',
        chip: 'Fast allocation',
        title: 'Accelerate your data and AI projects with',
        highlight: 'elite consultants.',
        description:
          'Data engineers, scientists, cloud architects, analytics engineers and governance specialists ready to join your team.',
      },
    ],
  },
  {
    secao: 'blog',
    title: { pt: 'Blog', en: 'Blog' },
    slug: { pt: 'blog', en: 'blog' },
    seo: {
      pt: { metaTitle: 'Blog', metaDescription: 'Artigos técnicos sobre dados, IA, cloud e governança aplicados a negócios.' },
      en: { metaTitle: 'Blog', metaDescription: 'Technical articles on data, AI, cloud and governance applied to business.' },
    },
    layout: [
      destaques('Ler artigo completo'),
      lista({ eyebrow: 'Conhecimento & Inovação', chip: 'Artigos Técnicos', title: 'Todos os', highlight: 'artigos' }),
      {
        blockType: 'webinarTeaser',
        eyebrow: 'Destaque Multimídia',
        title: 'Assista aos nossos Webinars técnicos',
        highlight: 'Webinars',
        description:
          'Aprenda com nossos especialistas as melhores práticas, tendências e casos reais de uso de dados, nuvem e Inteligência Artificial no ecossistema corporativo.',
        actionLabel: 'Começar a assistir',
      },
    ],
    layoutEn: [
      { actionLabel: 'Read the full post' },
      { eyebrow: 'Knowledge & Innovation', chip: 'Technical articles', title: 'All', highlight: 'posts' },
      {
        eyebrow: 'Multimedia highlight',
        title: 'Watch our technical Webinars',
        highlight: 'Webinars',
        description: 'Learn best practices, trends and real use cases of data, cloud and AI in the enterprise, from our specialists.',
        actionLabel: 'Start watching',
      },
    ],
  },
  {
    secao: 'webinars',
    title: { pt: 'Webinars', en: 'Webinars' },
    slug: { pt: 'webinars', en: 'webinars' },
    seo: {
      pt: { metaTitle: 'Webinars', metaDescription: 'Eventos online sobre dados, IA e cloud com especialistas do mercado.' },
      en: { metaTitle: 'Webinars', metaDescription: 'Online events on data, AI and cloud with market specialists.' },
    },
    layout: [destaques('Garantir minha vaga'), lista({ title: 'Webinars', highlight: 'Gravados' })],
    layoutEn: [{ actionLabel: 'Save my seat' }, { title: 'Recorded', highlight: 'webinars' }],
  },
  {
    secao: 'cases',
    title: { pt: 'Cases de sucesso', en: 'Success stories' },
    slug: { pt: 'cases-de-sucesso', en: 'success-stories' },
    seo: {
      pt: {
        metaTitle: 'Cases de Sucesso',
        metaDescription: 'Histórias reais de transformação com dados, IA e cloud nos maiores bancos e empresas do Brasil.',
      },
      en: {
        metaTitle: 'Success Stories',
        metaDescription: 'Real transformation stories with data, AI and cloud at Brazil’s largest banks and enterprises.',
      },
    },
    layout: [
      destaques('Continuar lendo'),
      lista({ eyebrow: 'Histórias Reais de Sucesso', chip: 'Grandes Instituições', title: 'Todos os', highlight: 'cases de sucesso' }),
    ],
    layoutEn: [
      { actionLabel: 'Keep reading' },
      { eyebrow: 'Real Success Stories', chip: 'Major Institutions', title: 'All', highlight: 'success stories' },
    ],
  },
  {
    secao: 'midia',
    title: { pt: 'ATRA na mídia', en: 'ATRA in the media' },
    slug: { pt: 'atra-na-midia', en: 'atra-in-the-media' },
    seo: {
      pt: {
        metaTitle: 'ATRA na mídia',
        metaDescription:
          'Matérias, entrevistas e vídeos em que a ATRA e seus especialistas falam de dados, IA, cloud e transformação digital.',
      },
      en: {
        metaTitle: 'ATRA in the media',
        metaDescription:
          'Articles, interviews and videos in which ATRA and its specialists talk about data, AI, cloud and digital transformation.',
      },
    },
    /* A faixa do fim era a `ChamadaFinal` em código (D-42); aqui é o mesmo
     * conteúdo como bloco, que a editora pode trocar. */
    layout: [
      destaques('Leia a matéria'),
      lista({
        title: 'Conhecimento que gera impacto.',
        highlight: 'Voz que influencia o mercado.',
        description:
          'Nossa experiência em dados, IA, cloud e transformação digital está presente nas mídias.\n\nExplore os conteúdos que apresentam a visão da ATRA e de nossos especialistas sobre os desafios e oportunidades que estão moldando o futuro dos negócios.',
      }),
      { ...FIM_PT, cta: { ...FIM_PT.cta }, secondaryCta: { ...FIM_PT.secondaryCta } },
    ],
    layoutEn: [
      { actionLabel: 'Read the article' },
      {
        title: 'Knowledge that makes an impact.',
        highlight: 'A voice that shapes the market.',
        description:
          'Our experience in data, AI, cloud and digital transformation is in the media.\n\nExplore the content that presents the view of ATRA and our specialists on the challenges and opportunities shaping the future of business.',
      },
      { title: FIM_EN.title, description: FIM_EN.description, cta: { label: FIM_EN.cta.label }, secondaryCta: { label: FIM_EN.secondaryCta.label } },
    ],
  },
  {
    secao: 'ebooks',
    title: { pt: 'E-books', en: 'Ebooks' },
    slug: { pt: 'ebooks', en: 'ebooks' },
    seo: {
      pt: { metaTitle: 'E-books', metaDescription: 'Guias práticos sobre arquitetura de dados, governança e cloud.' },
      en: { metaTitle: 'Ebooks', metaDescription: 'Practical guides on data architecture, governance and cloud.' },
    },
    /* A grade nunca teve cabeçalho: a lista entra vazia de texto. */
    layout: [destaques('Baixar E-book agora'), lista()],
    layoutEn: [{ actionLabel: 'Download the ebook' }, {}],
  },
]

/**
 * O layout em inglês a partir do português **já gravado**: cada bloco com o id
 * que o Payload deu a ele e os campos localizados do inglês por cima. Sem o id,
 * o Payload trata o bloco como novo e o português fica órfão (ver `casarIds`).
 * Grupo (`cta`) mescla campo a campo: o destino não é localizado e não pode
 * sumir.
 */
export function layoutEmIngles(gravado: Bloco[], ingles: Record<string, unknown>[]): Bloco[] {
  return gravado.map((bloco, i) => {
    const en = ingles[i] ?? {}
    const saida: Bloco = { ...bloco }
    for (const [campo, valor] of Object.entries(en)) {
      const atual = bloco[campo]
      saida[campo] =
        valor && typeof valor === 'object' && atual && typeof atual === 'object' ? { ...atual, ...valor } : valor
    }
    return saida
  })
}

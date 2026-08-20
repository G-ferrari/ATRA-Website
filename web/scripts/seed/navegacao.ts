/* Seed do global `navigation` — as 7 categorias do topo (MIG-072a).
 *
 * De `legacy/src/App.tsx:365` (a fileira), `:458-880` (os painéis) e das chaves
 * `nav.*` e `megaMenu.*` de `legacy/src/locales/{pt,en}.json`.
 *
 * Soluções e Parceiros **não têm conteúdo aqui**: os painéis leem as
 * collections. Só o rótulo e o formato ficam no global.
 *
 * ⚠️ Soluções e Parceiros ficam sem `href` porque no legado apontam para `#`
 * (`App.tsx:379` e `:382`) — a categoria abre o painel e não navega. Soluções
 * hoje **tem** índice (`/solucoes`, D-09), mas ligar o rótulo é decisão de
 * navegação, não de porte: mudaria o comportamento do cabeçalho em todas as
 * páginas. Fica registrado em debito-tecnico.md.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

type Categoria = Record<string, unknown>

const links = (itens: [string, string, string, string][]) =>
  itens.map(([icon, label, description, href]) => ({ icon, label, description, href }))

const bullets = (itens: string[]) => itens.map((text) => ({ text }))

const PT: Categoria[] = [
  { label: 'Soluções', panel: 'solutions' },
  {
    label: 'Consultores',
    href: '/consultores',
    panel: 'split',
    intro:
      'Conecte sua empresa a especialistas em IA, Engenharia de Dados e BI com atuação de ponta a ponta na jornada analítica.',
    highlights: [
      {
        icon: 'user-check',
        color: 'emerald',
        title: 'Squads de IA & Dados',
        description: 'Equipes integradas e autogerenciáveis focadas na aceleração das entregas de valor.',
      },
      {
        icon: 'building',
        color: 'purple',
        title: 'Consultoria Estratégica',
        description: 'Mapeamento de maturidade analítica e roadmap de tecnologia personalizado.',
      },
    ],
    card: {
      icon: 'users',
      title: 'Consultores Especializados',
      bullets: bullets([
        'Alocação Ágil & Sob Demanda',
        'Especialistas Certificados',
        'Foco em Resultados de Negócio',
        'Suporte e Mentoria Técnica',
      ]),
      ctaLabel: 'Encontrar Consultores',
      href: '/consultores',
    },
  },
  {
    label: 'Insights',
    href: '/insights',
    panel: 'links',
    links: links([
      ['star', 'Cases de Sucesso', 'Histórias reais de transformação digital.', '/cases-de-sucesso'],
      ['file-text', 'Relatórios', 'Análises profundas do mercado de dados.', '/relatorios'],
      ['newspaper', 'Blog', 'Artigos, tendências e novidades técnicas.', '/blog'],
      ['video', 'Webinars', 'Conteúdo em vídeo com nossos especialistas.', '/webinars'],
      ['book', 'Ebooks', 'Guias completos para sua jornada de dados.', '/ebooks'],
    ]),
  },
  { label: 'Parceiros', panel: 'partners' },
  {
    label: 'Carreiras',
    href: '/carreiras',
    panel: 'split',
    intro:
      'Faça parte de um time apaixonado por inovação, dados e IA. Na ATRA, acreditamos na colaboração, diversidade e excelência técnica para construir o futuro da tecnologia.',
    highlights: [
      {
        icon: 'graduation-cap',
        color: 'indigo',
        title: 'Capacitação Contínua',
        description: 'Suporte para certificações (AWS, GCP, Azure, Databricks) e treinamentos internos.',
      },
      {
        icon: 'heart',
        color: 'pink',
        title: 'Bem-estar e Saúde',
        description: 'Benefícios flexíveis, foco em saúde mental e excelente equilíbrio vida-trabalho.',
      },
    ],
    card: {
      icon: 'briefcase',
      title: 'Trabalhe Conosco',
      bullets: bullets([
        'Trabalho 100% Remoto',
        'Cultura Horizontal',
        'Plano de Carreira',
        'Projetos Desafiadores',
      ]),
      ctaLabel: 'Ver Vagas Disponíveis',
      href: '/carreiras',
    },
  },
  {
    label: 'Sobre',
    href: '/sobre',
    panel: 'split',
    intro:
      'A ATRA aproxima a IA e a análise de dados das reais necessidades dos negócios, movida pela engenhosidade, ética e entregas de alto impacto.',
    highlights: [
      {
        icon: 'shield-check',
        color: 'orange',
        title: 'Segurança de Dados',
        description:
          'Processos rigorosos em conformidade com as diretrizes da LGPD e melhores práticas corporativas.',
      },
      {
        icon: 'star',
        color: 'blue',
        title: 'Metodologia Ágil ATRA',
        description: 'Abordagem proprietária de desenvolvimento focada em ciclos rápidos e entregas contínuas.',
      },
    ],
    card: {
      icon: 'info',
      title: 'Quem Somos',
      bullets: bullets(['Foco no Cliente', 'Inovação Ética', 'Grandes Marcas', 'Excelência Técnica']),
      ctaLabel: 'Conhecer Nossa História',
      href: '/sobre',
    },
  },
  {
    label: 'Glossário',
    href: '/glossario',
    panel: 'split',
    intro:
      'Desvende a complexidade técnica com nosso guia prático e descomplicado sobre conceitos essenciais de dados, BI, IA e metodologias.',
    highlights: [
      {
        icon: 'brain',
        color: 'amber',
        title: 'O que é LLM e RAG?',
        description:
          'Conceitos fundamentais explicados de forma simples para entender inteligência artificial generativa corporativa.',
      },
      {
        icon: 'database',
        color: 'blue',
        title: 'Lakehouse e Data Mesh',
        description: 'As arquiteturas modernas que sustentam analytics em escala, sem jargão.',
      },
    ],
    card: {
      icon: 'book',
      title: 'Glossário de Dados & IA',
      bullets: bullets(['Linguagem Simples', 'Termos Essenciais', 'Busca por Letra', 'Sempre Atualizado']),
      ctaLabel: 'Consultar o Glossário',
      href: '/glossario',
    },
  },
]

const EN: Categoria[] = [
  { label: 'Solutions', panel: 'solutions' },
  {
    label: 'Consultants',
    href: '/consultores',
    panel: 'split',
    intro:
      'Connect your company to specialists in AI, Data Engineering and BI, working end to end across the analytics journey.',
    highlights: [
      {
        icon: 'user-check',
        color: 'emerald',
        title: 'AI & Data squads',
        description: 'Integrated, self-managing teams focused on accelerating delivery of value.',
      },
      {
        icon: 'building',
        color: 'purple',
        title: 'Strategic consulting',
        description: 'Analytics maturity assessment and a technology roadmap built for you.',
      },
    ],
    card: {
      icon: 'users',
      title: 'Specialist consultants',
      bullets: bullets([
        'Fast, on-demand allocation',
        'Certified specialists',
        'Focused on business outcomes',
        'Technical support and mentoring',
      ]),
      ctaLabel: 'Find consultants',
      href: '/consultores',
    },
  },
  {
    label: 'Insights',
    href: '/insights',
    panel: 'links',
    links: links([
      ['star', 'Success Stories', 'Real stories of digital transformation.', '/cases-de-sucesso'],
      ['file-text', 'Reports', 'Deep analysis of the data market.', '/relatorios'],
      ['newspaper', 'Blog', 'Articles, trends, and technical news.', '/blog'],
      ['video', 'Webinars', 'Video content with our experts.', '/webinars'],
      ['book', 'Ebooks', 'Complete guides for your data journey.', '/ebooks'],
    ]),
  },
  { label: 'Partners', panel: 'partners' },
  {
    label: 'Careers',
    href: '/carreiras',
    panel: 'split',
    intro:
      'Join a team that cares about innovation, data and AI. At ATRA we believe in collaboration, diversity and technical excellence to build the future of technology.',
    highlights: [
      {
        icon: 'graduation-cap',
        color: 'indigo',
        title: 'Continuous learning',
        description: 'Support for certifications (AWS, GCP, Azure, Databricks) and in-house training.',
      },
      {
        icon: 'heart',
        color: 'pink',
        title: 'Health and wellbeing',
        description: 'Flexible benefits, a focus on mental health and a genuine work-life balance.',
      },
    ],
    card: {
      icon: 'briefcase',
      title: 'Work with us',
      bullets: bullets(['Fully remote', 'Flat culture', 'Career track', 'Challenging projects']),
      ctaLabel: 'See open roles',
      href: '/carreiras',
    },
  },
  {
    label: 'About',
    href: '/sobre',
    panel: 'split',
    intro:
      'ATRA brings AI and data analysis closer to what businesses actually need, driven by ingenuity, ethics and high-impact delivery.',
    highlights: [
      {
        icon: 'shield-check',
        color: 'orange',
        title: 'Data security',
        description: 'Rigorous processes aligned with LGPD guidelines and corporate best practice.',
      },
      {
        icon: 'star',
        color: 'blue',
        title: 'The ATRA agile method',
        description: 'A proprietary development approach built on short cycles and continuous delivery.',
      },
    ],
    card: {
      icon: 'info',
      title: 'Who we are',
      bullets: bullets(['Client focus', 'Ethical innovation', 'Major brands', 'Technical excellence']),
      ctaLabel: 'Read our story',
      href: '/sobre',
    },
  },
  {
    label: 'Glossary',
    href: '/glossario',
    panel: 'split',
    intro:
      'Cut through the jargon with a practical guide to the essential concepts of data, BI, AI and methodology.',
    highlights: [
      {
        icon: 'brain',
        color: 'amber',
        title: 'What are LLMs and RAG?',
        description: 'The fundamentals explained simply, to make sense of corporate generative AI.',
      },
      {
        icon: 'database',
        color: 'blue',
        title: 'Lakehouse and Data Mesh',
        description: 'The modern architectures behind analytics at scale, without the jargon.',
      },
    ],
    card: {
      icon: 'book',
      title: 'Data & AI glossary',
      bullets: bullets(['Plain language', 'Essential terms', 'Browse by letter', 'Always current']),
      ctaLabel: 'Open the glossary',
      href: '/glossario',
    },
  },
]

const payload = await getPayload({ config })

console.log('→ menu do topo')
await payload.updateGlobal({ slug: 'navigation', data: { categories: PT }, locale: 'pt' })

/* Mesma armadilha dos layouts de bloco: sem os ids de todos os níveis o Payload
 * recria as linhas e o português some. Ver `ids.ts`. */
const gravado = await payload.findGlobal({ slug: 'navigation', locale: 'pt', depth: 0 })
await payload.updateGlobal({
  slug: 'navigation',
  data: { categories: casarIds(EN, gravado.categories) },
  locale: 'en',
})

console.log(`  ${PT.length} categorias, 2 idiomas`)
process.exit(0)

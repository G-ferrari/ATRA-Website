/* Seed do global `navigation` — as 7 categorias do topo (MIG-072a).
 *
 * De `legacy/src/App.tsx:365` (a fileira), `:458-880` (os painéis) e das chaves
 * `nav.*` e `megaMenu.*` de `legacy/src/locales/{pt,en}.json`.
 *
 * Soluções e Parceiros **não têm conteúdo aqui**: os painéis leem as
 * collections. Só o rótulo e o formato ficam no global.
 *
 * ⚠️ **Parceiros** fica sem `href`: no legado aponta para `#` e não há índice
 * de parceiros para onde ir — nem lá nem aqui. A categoria abre o painel e não
 * navega, e é o painel que leva a cada parceiro.
 *
 * **Soluções ganhou destino** em 21/08/2026. Também apontava para `#`, herdado
 * do protótipo, mas ali é link morto e não ausência de página: `/solucoes`
 * existe nos dois apps. O protótipo foi ligado na mesma mudança — o gabarito
 * sai dele, e mexer só de um lado faria a comparação medir a diferença. */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

type Categoria = Record<string, unknown>

const links = (itens: [string, string, string, string][]) =>
  itens.map(([icon, label, description, href]) => ({ icon, label, description, href }))

const bullets = (itens: string[]) => itens.map((text) => ({ text }))

const PT: Categoria[] = [
  { label: 'Soluções', href: '/solucoes', panel: 'solutions' },
  /* ⚠️ A **8ª categoria**, e a única que não vem do protótipo.
   *
   * As 8 verticais existem só no WordPress (D-17) e a rota `/segmentos` nasceu
   * em MIG-091 sem link nenhum apontando para ela. Ligar aqui muda o cabeçalho,
   * que aparece nas 13 rotas sob gate visual — o gabarito foi regravado junto,
   * com o mesmo item acrescentado ao protótipo, senão a comparação passaria a
   * medir a diferença em vez da regressão.
   *
   * Fica ao lado de Soluções de propósito: solução é **o que** a ATRA faz,
   * segmento é **para quem**, e as duas se leem juntas. Ao contrário de
   * Soluções e Parceiros, esta navega — `/segmentos` é uma página de verdade. */
  { label: 'Segmentos', href: '/segmentos', panel: 'segments' },
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
      ['file-text', 'ATRA na mídia', 'Análises profundas do mercado de dados.', '/atra-na-midia'],
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
]

const EN: Categoria[] = [
  { label: 'Solutions', href: '/solucoes', panel: 'solutions' },
  { label: 'Segments', href: '/segmentos', panel: 'segments' },
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
      ['file-text', 'ATRA in the media', 'Deep analysis of the data market.', '/atra-na-midia'],
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

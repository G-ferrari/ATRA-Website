/* Seed dos 4 cases reais do protótipo (MIG-029).
 *
 * Idempotente: identifica por slug e atualiza em vez de duplicar. Rodar duas
 * vezes deixa o banco no mesmo estado.
 *
 * Rodar com: pnpm seed
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

const LEGADO = path.resolve(process.cwd(), '../legacy')

type DadosCase = {
  slug: { pt: string; en: string }
  title: { pt: string; en: string }
  client: string
  summary: { pt: string; en: string }
  impact?: { pt: string; en: string }
  /** Abertura da página do case — no legado é outra frase, não a do card. */
  heroSubtitle?: { pt: string; en: string }
  imagem: string
  topics: string[]
  challenges?: { pt: string[]; en: string[] }
  results?: { pt: string[]; en: string[] }
  technologies?: string[]
  aboutClient?: { pt: string; en: string }
  solution?: { pt: string; en: string }
  testimonial?: { quote: string; author: string; role: string; company: string }
  partners?: string[]
  publishedAt: string
}

/* Documento Lexical mínimo com um parágrafo. No legado `solution` é uma string
 * solta; no CMS o campo é rich text, e o editor pode enriquecer depois sem
 * mexer em código. */
const paragrafo = (texto: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          { type: 'text', text: texto, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      },
    ],
  },
})

/* As tags exatas do legado (`SuccessStories.tsx:28-60`).
 *
 * A primeira versão deste seed consolidava tudo em 4 assuntos "limpos" — o que
 * é uma decisão de conteúdo, não de migração, e quebrava a comparação visual.
 * Consolidar vocabulário é trabalho do marketing depois do aceite, agora que a
 * taxonomia é editável.
 *
 * `filtro` reproduz as 5 categorias fixas de SuccessStories.tsx:20 e a ordem
 * em que aparecem lá. */
const TOPICOS: { slug: string; pt: string; en: string; filtro?: number }[] = [
  { slug: 'governanca', pt: 'Governança', en: 'Governance', filtro: 1 },
  { slug: 'cloud', pt: 'Cloud', en: 'Cloud', filtro: 2 },
  { slug: 'risco', pt: 'Risco', en: 'Risk', filtro: 3 },
  { slug: 'analytics', pt: 'Analytics', en: 'Analytics', filtro: 4 },
  { slug: 'migracao', pt: 'Migração', en: 'Migration', filtro: 5 },
  { slug: 'marketplace', pt: 'Marketplace', en: 'Marketplace' },
  { slug: 'gcp', pt: 'GCP', en: 'GCP' },
  { slug: 'python', pt: 'Python', en: 'Python' },
  { slug: 'eficiencia', pt: 'Eficiência', en: 'Efficiency' },
  { slug: 'carrefour', pt: 'Carrefour', en: 'Carrefour' },
  { slug: 'dashboards', pt: 'Dashboards', en: 'Dashboards' },
  { slug: 'looker', pt: 'Looker', en: 'Looker' },
]

/* Conteúdo de legacy/src/pages/cases/*.tsx. O inglês ainda não existe no
 * protótipo (só ~172 chaves de navegação são traduzidas), então fica igual ao
 * português e entra na fila de tradução — ver P-08. */
/* Parceiros citados nos cases (`partners=` em legacy/src/pages/cases/*.tsx).
 *
 * ⚠️ O logo é obrigatório na collection, mas esta página só mostra o nome. O da
 * Informatica existe em `legacy/src/assets/images/`; o do Google Cloud é
 * hotlink do WordPress e entra na migração de mídia (MIG-071). Até lá vai um
 * PNG marcador, com alt explícito — nenhuma página o exibe hoje. */
const PARCEIROS: { slug: string; name: string; description: string; logo: string | null }[] = [
  {
    slug: 'google-cloud',
    name: 'Google Cloud',
    description: 'Nuvem pública líder em dados e IA.',
    logo: null,
  },
  {
    slug: 'salesforce-informatica',
    name: 'Informatica',
    description: 'Gestão de dados em nuvem líder de mercado.',
    logo: 'src/assets/images/salesforceinformatica.png',
  },
]

const CASES: DadosCase[] = [
  {
    slug: { pt: 'marketplace-governanca-dados', en: 'data-marketplace-governance' },
    title: {
      pt: 'Gerando valor através de Marketplace e Governança de dados',
      en: 'Gerando valor através de Marketplace e Governança de dados',
    },
    client: 'Banco ABC',
    summary: {
      pt: 'Estabelecimento de fluxo de trabalho entre Informatica e GCP para democratizar dados corporativos com segurança e alta performance.',
      en: 'Estabelecimento de fluxo de trabalho entre Informatica e GCP para democratizar dados corporativos com segurança e alta performance.',
    },
    impact: { pt: '+300% de adoção de dados', en: '+300% de adoção de dados' },
    imagem: 'src/assets/images/case_marketplace_gov_1785848321737.jpg',
    topics: ['governanca', 'marketplace', 'gcp'],
    challenges: {
      pt: [
        'Estabelecer um fluxo de trabalho fluído entre as soluções da Informatica e a Plataforma GCP;',
        'Fornecer uma maneira de usar dashboards como produto;',
        'Implementar perfil de dados, linhagem de dados, glossário de dados e classificação de dados dentro do ambiente GCP com bilhões de objetos.',
      ],
      en: [],
    },
    results: {
      pt: [
        'Qualificação de dados de vendas resolvendo problemas de completude da informação;',
        'Democratização e qualificação de dados por meio de catálogos e monitoramento;',
        'Melhor experiência ao usuário (dashboards como produto).',
      ],
      en: [],
    },
    technologies: ['Informatica CDGC', 'Informatica Data Quality', 'Google Data Lake (BigQuery)'],
    aboutClient: {
      pt: 'Com um amplo portfólio de produtos e expertise em análise de crédito, o Banco ABC Brasil possui uma sólida base de clientes composta por médias e grandes empresas.',
      en: '',
    },
    solution: {
      pt: 'Utilização de ferramentas de catálogo de dados para a catalogação dos dashboards desenvolvidos no Look Studio e de todos os recursos relacionados ao Data Lake (BigQuery). Documentação de informações críticas ao negócio, glossários, classificação e monitoramento de qualidade. Fornecimento de acesso via Data Marketplace.',
      en: 'Utilização de ferramentas de catálogo de dados para a catalogação dos dashboards desenvolvidos no Look Studio e de todos os recursos relacionados ao Data Lake (BigQuery). Documentação de informações críticas ao negócio, glossários, classificação e monitoramento de qualidade. Fornecimento de acesso via Data Marketplace.',
    },
    testimonial: {
      quote: 'Temos aqui uma grande parceira que é a ATRA! Estamos com muitos projetos trabalhando em conjunto... pessoas extremamente especializadas em cada assunto. Os executivos são muito próximos dos projetos e a comunicação é eficiente e ágil.',
      author: 'Rafael Kataoka',
      role: 'Big Data Analytics and Information Security Manager',
      company: 'Banco ABC',
    },
    partners: ['google-cloud', 'salesforce-informatica'],
    heroSubtitle: { pt: 'Transformação da gestão de dados do Banco ABC com foco em democratização, qualidade e governança através de Marketplace.', en: 'Transformação da gestão de dados do Banco ABC com foco em democratização, qualidade e governança através de Marketplace.' },
    publishedAt: '2026-03-01',
  },
  {
    slug: { pt: 'migracao-legado-gcp', en: 'legacy-migration-gcp' },
    title: {
      pt: 'Migrando cargas de trabalho legadas para Google Cloud',
      en: 'Migrando cargas de trabalho legadas para Google Cloud',
    },
    client: 'Banco ABC',
    summary: {
      pt: 'Alimentação automática de aplicação de Risco de Mercado a partir de sistemas legados em prazo recorde com arquitetura moderna.',
      en: 'Alimentação automática de aplicação de Risco de Mercado a partir de sistemas legados em prazo recorde com arquitetura moderna.',
    },
    impact: { pt: '-40% tempo de processamento', en: '-40% tempo de processamento' },
    imagem: 'src/assets/images/case_legacy_migration_1785848338358.jpg',
    topics: ['cloud', 'migracao', 'python'],
    challenges: {
      pt: [
        'Alimentar uma nova aplicação de Risco de Mercado a partir de legado em curto prazo;',
        'Disponibilizar dados de forma corporativa em um Data Lake no GCP;',
        'Desenvolver uma integração ágil, confiável e consistente entre tecnologias diferentes.',
      ],
      en: [],
    },
    results: {
      pt: [
        'Tratamento instantâneo dos arquivos de legado assim que disponibilizados;',
        'Automatização total do processo – do legado até a aplicação;',
        'Redução drástica de custos operacionais e falhas manuais;',
        'Rápido desenvolvimento e fácil manutenção com ferramentas nativas GCP.',
      ],
      en: [],
    },
    technologies: ['Pub/Sub', 'Cloud Functions', 'Google Cloud Storage', 'Informatica IDMC'],
    aboutClient: {
      pt: 'O Banco ABC Brasil é reconhecido por seu processo ágil de tomada de decisão e sólida base de clientes corporativos.',
      en: '',
    },
    solution: {
      pt: 'Implementação de Google Storage como landing zone e BigQuery como data lake. Uso de Cloud Functions em Python com triggers para detecção automática, padronização e preparação de arquivos. Integração em camadas (raw, stage, refined) via Informatica IDMC CDI.',
      en: 'Implementação de Google Storage como landing zone e BigQuery como data lake. Uso de Cloud Functions em Python com triggers para detecção automática, padronização e preparação de arquivos. Integração em camadas (raw, stage, refined) via Informatica IDMC CDI.',
    },
    testimonial: {
      quote: 'Com o uso de Pub/Sub e Cloud Functions, conseguimos obter dados quase em tempo real e escalabilidade em nosso processo, ao mesmo tempo em que reduzimos significativamente nossos custos e esforços operacionais.',
      author: 'Rafael Kataoka',
      role: 'Big Data Analytics and Information Security Manager',
      company: 'Banco ABC',
    },
    partners: ['google-cloud'],
    heroSubtitle: { pt: 'Integração ágil de sistemas legados para alimentar uma nova aplicação de Risco de Mercado de forma automática.', en: 'Integração ágil de sistemas legados para alimentar uma nova aplicação de Risco de Mercado de forma automática.' },
    publishedAt: '2026-02-01',
  },
  {
    slug: { pt: 'eficiencia-processos-risco', en: 'risk-process-efficiency' },
    title: {
      pt: 'Ingestão impulsionando a eficiência em processos de risco com GCP',
      en: 'Ingestão impulsionando a eficiência em processos de risco com GCP',
    },
    client: 'Banco Carrefour',
    summary: {
      pt: 'Processamento de dados 51 vezes mais rápido para relatórios regulatórios e compliance contínuo no Google Cloud.',
      en: 'Processamento de dados 51 vezes mais rápido para relatórios regulatórios e compliance contínuo no Google Cloud.',
    },
    impact: { pt: '51x mais rápido', en: '51x mais rápido' },
    imagem: 'src/assets/images/case_risk_efficiency_1785848355083.jpg',
    topics: ['risco', 'eficiencia', 'carrefour'],
    challenges: {
      pt: [
        'Processamento de dados lento e não escalável para relatórios regulatórios;',
        'Dependência de ferramentas locais limitadas;',
        'Risco de perda de prazos de conformidade e excesso de horas extras.',
      ],
      en: [],
    },
    results: {
      pt: [
        'Processamento 51 vezes mais rápido para relatórios regulatórios;',
        'Garantia absoluta de conformidade nos prazos;',
        'Regras comerciais claras que melhoraram a manutenção;',
        'Redução de modificações de código via parametrização flexível.',
      ],
      en: [],
    },
    technologies: ['Cloud Storage', 'Dataflow', 'Dataform', 'BigQuery', 'Looker', 'Dataplex'],
    aboutClient: {
      pt: 'O Carrefour Soluções Financeiras é o único varejista no Brasil com banco próprio, empoderando famílias através de soluções de crédito inovadoras.',
      en: '',
    },
    solution: {
      pt: 'Migração total para Google Cloud utilizando BigQuery para análises escaláveis, Dataflow para ingestão eficiente, Dataform para gerenciamento de transformações SQL, Dataplex para linhagem e Looker para visualização estratégica.',
      en: 'Migração total para Google Cloud utilizando BigQuery para análises escaláveis, Dataflow para ingestão eficiente, Dataform para gerenciamento de transformações SQL, Dataplex para linhagem e Looker para visualização estratégica.',
    },
    testimonial: {
      quote: 'A expertise e a parceria da ATRA foram fundamentais... Sua capacidade de se alinhar às necessidades da nossa equipe de Riscos proporcionou uma solução 51 vezes mais rápida e totalmente automatizada.',
      author: 'Paulo Ruza',
      role: 'Superintendente de Dados',
      company: 'Banco Carrefour',
    },
    partners: ['google-cloud'],
    heroSubtitle: { pt: 'Modernização radical do processamento de dados regulatórios, alcançando uma velocidade 51x maior.', en: 'Modernização radical do processamento de dados regulatórios, alcançando uma velocidade 51x maior.' },
    publishedAt: '2026-01-15',
  },
  {
    slug: { pt: 'dashboards-estrategicos', en: 'strategic-dashboards' },
    title: {
      pt: 'Criação de dashboards estratégico para financeira',
      en: 'Criação de dashboards estratégico para financeira',
    },
    client: 'Banco ABC',
    summary: {
      pt: 'Desenvolvimento de KPIs analíticos de alta fidelidade para performance de produtos de Crédito Pessoal e Consignado.',
      en: 'Desenvolvimento de KPIs analíticos de alta fidelidade para performance de produtos de Crédito Pessoal e Consignado.',
    },
    impact: { pt: 'Visão executiva em tempo real', en: 'Visão executiva em tempo real' },
    imagem: 'src/assets/images/case_strategic_dashboards_1785848371031.jpg',
    topics: ['dashboards', 'looker', 'analytics'],
    challenges: {
      pt: [
        'Falta de estruturação de indicadores para Crédito Pessoal e Consignado;',
        'Necessidade de dados para fundamentar o roadmap de melhorias;',
        'Dificuldade em visualizar a performance dos produtos em tempo real para tomada de decisão.',
      ],
      en: [],
    },
    results: {
      pt: [
        'Decisões estratégicas mais assertivas e 100% orientadas por dados;',
        'Roadmap de produtos construído com base em evidências reais;',
        'Operação sustentada por visão robusta e fundamentada do negócio.',
      ],
      en: [],
    },
    technologies: ['GCP', 'Looker', 'dbt', 'BigQuery'],
    aboutClient: {
      pt: 'Com expertise sólida em crédito, o Banco ABC Brasil utiliza dados como pilar para sua eficiência operacional e estratégica.',
      en: '',
    },
    solution: {
      pt: 'Estruturação de um dashboard estratégico completo integrando indicadores operacionais, métricas de negócio e dados de mercado. Implementação de visão 360º dos produtos com atualizações frequentes via Looker e dbt no ambiente GCP.',
      en: 'Estruturação de um dashboard estratégico completo integrando indicadores operacionais, métricas de negócio e dados de mercado. Implementação de visão 360º dos produtos com atualizações frequentes via Looker e dbt no ambiente GCP.',
    },
    partners: ['google-cloud'],
    heroSubtitle: { pt: 'Desenvolvimento de KPIs de performance e tomada de decisão estratégica para produtos de crédito.', en: 'Desenvolvimento de KPIs de performance e tomada de decisão estratégica para produtos de crédito.' },
    publishedAt: '2026-01-05',
  },
]

const payload = await getPayload({ config })

/* Cria ou atualiza, identificando por um campo único. Funções explícitas por
 * collection em vez de um helper genérico: a API do Payload é tipada por slug,
 * e um wrapper genérico só devolveria `any`. */

async function upsertTopico(slug: string, name: string, filtro?: number) {
  const { docs } = await payload.find({
    collection: 'topics',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const data = { name, slug, showInFilter: filtro !== undefined, filterOrder: filtro ?? 0 }
  return docs[0]
    ? payload.update({ collection: 'topics', id: docs[0].id, data, locale: 'pt' })
    : payload.create({ collection: 'topics', data, locale: 'pt' })
}

/* Identificado pela citação: dois depoimentos do seed têm o mesmo autor e a
 * mesma empresa, então autor+empresa não serve de chave. */
async function upsertDepoimento(d: NonNullable<DadosCase['testimonial']>) {
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: { quote: { equals: d.quote } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const data = {
    quote: d.quote,
    authorName: d.author,
    authorRole: d.role,
    company: d.company,
  }
  return docs[0]
    ? payload.update({ collection: 'testimonials', id: docs[0].id, data, locale: 'pt' })
    : payload.create({ collection: 'testimonials', data, locale: 'pt' })
}

/** PNG 1×1 transparente, usado só onde o logo real ainda não migrou. */
const MARCADOR = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

async function upsertMidia(arquivo: string, alt: string, conteudo?: Buffer) {
  const nome = path.basename(arquivo)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: nome.split('.')[0] } },
    limit: 1,
    depth: 0,
  })
  const file = {
    data: conteudo ?? readFileSync(arquivo),
    mimetype: nome.endsWith('.png') ? 'image/png' : 'image/jpeg',
    name: nome,
    size: 0,
  }
  return docs[0]
    ? payload.update({ collection: 'media', id: docs[0].id, data: { alt }, file, locale: 'pt' })
    : payload.create({ collection: 'media', data: { alt }, file, locale: 'pt' })
}

async function upsertParceiro(p: (typeof PARCEIROS)[number]) {
  const logo = p.logo
    ? await upsertMidia(path.join(LEGADO, p.logo), `Logo ${p.name}`)
    : await upsertMidia(`logo-pendente-${p.slug}.png`, `LOGO PENDENTE — ${p.name} (MIG-071)`, MARCADOR)

  const { docs } = await payload.find({
    collection: 'partners',
    where: { slug: { equals: p.slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const data = { name: p.name, slug: p.slug, description: p.description, logo: logo.id }
  return docs[0]
    ? payload.update({ collection: 'partners', id: docs[0].id, data, locale: 'pt' })
    : payload.create({ collection: 'partners', data, locale: 'pt' })
}

console.log('→ parceiros')
const idsParceiros = new Map<string, number>()
for (const p of PARCEIROS) {
  const doc = await upsertParceiro(p)
  idsParceiros.set(p.slug, doc.id)
}
console.log(`  ${idsParceiros.size} parceiros`)

console.log('→ assuntos')
const idsTopicos = new Map<string, number>()
for (const t of TOPICOS) {
  const doc = await upsertTopico(t.slug, t.pt, t.filtro)
  idsTopicos.set(t.slug, doc.id)
  await payload.update({ collection: 'topics', id: doc.id, data: { name: t.en }, locale: 'en' })
}
console.log(`  ${idsTopicos.size} assuntos`)

console.log('→ cases')
for (const c of CASES) {
  const midia = await upsertMidia(path.join(LEGADO, c.imagem), `${c.title.pt} — ${c.client}`)
  const depoimento = c.testimonial ? await upsertDepoimento(c.testimonial) : null

  const { docs: existentes } = await payload.find({
    collection: 'cases',
    where: { slug: { equals: c.slug.pt } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const dados = {
      title: c.title.pt,
      slug: c.slug.pt,
      client: c.client,
      summary: c.summary.pt,
      impact: c.impact?.pt,
      heroSubtitle: c.heroSubtitle?.pt,
      heroImage: midia.id,
      topics: c.topics.map((s) => idsTopicos.get(s)!),
      challenges: (c.challenges?.pt ?? []).map((text) => ({ text })),
      results: (c.results?.pt ?? []).map((text) => ({ text })),
      technologies: (c.technologies ?? []).map((name) => ({ name })),
      aboutClient: c.aboutClient?.pt,
      solution: c.solution ? paragrafo(c.solution.pt) : undefined,
      testimonial: depoimento?.id,
      partners: (c.partners ?? []).map((s) => idsParceiros.get(s)!),
      publishedAt: new Date(c.publishedAt).toISOString(),
      _status: 'published' as const,
  }

  const doc = existentes[0]
    ? await payload.update({ collection: 'cases', id: existentes[0].id, data: dados, locale: 'pt' })
    : await payload.create({ collection: 'cases', data: dados, locale: 'pt' })

  // Inglês: por ora só o slug, para a rota existir nos dois idiomas (P-08).
  await payload.update({
    collection: 'cases',
    id: doc.id,
    data: {
      slug: c.slug.en,
      title: c.title.en,
      summary: c.summary.en,
      impact: c.impact?.en,
      heroSubtitle: c.heroSubtitle?.en,
      solution: c.solution ? paragrafo(c.solution.en) : undefined,
    },
    locale: 'en',
  })

  console.log(`  ${c.slug.pt}`)
}

console.log('seed concluído')
process.exit(0)

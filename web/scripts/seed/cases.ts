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
  imagem: string
  topics: string[]
  challenges?: { pt: string[]; en: string[] }
  results?: { pt: string[]; en: string[] }
  technologies?: string[]
  aboutClient?: { pt: string; en: string }
  publishedAt: string
}

const TOPICOS = [
  { slug: 'governanca-lgpd', pt: 'Governança & LGPD', en: 'Governance & LGPD' },
  { slug: 'google-cloud', pt: 'Google Cloud', en: 'Google Cloud' },
  { slug: 'analytics-bi', pt: 'Analytics & BI', en: 'Analytics & BI' },
  { slug: 'migracao-de-legados', pt: 'Migração de Legados', en: 'Legacy Migration' },
]

/* Conteúdo de legacy/src/pages/cases/*.tsx. O inglês ainda não existe no
 * protótipo (só ~172 chaves de navegação são traduzidas), então fica igual ao
 * português e entra na fila de tradução — ver P-08. */
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
    topics: ['governanca-lgpd', 'google-cloud'],
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
    topics: ['migracao-de-legados', 'google-cloud'],
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
    topics: ['google-cloud', 'analytics-bi'],
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
    topics: ['analytics-bi', 'google-cloud'],
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
    publishedAt: '2026-01-05',
  },
]

const payload = await getPayload({ config })

/* Cria ou atualiza, identificando por um campo único. Funções explícitas por
 * collection em vez de um helper genérico: a API do Payload é tipada por slug,
 * e um wrapper genérico só devolveria `any`. */

async function upsertTopico(slug: string, name: string) {
  const { docs } = await payload.find({
    collection: 'topics',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const data = { name, slug }
  return docs[0]
    ? payload.update({ collection: 'topics', id: docs[0].id, data, locale: 'pt' })
    : payload.create({ collection: 'topics', data, locale: 'pt' })
}

async function upsertMidia(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: nome.split('.')[0] } },
    limit: 1,
    depth: 0,
  })
  const file = {
    data: readFileSync(arquivo),
    mimetype: 'image/jpeg',
    name: nome,
    size: 0,
  }
  return docs[0]
    ? payload.update({ collection: 'media', id: docs[0].id, data: { alt }, file, locale: 'pt' })
    : payload.create({ collection: 'media', data: { alt }, file, locale: 'pt' })
}

console.log('→ assuntos')
const idsTopicos = new Map<string, number>()
for (const t of TOPICOS) {
  const doc = await upsertTopico(t.slug, t.pt)
  idsTopicos.set(t.slug, doc.id)
  await payload.update({ collection: 'topics', id: doc.id, data: { name: t.en }, locale: 'en' })
}
console.log(`  ${idsTopicos.size} assuntos`)

console.log('→ cases')
for (const c of CASES) {
  const midia = await upsertMidia(path.join(LEGADO, c.imagem), `${c.title.pt} — ${c.client}`)

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
      heroImage: midia.id,
      topics: c.topics.map((s) => idsTopicos.get(s)!),
      challenges: (c.challenges?.pt ?? []).map((text) => ({ text })),
      results: (c.results?.pt ?? []).map((text) => ({ text })),
      technologies: (c.technologies ?? []).map((name) => ({ name })),
      aboutClient: c.aboutClient?.pt,
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
    data: { slug: c.slug.en, title: c.title.en, summary: c.summary.en, impact: c.impact?.en },
    locale: 'en',
  })

  console.log(`  ${c.slug.pt}`)
}

console.log('seed concluído')
process.exit(0)

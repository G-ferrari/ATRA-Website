/* Seed das 6 soluções (MIG-055).
 *
 * De `legacy/src/App.tsx:45-97` (PT) e `legacy/src/locales/en.json`, chave
 * `megaMenu.solutions` (EN). Idempotente pelo slug em português.
 *
 * O inglês aqui é o do protótipo, não repetição do português como nos outros
 * seeds — a tradução já existia. Segue sujeito a P-08.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Solucao = {
  category: 'innovation-ai' | 'data-bi' | 'governance-culture'
  icon: 'brain' | 'app' | 'database' | 'chart' | 'shield' | 'users'
  order: number
  pt: { title: string; slug: string; shortDescription: string }
  en: { title: string; slug: string; shortDescription: string }
}

/* ⚠️ Todas entram com `hasPage: false`. No legado 5 das 6 apontam para `#` e
 * só IA tem página — e a página de IA chega em MIG-056. Ligar a de IA agora
 * deixaria o índice apontando para um 404, que foi exatamente o buraco que
 * MIG-050 abriu e MIG-051 teve que fechar. */
const SOLUCOES: Solucao[] = [
  {
    category: 'innovation-ai',
    icon: 'brain',
    order: 0,
    pt: {
      title: 'Inteligência Artificial & IA Generativa',
      // Slug do legado (`App.tsx:53`): é a única solução com URL já publicada.
      slug: 'inteligencia-artificial',
      shortDescription:
        'Soluções de IA Generativa, agentes conversacionais, modelos preditivos e extração inteligente de documentos com governança e uso responsável.',
    },
    en: {
      title: 'Artificial Intelligence & Generative AI',
      slug: 'artificial-intelligence',
      shortDescription:
        'Generative AI solutions, conversational agents, predictive models, and intelligent document extraction guided by strict governance.',
    },
  },
  {
    category: 'innovation-ai',
    icon: 'app',
    order: 1,
    pt: {
      title: 'Apps & Soluções Digitais',
      slug: 'apps-e-solucoes-digitais',
      shortDescription:
        'Aplicações web e mobile integradas ao Lakehouse e modernização de sistemas legados para colocar inteligência e dados na ponta da decisão.',
    },
    en: {
      title: 'Apps & Digital Solutions',
      slug: 'apps-and-digital-solutions',
      shortDescription:
        'Web and mobile applications integrated with Lakehouse alongside legacy modernization to place intelligence directly at decision points.',
    },
  },
  {
    category: 'data-bi',
    icon: 'database',
    order: 0,
    pt: {
      title: 'Engenharia de Dados & Cloud',
      slug: 'engenharia-de-dados-e-cloud',
      shortDescription:
        'Arquiteturas Lakehouse modernas em nuvem com pipelines de alta performance para unificar dados e suportar BI, analytics e IA.',
    },
    en: {
      title: 'Data Engineering & Cloud',
      slug: 'data-engineering-and-cloud',
      shortDescription:
        'Modern cloud Lakehouse architectures and high-performance pipelines to unify data and power advanced analytics.',
    },
  },
  {
    category: 'data-bi',
    icon: 'chart',
    order: 1,
    pt: {
      title: 'Business Intelligence & Advanced Analytics',
      slug: 'business-intelligence-e-advanced-analytics',
      shortDescription:
        'Dashboards executivos, análises preditivas e estruturas de Self-Service BI para transformar dados operacionais em decisões estratégicas.',
    },
    en: {
      title: 'Business Intelligence & Advanced Analytics',
      slug: 'business-intelligence-and-advanced-analytics',
      shortDescription:
        'Executive dashboards, predictive modeling, and Self-Service BI frameworks to turn raw data into business intelligence.',
    },
  },
  {
    category: 'governance-culture',
    icon: 'shield',
    order: 0,
    pt: {
      title: 'Governança de Dados & FinOps',
      slug: 'governanca-de-dados-e-finops',
      shortDescription:
        'Catálogo, conformidade e qualidade de dados alinhados a práticas de FinOps para otimização contínua dos custos em nuvem.',
    },
    en: {
      title: 'Data Governance & FinOps',
      slug: 'data-governance-and-finops',
      shortDescription:
        'Data cataloging, compliance, and quality aligned with FinOps practices for continuous cloud cost optimization.',
    },
  },
  {
    category: 'governance-culture',
    icon: 'users',
    order: 1,
    pt: {
      title: 'Cultura de Dados (Enablement)',
      slug: 'cultura-de-dados',
      shortDescription:
        'Programas de alfabetização em dados e IA (Data Literacy) para capacitar times, acelerar a adoção e maximizar o ROI de tecnologia.',
    },
    en: {
      title: 'Data Culture (Enablement)',
      slug: 'data-culture',
      shortDescription:
        'Data and AI literacy programs to empower teams, accelerate adoption, and maximize technology ROI.',
    },
  },
]

const payload = await getPayload({ config })

console.log('→ soluções')
for (const s of SOLUCOES) {
  const { docs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: s.pt.slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const comuns = { category: s.category, icon: s.icon, order: s.order, hasPage: false, _status: 'published' as const }
  const data = { ...comuns, ...s.pt }
  const doc = docs[0]
    ? await payload.update({ collection: 'solutions', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'solutions', data, locale: 'pt' })

  await payload.update({ collection: 'solutions', id: doc.id, data: { ...comuns, ...s.en }, locale: 'en' })
}
console.log(`  ${SOLUCOES.length} soluções`)
process.exit(0)

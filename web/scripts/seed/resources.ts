/* Seed dos 6 materiais (MIG-041).
 *
 * 3 relatórios de `legacy/src/pages/Reports.tsx:10` e 3 e-books de
 * `Ebooks.tsx:9`. Idempotente por slug.
 *
 * Entram **publicados**, e isso revisa a leitura de D-08 para materiais.
 *
 * D-08 mandou rascunho porque "15 itens não têm corpo". Vale para blog: post sem
 * texto é página magra. Não vale aqui: no legado os botões são "Solicitar
 * acesso" e "Baixar agora" — material rico é isca de lead com formulário, não
 * artigo. O card já está completo, e a página de detalhe (MIG-045) é landing
 * com formulário, não texto corrido.
 *
 * ⚠️ As datas dos e-books são inventadas: no legado eles não têm data, e a
 * ordem da página é a do array. Semeadas em ordem decrescente para que
 * `sort: '-publishedAt'` reproduza aquela ordem — inclusive qual aparece no
 * destaque. Trocar por um campo de ordenação explícito se o marketing quiser
 * controlar isso à mão.
 *
 * ⚠️ O que falta de verdade é o **arquivo**: o botão do legado não baixa nada.
 * Registrado em debito-tecnico.md; não é motivo para esconder a listagem, que
 * no protótipo está no ar com os seis.
 *
 * ⚠️ A capa é um marcador gerado, não a imagem real — no legado são hotlinks do
 * Unsplash, imagem de banco que não é da ATRA. As capas de verdade entram com
 * o conteúdo.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Material = {
  kind: 'report' | 'ebook'
  title: string
  description: string
  tags: string[]
  pages?: number
  publishedAt: string
}

const MATERIAIS: Material[] = [
  {
    kind: 'report',
    title: 'Relatório Anual de Dados 2025: Tendências e Projeções',
    description:
      'Um mergulho profundo nas tecnologias que moldarão as empresas brasileiras nos próximos 12 meses.',
    tags: ['Market', 'Trends', '2026'],
    publishedAt: '2026-01-10',
  },
  {
    kind: 'report',
    title: 'O Impacto da IA Generativa na Produtividade Corporativa',
    description:
      'Pesquisa exclusiva com 200 CEOs sobre como a IA está mudando a forma como trabalhamos.',
    tags: ['IA', 'Business', 'ROI'],
    publishedAt: '2025-11-15',
  },
  {
    kind: 'report',
    title: 'Benchmarks de Cloud Computing na América Latina',
    description:
      'Comparativo de custos, adoção e maturidade digital entre os principais mercados da região.',
    tags: ['Cloud', 'LATAM', 'Infrastructure'],
    publishedAt: '2025-10-05',
  },
  {
    kind: 'ebook',
    title: 'O Guia Definitivo do Data Lakehouse para Executivos',
    description:
      'Saiba como unificar seus dados e IA em uma única arquitetura resiliente e de baixo custo.',
    tags: ['Data', 'Architecture', 'Strategy'],
    pages: 45,
    publishedAt: '2025-09-01',
  },
  {
    kind: 'ebook',
    title: 'Governança de Dados na Era da IA Generativa',
    description:
      'Políticas essenciais para garantir segurança e qualidade nos seus modelos de linguagem.',
    tags: ['Governance', 'Security', 'IA'],
    pages: 32,
    publishedAt: '2025-08-01',
  },
  {
    kind: 'ebook',
    title: 'Modernizando sua Infraestrutura para Cloud Native',
    description:
      'Passo a passo para uma migração segura e eficiente para a nuvem.',
    tags: ['Cloud', 'Migration', 'DevOps'],
    pages: 38,
    publishedAt: '2025-07-01',
  },
]

const CAPA = path.resolve(process.cwd(), 'scripts/seed/assets/capa-pendente.png')

const paraSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })

async function capaMarcadora() {
  const nome = 'capa-pendente.png'
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: 'capa-pendente' } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]
  return payload.create({
    collection: 'media',
    data: { alt: 'CAPA PENDENTE — imagem real entra com o conteúdo do material' },
    file: { data: readFileSync(CAPA), mimetype: 'image/png', name: nome, size: 0 },
    locale: 'pt',
  })
}

console.log('→ materiais')
const capa = await capaMarcadora()

for (const m of MATERIAIS) {
  const slug = paraSlug(m.title)
  const { docs } = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const data = {
    kind: m.kind,
    title: m.title,
    slug,
    description: m.description,
    coverImage: capa.id,
    tags: m.tags.map((name) => ({ name })),
    pages: m.pages,
    publishedAt: new Date(m.publishedAt).toISOString(),
    _status: 'published' as const,
  }

  const doc = docs[0]
    ? await payload.update({ collection: 'resources', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'resources', data, locale: 'pt' })

  await payload.update({
    collection: 'resources',
    id: doc.id,
    data: { title: m.title, slug, description: m.description },
    locale: 'en',
  })
  console.log(`  ${m.kind}: ${slug}`)
}
process.exit(0)

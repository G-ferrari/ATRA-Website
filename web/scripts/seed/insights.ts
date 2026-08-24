/* Seed de /insights (MIG-060).
 *
 * ⚠️ O plano previa "agrega 4 collections" e o legado **não agrega nada**: o hub
 * tem texto próprio. Dos 10 itens, só 3 repetem o título da página de origem — o
 * mesmo case do Banco Carrefour aparece aqui como "Processamento de Dados 51x
 * Mais Rápido no Google Cloud" e em /cases-de-sucesso com outro nome. Agregar
 * mudaria o texto de sete cartões e reprovaria o aceite visual (D-15); trocar o
 * texto do hub pelo das collections é decisão de conteúdo (D-22).
 *
 * Foi o quinto levantamento escrito a partir do inventário de seções em vez do
 * markup. Ver a nota em docs/02-especificacao/blocos.md.
 *
 * As capas: as três de case saem do acervo; as outras sete são hotlink do
 * Unsplash no gabarito — banco de imagens que não é da ATRA — e entram como o
 * marcador de capa pendente, igual às da home.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'
import { imagemDoPrototipo } from './imagens-do-prototipo'

const payload = await getPayload({ config })
const LEGADO = path.resolve(process.cwd(), '../legacy')
const MIMES: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

async function upsertDe(base: string, arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: chave } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: readFileSync(path.join(base, arquivo)),
      mimetype: MIMES[path.extname(nome).toLowerCase()] ?? 'image/png',
      name: nome,
      size: 0,
    },
    locale: 'pt',
  })
  return doc.id
}

const upsertMidia = (arquivo: string, alt: string) => upsertDe(LEGADO, arquivo, alt)
const marcador = await upsertDe(process.cwd(), 'scripts/seed/assets/capa-pendente.png', 'CAPA PENDENTE')

/* Com `SEED_FIXTURES=1` as 7 capas viram a foto que o gabarito desenha, para a
 * revisão interna ver o hub inteiro. Sem o sinal, marcador. Ver
 * `imagens-do-prototipo.ts`. */
const doPrototipo = (chave: Parameters<typeof imagemDoPrototipo>[1], alt: string) =>
  imagemDoPrototipo(payload, chave, alt)

/* Os cinco formatos, com a contagem que o gabarito escreve à mão — ela **não**
 * confere com o número de itens do hub (`Insights.tsx:56`). */
const FORMATOS = [
  { key: 'all', label: 'Todos os Formatos', icon: 'app' as const },
  { key: 'case', label: 'Cases de Sucesso', icon: 'star' as const, count: 4, href: '/cases-de-sucesso' },
  { key: 'blog', label: 'Artigos & Blog', icon: 'file-text' as const, count: 6, href: '/blog' },
  { key: 'report', label: 'Relatórios', icon: 'book' as const, count: 3, href: '/relatorios' },
  { key: 'webinar', label: 'Webinars', icon: 'video' as const, count: 4, href: '/webinars' },
  { key: 'ebook', label: 'Ebooks & Guias', icon: 'book' as const, count: 4, href: '/ebooks' },
]

const TOPICOS = [
  'Todos os Tópicos', 'IA Generativa', 'Governança & LGPD', 'Google Cloud',
  'Databricks', 'Lakehouse', 'FinOps', 'Analytics & BI', 'Migração de Legados',
]

const ITENS = [
  {
    format: "case",
    title: "Gerando valor através de Marketplace e Governança de dados",
    description: "Como o Banco ABC estabeleceu um fluxo de trabalho entre Informatica e GCP para democratizar o acesso seguro a dados.",
    category: "Cases de Sucesso",
    meta: "Case de Sucesso",
    date: "Março 2026",
    author: "Banco ABC",
    href: "/cases-de-sucesso/marketplace-governanca-dados",
    featured: true,
    image: await upsertMidia('src/assets/images/case_marketplace_gov_1785848321737.jpg', "Gerando valor através de Marketplace e Governança de dados"),
    tags: [{ text: "Governança & LGPD" }, { text: "Google Cloud" }, { text: "Marketplace" }],
  },
  {
    format: "report",
    title: "Panorama de Dados & IA Generativa nas Empresas 2026",
    description: "Estudo exclusivo com mais de 200 líderes de TI mostrando como as empresas brasileiras estão investindo em IA Generativa e Lakehouse.",
    category: "Relatórios",
    meta: "Leitura de 12 min",
    date: "Fevereiro 2026",
    author: "ATRA Research Labs",
    href: "/relatorios",
    featured: true,
    image: (await doPrototipo('insights.panorama-dados-ia', 'Panorama de Dados & IA Generativa nas Empresas 2026')) ?? marcador,
    tags: [{ text: "IA Generativa" }, { text: "Analytics & BI" }, { text: "Pesquisa" }],
  },
  {
    format: "blog",
    title: "Squad Gerenciada: como estruturar equipes de TI mais eficientes",
    description: "Saiba como o modelo de squads ágeis pode escalar sua operação de tecnologia mantendo a qualidade, velocidade e cultura de dados.",
    category: "Artigos & Blog",
    meta: "Leitura de 6 min",
    date: "23 de março de 2026",
    author: "Engenharia ATRA",
    href: "/blog",
    featured: true,
    image: (await doPrototipo('insights.squad-gerenciada', 'Squad Gerenciada: como estruturar equipes de TI mais eficientes')) ?? marcador,
    tags: [{ text: "Squads" }, { text: "Gestão de TI" }, { text: "FinOps" }],
  },
  {
    format: "case",
    title: "Processamento de Dados 51x Mais Rápido no Google Cloud",
    description: "Automação de ingestão de dados de risco no Banco Carrefour com otimização extrema de performance e custos.",
    category: "Cases de Sucesso",
    meta: "Case de Sucesso",
    date: "Fevereiro 2026",
    author: "Banco Carrefour",
    href: "/cases-de-sucesso/eficiencia-processos-risco",
    featured: false,
    image: await upsertMidia('src/assets/images/case_risk_efficiency_1785848355083.jpg', "Processamento de Dados 51x Mais Rápido no Google Cloud"),
    tags: [{ text: "Google Cloud" }, { text: "Migração de Legados" }, { text: "FinOps" }],
  },
  {
    format: "ebook",
    title: "Guia Definitivo de Governança de Dados para o Setor Financeiro",
    description: "Aprenda a implementar catálogos de dados, políticas de classificação PII e compliance com LGPD e Bacen sem engessar a inovação.",
    category: "Ebooks & Guias",
    meta: "Ebook em PDF (48 págs)",
    date: "Janeiro 2026",
    author: "Especialistas de Governança ATRA",
    href: "/ebooks",
    featured: false,
    image: (await doPrototipo('insights.guia-governanca', 'Guia Definitivo de Governança de Dados para o Setor Financeiro')) ?? marcador,
    tags: [{ text: "Governança & LGPD" }, { text: "Analytics & BI" }],
  },
  {
    format: "webinar",
    title: "IA Generativa Corporativa: Do Protótipo ao RAG em Produção",
    description: "Assista à demonstração prática de arquitetura RAG usando Vertex AI, LangChain e bancos vetoriais para buscas em linguagem natural.",
    category: "Webinars",
    meta: "Vídeo de 55 min",
    date: "Janeiro 2026",
    author: "AI Architects Team",
    href: "/webinars",
    featured: false,
    image: (await doPrototipo('insights.rag-em-producao', 'IA Generativa Corporativa: Do Protótipo ao RAG em Produção')) ?? marcador,
    tags: [{ text: "IA Generativa" }, { text: "Google Cloud" }, { text: "Databricks" }],
  },
  {
    format: "blog",
    title: "Arquitetura Multicloud: O que é, por que importa e como fortalecer sua TI",
    description: "Explore os benefícios, estratégias e desafios de manter uma infraestrutura de nuvem distribuída e resiliente entre AWS, GCP e Azure.",
    category: "Artigos & Blog",
    meta: "Leitura de 8 min",
    date: "5 de janeiro de 2026",
    author: "Time de Cloud ATRA",
    href: "/blog",
    featured: false,
    image: (await doPrototipo('insights.multicloud', 'Arquitetura Multicloud: O que é, por que importa e como fortalecer sua TI')) ?? marcador,
    tags: [{ text: "Google Cloud" }, { text: "Migração de Legados" }, { text: "FinOps" }],
  },
  {
    format: "report",
    title: "FinOps Benchmark 2026: Otimização de Custos em Data Lakes",
    description: "Estratégias práticas e métricas de economias reais obtidas por grandes empresas ao otimizar BigQuery, Databricks e Snowflake.",
    category: "Relatórios",
    meta: "Leitura de 15 min",
    date: "Dezembro 2025",
    author: "ATRA FinOps Team",
    href: "/relatorios",
    featured: false,
    image: (await doPrototipo('insights.finops-benchmark', 'FinOps Benchmark 2026: Otimização de Custos em Data Lakes')) ?? marcador,
    tags: [{ text: "FinOps" }, { text: "Databricks" }, { text: "Google Cloud" }],
  },
  {
    format: "case",
    title: "Migrando Cargas de Trabalho Legadas para Google Cloud",
    description: "Alimentação automática de aplicação de Risco de Mercado a partir de sistema mainframe legado em prazo recorde.",
    category: "Cases de Sucesso",
    meta: "Case de Sucesso",
    date: "Novembro 2025",
    author: "Banco ABC",
    href: "/cases-de-sucesso/migracao-legado-gcp",
    featured: false,
    image: await upsertMidia('src/assets/images/case_legacy_migration_1785848338358.jpg', "Migrando Cargas de Trabalho Legadas para Google Cloud"),
    tags: [{ text: "Migração de Legados" }, { text: "Google Cloud" }],
  },
  {
    format: "ebook",
    title: "Playbook de Migração para Data Lakehouse Moderno",
    description: "Passo a passo com boas práticas para transicionar de data warehouses legados para a Medallion Architecture no Databricks.",
    category: "Ebooks & Guias",
    meta: "Ebook em PDF (36 págs)",
    date: "Outubro 2025",
    author: "Arquitetura de Dados ATRA",
    href: "/ebooks",
    featured: false,
    image: (await doPrototipo('insights.playbook-lakehouse', 'Playbook de Migração para Data Lakehouse Moderno')) ?? marcador,
    tags: [{ text: "Lakehouse" }, { text: "Databricks" }, { text: "Migração de Legados" }],
  },
]

const layout = [
  {
    blockType: 'insightsHub' as const,
    badge: 'Hub Central de Conhecimento',
    chip: 'ATRA Insights',
    title: 'Transformando inteligência técnica em vantagem competitiva.',
    highlight: 'vantagem competitiva',
    description: 'Explore nossos cases de sucesso com grandes marcas, relatórios de mercado, artigos de arquitetos especialistas, webinars ao vivo e ebooks estratégicos sobre Dados & IA.',
    formats: FORMATOS,
    topics: TOPICOS,
    items: ITENS,
    portals: {
      title: 'Nossos Canais de Conteúdo',
      description: 'Acesse as seções dedicadas para cada formato de material.',
    },
    newsletter: {
      eyebrow: 'ATRA Knowledge Club',
      title: 'Receba os melhores Insights quinzenalmente',
      description: 'Junte-se a mais de 5.000 líderes de dados e receba nossos artigos, pesquisas de mercado e convites de webinars direto na sua caixa de entrada.',
    },
    closing: {
      title: 'Quer implementar esses conceitos na sua empresa?',
      description: 'Nossos consultores e arquitetos seniores estão prontos para ajudar sua equipe a desenhar e executar soluções em Dados, IA e Cloud.',
      ctaLabel: 'Conhecer Nossos Consultores',
      ctaHref: '/consultores',
      secondaryLabel: 'Falar com Especialista',
      secondaryHref: '/#fale-conosco',
    },
  },
]

console.log('→ /insights')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'insights' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Insights', slug: 'insights', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Insights', slug: 'insights', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log(`  insights (${ITENS.length} conteúdos)`)
process.exit(0)

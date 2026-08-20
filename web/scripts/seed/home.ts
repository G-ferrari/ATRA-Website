/* Seed da home (MIG-057/058/059).
 *
 * A home do legado (`App.tsx:2544`) não reusa nenhuma seção das páginas
 * internas: são oito componentes próprios. Cada um virou um bloco, e a ordem
 * aqui é a daquele arquivo.
 *
 * ⚠️ A composição prevista no plano listava seis blocos e não tinha a caixa de
 * conversa com a IA (`App.tsx:2055`), que no legado é filha do herói. Foi o
 * quarto levantamento escrito a partir do inventário de seções em vez do
 * markup; ver a nota em docs/02-especificacao/blocos.md.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

const payload = await getPayload({ config })
const LEGADO = path.resolve(process.cwd(), '../legacy')

const MIMES: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' }

/* Igual, mas resolvendo o caminho a partir de web/ em vez de legacy/. */
async function upsertMidiaLocal(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: chave } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: readFileSync(path.resolve(process.cwd(), arquivo)),
      mimetype: MIMES[path.extname(nome).toLowerCase()] ?? 'image/png',
      name: nome,
      size: 0,
    },
    locale: 'pt',
  })
  return doc.id
}

async function upsertMidia(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: chave } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: readFileSync(path.join(LEGADO, arquivo)),
      mimetype: MIMES[path.extname(nome).toLowerCase()] ?? 'image/png',
      name: nome,
      size: 0,
    },
    locale: 'pt',
  })
  return doc.id
}

/* Os 7 logos de cliente da esteira (`App.tsx:1863`). `boost` amplia os três que
 * vêm menores no arquivo. */
const CLIENTES = [
  { name: 'RD Saúde', file: 'rdsaude.jpg', boost: false },
  { name: 'ANBIMA', file: 'anbima.jpg', boost: true },
  { name: 'Afya', file: 'afya.jpg', boost: true },
  { name: 'Oncoclínicas', file: 'oncoclinicas.jpg', boost: false },
  { name: 'Carrefour Banco', file: 'bcarrefour.jpg', boost: false },
  { name: 'Icatu', file: 'icatu.jpg', boost: true },
  { name: 'Porto', file: 'porto.jpg', boost: false },
]

console.log('→ logos de cliente')
const clients = []
for (const c of CLIENTES) {
  clients.push({ name: c.name, logo: await upsertMidia(`public/logos/${c.file}`, `Logo ${c.name}`), boost: c.boost })
}

/* Os 9 logos da faixa, na ordem e com os nomes do legado (`App.tsx:1397`).
 *
 * ⚠️ O quarto se chama **"Partner"** mesmo. É assim no gabarito, e o nome
 * aparece escrito embaixo do logo — não é `alt`. Trocar por "AWS" seria decisão
 * de conteúdo (D-22, P-10) e mudaria pixel. Lista própria do bloco, e não a
 * collection, justamente por causa dele; ver a nota do campo em `blocks/index.ts`. */
const LOGOS = [
  { name: 'Google Cloud', arquivo: 'logo_google_cloud.png' },
  { name: 'Denodo', arquivo: 'logo_denodo.png' },
  { name: 'BigID', arquivo: 'logo_bigid.jpg' },
  { name: 'Partner', arquivo: 'logo_aws.png' },
  { name: 'Azure', arquivo: 'logo_azure.png' },
  { name: 'Atlan', arquivo: 'logo_atlan.png' },
  { name: 'IBM', arquivo: 'logo_ibm.png' },
  { name: 'Salesforce Informatica', arquivo: 'logo_informatica.png' },
  { name: 'Databricks', arquivo: 'logo_databricks.png' },
]

console.log('→ logos de parceiro')
const partners = []
for (const l of LOGOS) {
  partners.push({ name: l.name, logo: await upsertMidiaLocal(`scripts/seed/assets/parceiros/${l.arquivo}`, l.name) })
}

const DESTAQUES = [
  { icon: 'zap' as const, badge: 'Inovação Cloud', title: 'Acelere sua Transformação', description: 'Modernize sua infraestrutura, integre sistemas e construa uma base de dados escalável em cloud com suporte de ponta a ponta.' },
  { icon: 'settings' as const, badge: 'Automação & Analytics', title: 'Eficiência Operacional', description: 'Automatize processos complexos, gere insights em tempo real e aumente exponencialmente a produtividade das equipes com BI e Analytics.' },
  { icon: 'shield-check' as const, badge: 'Governança & FinOps', title: 'Governança, Segurança e FinOps', description: 'Assegure máxima qualidade de dados, proteção e controle rigoroso de custos de nuvem com compliance e governança contínua.' },
  { icon: 'sparkles' as const, badge: 'Inteligência Artificial', title: 'Decisões Inteligentes e IA', description: 'Aplique IA Generativa, modelos preditivos e soluções digitais avançadas para antecipar cenários e acelerar tomada de decisão.' },
]

const layout = [
  {
    blockType: 'homeHero' as const,
    titlePrefix: 'A ATRA cria soluções em',
    rotatingWords: ['software sob medida', 'inteligência artificial', 'dados e analytics', 'automação', 'inovação digital'],
    description: 'Criamos, desenvolvemos e avaliamos soluções personalizadas de software, inteligência artificial e dados para impulsionar a inovação e acelerar o crescimento do seu negócio.',
    scrollLabel: 'Descubra mais da ATRA',
    prompt: {
      title: 'Nossos clientes já transformaram suas operações com a ATRA.',
      placeholder: 'Escreva uma mensagem...',
      disclaimer: 'ATRA Intelligence é uma IA e pode cometer erros. Por favor verifique informações críticas.',
      clientsTitle: 'Empresas que confiam na ATRA',
      clients,
    },
  },
  {
    blockType: 'featureTabs' as const,
    eyebrow: 'Nosso Processo de Valor',
    title: 'Soluções Integradas',
    description: 'Abordagem estruturada para acelerar resultados de negócios através da modernização e inteligência de dados.',
    footnote: 'Metodologia comprovada ATRA',
    cta: { label: 'Saiba mais', href: '/contato' },
    items: DESTAQUES,
  },
  {
    blockType: 'logoMarquee' as const,
    theme: 'surface-2' as const,
    title: 'Parceiros de Confiança',
    partners,
  },
]

console.log('→ /')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Home', slug: 'home', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Home', slug: 'home', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log(`  home (${layout.length} blocos)`)
process.exit(0)

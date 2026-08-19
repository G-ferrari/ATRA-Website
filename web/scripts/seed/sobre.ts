/* Seed da página /sobre (MIG-049).
 *
 * Reproduz a ordem exata das seções de `legacy/src/pages/About.tsx` — é o que a
 * regressão visual compara, e é a primeira vez que os 8 blocos são medidos
 * contra o legado.
 *
 * ⚠️ Os números vão para o global `site-settings`, não para a página: eles são
 * institucionais e aparecem também na home. São os de /sobre (140+, 30+, 4x),
 * que P-01 disputa contra os da home (150+, 20+, 5x).
 *
 * ⚠️ Os 4 parceiros da vitrine usam os SVGs locais de `legacy/public/imgs/`. No
 * legado são hotlinks do WordPress; a migração de mídia é MIG-071.
 *
 * As fotos do herói são as mesmas de `legacy/public/fotos/` (MIG-049a). A do
 * bloco "quem somos" é uma delas: no legado ali há um hotlink do Unsplash —
 * foto de banco que não é da ATRA —, e usar uma foto real da empresa é melhor
 * conteúdo pelo mesmo custo.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

const LEGADO = path.resolve(process.cwd(), '../legacy')

const METRICAS = [
  { value: 15, suffix: '+', label: 'Anos de experiência' },
  { value: 140, suffix: '+', label: 'Profissionais' },
  { value: 30, suffix: '+', label: 'Clientes' },
  { value: 9, suffix: '', label: 'Parceiros' },
  { value: 4, suffix: 'x', label: 'GPTW' },
]

const PARCEIROS_DA_VITRINE = [
  { slug: 'microsoft-azure', name: 'Microsoft Azure', arquivo: 'public/imgs/logo_azure.svg' },
  { slug: 'google-cloud', name: 'Google Cloud', arquivo: 'public/imgs/logo_google_cloud.svg' },
  { slug: 'databricks', name: 'Databricks', arquivo: 'public/imgs/logo_databricks.svg' },
  { slug: 'atlan', name: 'Atlan', arquivo: 'public/imgs/logo_atlan.svg' },
]

const FOTOS = [
  'public/fotos/2018_Evento global parceiro Informatica Las Vegas.jpg',
  'public/fotos/2024_ATRA Summit_Dinamica.jpg',
  'public/fotos/2024_Evento corporativo com parceiro Denodo.jpg',
  'public/fotos/2024_Evento parceiro Google.jpeg',
  'public/fotos/2025_ATRA Summit.JPG',
]

const SOLUCOES = [
  'ALOCAÇÃO DE CONSULTORES', 'INTELIGÊNCIA ARTIFICIAL', 'CLOUD', 'CUSTOMER 360º',
  'DATA ANALYTICS', 'DATA DISCOVERY', 'DATA GOVERNANCE', 'DATA INTEGRATION',
  'FÁBRICA DE TRANSFORMAÇÃO DE DADOS', 'MASTER DATA MANAGEMENT', 'SUSTENTAÇÃO REMOTA', 'TREINAMENTO',
]

const PORQUE_ESCOLHER = [
  'Somos experts em DADOS há mais de 15 anos',
  'Estamos com os melhores profissionais do mercado',
  'Queremos gerar valor para nossos clientes',
  'Nossos valores são PESSOAS, QUALIDADE E INOVAÇÃO',
  'Somos parceiros das maiores plataformas de tecnologia',
  'Temos uma equipe de suporte especializada',
  'Desenvolvemos estratégias personalizadas para cada cliente',
  'Temos o comprometimento com a qualidade dos serviços',
]

const paragrafos = (...textos: string[]) => ({
  root: {
    type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
    children: textos.map((t) => ({
      type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0,
      children: [{ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
    })),
  },
})

const payload = await getPayload({ config })

console.log('→ dados institucionais')
await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'pt',
  data: { metrics: METRICAS, foundedYear: 2011 },
})

async function upsertMidia(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: chave } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]
  const ext = path.extname(nome).toLowerCase()
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: readFileSync(path.join(LEGADO, arquivo)),
      mimetype: ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg',
      name: nome,
      size: 0,
    },
    locale: 'pt',
  })
}

console.log('→ fotos da ATRA')
const fotos: number[] = []
for (const f of FOTOS) fotos.push((await upsertMidia(f, 'Equipe e eventos da ATRA')).id)
console.log(`  ${fotos.length} fotos`)

console.log('→ parceiros da vitrine')
const ids: number[] = []
for (const p of PARCEIROS_DA_VITRINE) {
  const { docs: midias } = await payload.find({
    collection: 'media', where: { filename: { contains: path.basename(p.arquivo, '.svg') } }, limit: 1, depth: 0,
  })
  const logo = midias[0] ?? await payload.create({
    collection: 'media',
    data: { alt: `Logo ${p.name}` },
    file: {
      data: readFileSync(path.join(LEGADO, p.arquivo)),
      mimetype: 'image/svg+xml',
      name: path.basename(p.arquivo),
      size: 0,
    },
    locale: 'pt',
  })

  const { docs } = await payload.find({ collection: 'partners', where: { slug: { equals: p.slug } }, limit: 1, locale: 'pt', depth: 0 })
  const data = { name: p.name, slug: p.slug, description: `Parceiro de tecnologia da ATRA.`, logo: logo.id }
  const doc = docs[0]
    ? await payload.update({ collection: 'partners', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'partners', data, locale: 'pt' })
  ids.push(doc.id)
}
console.log(`  ${ids.length} parceiros`)

console.log('→ /sobre')
const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Sobre a ATRA',
    chip: 'Desde 2011',
    title: 'A ATRA transforma desafios em oportunidades e prepara seu negócio para a era da Transformação Digital.',
    highlight: 'ATRA',
    description:
      'Somos especialistas em Engenharia de Dados, Inteligência Artificial e Governança Corporativa com histórico de sucesso nos maiores bancos e empresas do Brasil.',
    ctas: [
      { label: 'Conhecer Nossa História', href: '#quem-somos' },
      { label: 'Trabalhe Conosco', href: '/carreiras' },
    ],
    mediaMode: 'marquee' as const,
    images: fotos,
  },
  { blockType: 'statsGrid' as const, source: 'siteSettings' as const },
  { blockType: 'stickyPageNav' as const },
  {
    blockType: 'richTextSection' as const,
    anchor: 'quem-somos',
    eyebrow: 'Quem somos',
    title: 'História da ATRA',
    body: paragrafos(
      'Somos uma empresa de TI inovadora, responsável por serviços e soluções de Integração, Migração, Governança, Engenharia e Qualidade de Dados.',
      'Nossa marca é apresentar soluções em dados, é observação e ação sobre cada ponto de melhoria identificado.',
    ),
    image: fotos[1],
    imagePosition: 'right' as const,
  },
  {
    blockType: 'valueCards' as const,
    title: 'Nossos valores',
    items: [
      { icon: 'users' as const, glowColor: 'blue' as const, title: 'PESSOAS', description: 'Proatividade, Liderança, Diversidade, Equidade, Ética, Respeito e Confiança.' },
      { icon: 'award' as const, glowColor: 'blue' as const, title: 'QUALIDADE', description: 'Responsabilidade, Transparência, Consciência, Excelência e Flexibilidade.' },
      { icon: 'rocket' as const, glowColor: 'orange' as const, title: 'INOVAÇÃO', description: 'Solução, Tecnologia, Transformação Digital e Aprendizado Contínuo.' },
    ],
  },
  {
    blockType: 'partnerShowcase' as const,
    title: 'Somos parceiros das maiores empresas de tecnologia',
    partners: ids,
    grayscale: true,
  },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'solucoes',
    eyebrow: 'Nosso Propósito',
    title: 'Nossas Soluções',
    columns: '4' as const,
    variant: 'compact' as const,
    items: SOLUCOES.map((s) => ({ icon: 'sparkles' as const, title: s })),
  },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'porque-escolher',
    eyebrow: 'Nosso Propósito',
    title: 'Por que escolher nossos serviços em dados?',
    columns: '4' as const,
    variant: 'card' as const,
    items: PORQUE_ESCOLHER.map((s) => ({ icon: 'target' as const, title: s })),
  },
  {
    blockType: 'ctaBanner' as const,
    title: 'Vamos transformar seus dados em resultado?',
    description: 'Fale com nossos especialistas e descubra o que dá para fazer com o que você já tem.',
    cta: { label: 'Fale com a gente', href: '/contato' },
    variant: 'subtle' as const,
  },
]

const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'sobre' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Sobre a ATRA', slug: 'sobre', layout, _status: 'published' as const }

const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

/* O inglês precisa do layout inteiro, não só de título e slug: os campos
 * localizados vivem **dentro** dos blocos, e enviar só a casca deixa todos
 * vazios — o Payload reprova por obrigatório e a mensagem lista 30 campos.
 *
 * O texto repete o português por ora: o legado traduz navegação, não conteúdo
 * (P-08). Entra na fila de tradução. */
await payload.update({
  collection: 'pages',
  id: doc.id,
  data: { title: 'About ATRA', slug: 'about', layout },
  locale: 'en',
})
console.log(`  sobre (${layout.length} blocos)`)
process.exit(0)

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

/* Rótulos exatos de `legacy/src/locales/pt.json`, chave `aboutStats`. Os que eu
 * tinha escrito de cabeça ("Clientes" em vez de "clientes de diversos
 * segmentos") não quebravam linha, e o card ficava 15px mais baixo. */
const METRICAS = [
  { value: 15, suffix: '+', label: 'anos no mercado' },
  { value: 140, suffix: '+', label: 'profissionais' },
  { value: 30, suffix: '+', label: 'clientes de diversos segmentos' },
  { value: 9, suffix: '', label: 'parceiros estratégicos' },
  { value: 4, suffix: 'x', label: 'GPTW' },
]

/* `logoScale` reproduz as classes por logo do legado (`About.tsx:384`). */
const PARCEIROS_DA_VITRINE = [
  { slug: 'microsoft-azure', name: 'Microsoft Azure', arquivo: 'public/imgs/logo_azure.svg', logoScale: 'lg' as const },
  { slug: 'google-cloud', name: 'Google Cloud', arquivo: 'public/imgs/logo_google_cloud.svg', logoScale: 'md' as const },
  { slug: 'databricks', name: 'Databricks', arquivo: 'public/imgs/logo_databricks.svg', logoScale: 'sm' as const },
  { slug: 'atlan', name: 'Atlan', arquivo: 'public/imgs/logo_atlan.svg', logoScale: 'sm' as const },
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

/** Igual a upsertMidia, mas resolvendo o caminho a partir de web/, não de legacy/. */
async function upsertMidiaLocal(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: nome.replace(/\.[^.]+$/, '') } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0]
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: readFileSync(path.resolve(process.cwd(), arquivo)), mimetype: 'image/png', name: nome, size: 0 },
    locale: 'pt',
  })
}

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

console.log('→ dados institucionais')
/* Selos GPTW e LIPT (Careers.tsx:306). O LIPT é arquivo local; o GPTW é hotlink
 * do WordPress, então entra como marcador até a migração de mídia (MIG-071). */
const lipt = await upsertMidia('public/imgs/lipt-2026.png', 'Selo LIPT 2026 — Lugares Incríveis Para Trabalhar')
const gptw = await upsertMidiaLocal('scripts/seed/assets/capa-pendente.png', 'SELO GPTW PENDENTE — imagem real entra com a mídia (MIG-071)')

await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'pt',
  data: {
    metrics: METRICAS,
    foundedYear: 2011,
    seals: [
      { name: 'Great Place To Work', image: gptw.id },
      { name: 'LIPT 2026', image: lipt.id },
    ],
  },
})

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
  const data = { name: p.name, slug: p.slug, description: 'Parceiro de tecnologia da ATRA.', logo: logo.id, logoScale: p.logoScale }
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
    highlight: ['ATRA', 'Transformação Digital'],
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
    navLabel: 'Quem somos',
    eyebrow: 'Quem somos',
    title: 'História da ATRA',
    body: paragrafos(
      'Somos uma empresa de TI inovadora, responsável por serviços e soluções de Integração, Migração, Governança, Engenharia e Qualidade de Dados.',
      'Nossa marca é apresentar soluções em dados, é observação e ação sobre cada ponto de melhoria identificado.',
    ),
    ctas: [{ label: 'Saiba mais', href: '/carreiras' }],
    image: fotos[1],
    imagePosition: 'right' as const,
  },
  {
    blockType: 'valueCards' as const,
    anchor: 'nossos-valores',
    navLabel: 'Nossos valores',
    theme: 'surface-2' as const,
    borda: 'ambas' as const,
    eyebrow: 'Manifesto',
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
    anchor: 'nossas-solucoes',
    navLabel: 'Nossas Soluções',
    theme: 'surface-2' as const,
    borda: 'topo' as const,
    eyebrow: 'Nossas Soluções',
    title: 'Transformando Desafios em Resultados',
    columns: '4' as const,
    variant: 'compact' as const,
    headerWidth: 'full' as const,
    items: SOLUCOES.map((s) => ({ icon: 'sparkles' as const, title: s })),
  },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'porque-escolher',
    navLabel: 'Nosso Propósito',
    eyebrow: 'Nosso Propósito',
    title: 'Por que escolher nossos serviços em dados?',
    columns: '4' as const,
    variant: 'card' as const,
    headerWidth: 'narrow' as const,
    items: PORQUE_ESCOLHER.map((s) => ({ icon: 'target' as const, title: s })),
  },
  {
    blockType: 'ctaBanner' as const,
    borda: 'topo' as const,
    title: 'Vem ser ATRA',
    description:
      'Faça parte de um time focado em soluções tecnológicas e de uma empresa eleita como uma das melhores para se trabalhar no Brasil.',
    cta: { label: 'Confira nossas vagas disponíveis', href: '/carreiras' },
    variant: 'subtle' as const,
  },
]

const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'sobre' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Sobre a ATRA', slug: 'sobre', layout, _status: 'published' as const }

const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

/* O inglês precisa do layout inteiro **com os ids dos blocos já gravados**.
 *
 * Duas armadilhas em sequência, ambas pagas:
 *
 * 1. Enviar só título e slug deixa vazios os campos localizados que vivem
 *    dentro dos blocos, e o Payload reprova listando 30 obrigatórios.
 * 2. Enviar o layout **sem os ids** faz o Payload tratar cada bloco como novo:
 *    ele recria as linhas, e os valores em português ficam órfãos. O sintoma é
 *    silencioso e confunde — a página renderiza, com a estrutura certa e todo
 *    texto localizado em branco. Foi o que escondeu ~800px de conteúdo.
 *
 * Por isso relê o documento gravado e casa os ids por posição antes de escrever
 * o inglês.
 *
 * O texto repete o português por ora: o legado traduz navegação, não conteúdo
 * (P-08). Entra na fila de tradução. */
/* Casa ids por posição, **inclusive das linhas de array dentro do bloco**.
 * `items` e `ctas` também têm id próprio: sem eles o Payload recria as linhas e
 * o texto em português dos cards some, mesmo com o bloco preservado. */
function casarIds<T>(novo: T, gravado: unknown): T {
  if (Array.isArray(novo)) {
    const antigo = Array.isArray(gravado) ? gravado : []
    return novo.map((item, i) => casarIds(item, antigo[i])) as T
  }
  if (novo && typeof novo === 'object') {
    const antigo = (gravado ?? {}) as Record<string, unknown>
    const saida: Record<string, unknown> = { ...(novo as Record<string, unknown>) }
    if (antigo.id !== undefined) saida.id = antigo.id
    for (const [chave, valor] of Object.entries(saida)) {
      if (chave !== 'id' && valor && typeof valor === 'object') {
        saida[chave] = casarIds(valor, antigo[chave])
      }
    }
    return saida as T
  }
  return novo
}

const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
const comIds = casarIds(layout, gravado.layout)

await payload.update({
  collection: 'pages',
  id: doc.id,
  data: { title: 'About ATRA', slug: 'about', layout: comIds },
  locale: 'en',
})
console.log(`  sobre (${layout.length} blocos)`)
process.exit(0)

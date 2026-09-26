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
 * ⚠️ Os 4 logos da vitrine são os PNGs do WordPress que o legado usa
 * (`About.tsx:384`), baixados para `scripts/seed/assets/parceiros/` em MIG-071.
 * Antes disso eram os SVGs de `legacy/public/imgs/`, que não são a marca: são
 * aproximações desenhadas à mão, com o nome em Arial e proporção 4:1. Como a
 * altura é fixa e a largura sai do aspecto (`w-auto`), o desenho saía com a
 * caixa errada além de a marca estar errada.
 *
 * A pasta guarda os **9** parceiros do carrossel do legado
 * (`logo-clouds.tsx:27`), não só os 4 daqui. AWS, Denodo, BigID e IBM ficam
 * sem seed até MIG-059 (a home), porque a collection exige `description` e
 * escrever esse texto é decisão do marketing (D-22) — o arquivo está aqui para
 * a task não precisar voltar ao WordPress. Baixar de lá exige user-agent de
 * browser: sem ele o site responde 403 em HTML com status 200, e é para isso
 * que existe `WP_USER_AGENT` em `scripts/wp-import/types.ts`.
 *
 * As fotos do herói são as mesmas de `legacy/public/fotos/` (MIG-049a). A do
 * bloco "quem somos" é uma delas: no legado ali há um hotlink do Unsplash —
 * foto de banco que não é da ATRA —, e usar uma foto real da empresa é melhor
 * conteúdo pelo mesmo custo.
 */
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { midiaDe } from './midia'
import { casarIds } from './ids'

const LEGADO = path.resolve(process.cwd(), '../legacy')

/* Rótulos exatos de `legacy/src/locales/pt.json`, chave `aboutStats`. Os que eu
 * tinha escrito de cabeça ("Clientes" em vez de "clientes de diversos
 * segmentos") não quebravam linha, e o card ficava 15px mais baixo. */
/* ⚠️ `pending` é o placeholder marcado que MIG-072 exige: são os 3 números em
 * que a home e /sobre discordam (P-01). Valem os de /sobre, que é a página
 * comparada pelo gate; a marca faz o admin avisar quem for publicar que houve
 * escolha, em vez de o número em disputa parecer conferido. */
const METRICAS = [
  { value: 15, suffix: '+', label: 'anos no mercado' },
  { value: 140, suffix: '+', label: 'profissionais', pending: true },
  { value: 30, suffix: '+', label: 'clientes de diversos segmentos', pending: true },
  { value: 9, suffix: '', label: 'parceiros estratégicos' },
  { value: 4, suffix: 'x', label: 'GPTW', pending: true },
]

/* `logoScale` em `md` para todos: o legado dava uma altura por logo
 * (`About.tsx:384`) para compensar a margem dos arquivos, e desde 26/09 eles
 * são recortados e o site iguala o peso pela proporção (`lib/logo.ts`). */
const PARCEIROS_DA_VITRINE = [
  { slug: 'microsoft-azure', name: 'Microsoft Azure', arquivo: 'scripts/seed/assets/parceiros/logo_azure.png', logoScale: 'md' as const },
  { slug: 'google-cloud', name: 'Google Cloud', arquivo: 'scripts/seed/assets/parceiros/logo_google_cloud.png', logoScale: 'md' as const },
  { slug: 'databricks', name: 'Databricks', arquivo: 'scripts/seed/assets/parceiros/logo_databricks.png', logoScale: 'md' as const },
  { slug: 'atlan', name: 'Atlan', arquivo: 'scripts/seed/assets/parceiros/logo_atlan.png', logoScale: 'md' as const },
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

/* Os dois delegam a midia.ts; a diferença entre eles é raiz e semântica:
 * `Local` resolve de web/ e **regrava** o arquivo quando o doc existe — sem
 * isso, MIG-071 não corrigiria um banco que já semeou os logos da vitrine como
 * SVG desenhado à mão (a nota completa está em midia.ts). O outro resolve de
 * legacy/ e só acha-ou-cria. */
const upsertMidiaLocal = (arquivo: string, alt: string) =>
  midiaDe(payload, path.resolve(process.cwd(), arquivo), alt, { regravar: true })
const upsertMidia = (arquivo: string, alt: string) => midiaDe(payload, path.join(LEGADO, arquivo), alt)

console.log('→ dados institucionais')
/* Os 3 selos de `Careers.tsx:306`, na ordem do legado. O LIPT é arquivo local
 * do protótipo; GPTW e FEEx eram hotlink do WordPress e vieram para
 * `scripts/seed/assets/selos/` em MIG-071.
 *
 * ⚠️ O arquivo do FEEx se chama `GPTW-Selos-site-1-768x768.png` no WordPress e
 * **não é o selo do GPTW**: são os selos FEEx/Clima Organizacional, de 2023 e
 * 2024. O legado também dá `alt="FEEx"` (`Careers.tsx:352`). Renomeado na
 * cópia para o nome não induzir a troca. */
const lipt = await upsertMidia('public/imgs/lipt-2026.png', 'Selo LIPT 2026 — Lugares Incríveis Para Trabalhar')
const gptw = await upsertMidiaLocal('scripts/seed/assets/selos/selo_gptw.jpg', 'Great Place To Work')
const feex = await upsertMidiaLocal('scripts/seed/assets/selos/selo_feex.png', 'FEEx')

await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'pt',
  data: {
    metrics: METRICAS,
    foundedYear: 2011,
    seals: [
      { name: 'Great Place To Work', image: gptw },
      { name: 'LIPT 2026', image: lipt },
      { name: 'FEEx', image: feex },
    ],
  },
})

console.log('→ fotos da ATRA')
const fotos: number[] = []
for (const f of FOTOS) fotos.push(await upsertMidia(f, 'Equipe e eventos da ATRA'))
console.log(`  ${fotos.length} fotos`)

console.log('→ parceiros da vitrine')
const ids: number[] = []
for (const p of PARCEIROS_DA_VITRINE) {
  const logo = await upsertMidiaLocal(p.arquivo, `Logo ${p.name}`)

  const { docs } = await payload.find({ collection: 'partners', where: { slug: { equals: p.slug } }, limit: 1, locale: 'pt', depth: 0 })
  const data = { name: p.name, slug: p.slug, description: 'Parceiro de tecnologia da ATRA.', logo, logoScale: p.logoScale }
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

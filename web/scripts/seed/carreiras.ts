/* Seed de /carreiras e das 6 vagas (MIG-050/051).
 *
 * Vagas de `legacy/src/pages/Careers.tsx:423`; a página reproduz a ordem das
 * seções do legado. Conteúdo em português; o inglês repete por ora (P-08).
 *
 * ⚠️ As vagas entram **publicadas mas sem corpo** — o legado só tem os títulos,
 * e a página de detalhe (MIG-051) trata a ausência de descrição com aviso, como
 * o blog. A candidatura é MIG-102 (P-17).
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const VAGAS = [
  'Engenheiro(a) de Dados SR',
  'Engenheiro(a) de Dados SR - Azure / Databricks',
  'Trainee Engenheiro de Data Analytics & AI',
  'Engenheiro(a) de Dados SR (DBT Core e GCP)',
  'Engenheiro Analytics Sr',
  'Engenheiro(a) de Dados - Looker Platform / LookML',
]

const paraSlug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })

console.log('→ vagas')
let n = 0
for (let i = 0; i < VAGAS.length; i++) {
  const title = VAGAS[i]
  const slug = paraSlug(title)
  const { docs } = await payload.find({ collection: 'jobs', where: { slug: { equals: slug } }, limit: 1, locale: 'pt', depth: 0 })
  const data = {
    title, slug, area: 'Engenharia de Dados', locationType: 'remote' as const,
    location: 'Brasil',
    summary: 'Faça parte do nosso time de elite em dados, IA e cloud.',
    publishedAt: new Date(2026, 0, 20 - i).toISOString(),
    _status: 'published' as const,
  }
  const doc = docs[0]
    ? await payload.update({ collection: 'jobs', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'jobs', data, locale: 'pt' })
  await payload.update({ collection: 'jobs', id: doc.id, data: { title, slug, area: 'Data Engineering', summary: data.summary }, locale: 'en' })
  n++
}
console.log(`  ${n} vagas`)

const jeitoAtra = [
  { icon: 'brain' as const, title: 'Aprendizado Contínuo', description: 'Proporcionamos um ambiente de aprendizado e crescimento contínuo.' },
  { icon: 'users' as const, title: 'Trabalho em Equipe', description: 'Atuamos em equipe, priorizando o relacionamento humano e a empatia.' },
  { icon: 'workflow' as const, title: 'Evolução Constante', description: 'Comprometimento com a evolução constante de processos e metodologias.' },
]

const processo = [
  { title: 'Candidate-se à vaga', description: 'Envie sua inscrição na vaga que melhor combina com seu perfil ou cadastre seu currículo no nosso banco de talentos.' },
  { title: 'Etapa RH & Cultura', description: 'Bate-papo online para alinhamento de expectativas, trajetória e identificação com o Jeito ATRA de ser.' },
  { title: 'Etapa Técnica', description: 'Entrevista prática com especialistas para avaliar hard skills, arquitetura e discutir soluções reais de dados.' },
  { title: 'Etapa Final & Proposta', description: 'Apresentação ao gestor da squad e envio da proposta formal de contratação com todos os benefícios.' },
]

const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Vagas Abertas & Banco de Talentos',
    chip: 'GPTW Certificado',
    title: 'Venha fazer parte de um time focado em soluções de dados',
    highlight: ['soluções de dados'],
    description: 'Aqui você pode alcançar todo o seu potencial profissional, ao lado de especialistas e numa das melhores empresas para se trabalhar no Brasil.',
    ctas: [{ label: 'Ver vagas abertas', href: '#trabalhe-conosco' }, { label: 'Nosso processo', href: '#processo-seletivo' }],
    mediaMode: 'none' as const,
  },
  { blockType: 'stickyPageNav' as const },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'jeito-atra',
    navLabel: 'Jeito ATRA de ser',
    eyebrow: 'Nossa Essência',
    title: 'O Jeito ATRA de ser',
    columns: '3' as const,
    variant: 'card' as const,
    headerWidth: 'narrow' as const,
    items: jeitoAtra,
  },
  {
    blockType: 'sealsBanner' as const,
    anchor: 'premiacoes',
    navLabel: 'Selos e Premiações',
    theme: 'surface-2' as const,
    borda: 'ambas' as const,
    title: 'Uma das melhores empresas para trabalhar no Brasil',
  },
  {
    blockType: 'processSteps' as const,
    anchor: 'processo-seletivo',
    navLabel: 'Processo Seletivo',
    eyebrow: 'Processo Seletivo',
    title: 'Como funciona o processo',
    description: 'Um processo estruturado e transparente, focado em conhecer o seu potencial e apresentar nossa cultura.',
    steps: processo,
  },
  {
    blockType: 'jobsList' as const,
    anchor: 'trabalhe-conosco',
    navLabel: 'Trabalhe Conosco',
    theme: 'surface-2' as const,
    borda: 'topo' as const,
    eyebrow: 'Oportunidades',
    title: 'Vagas Abertas',
    description: 'Venha desenvolver sua carreira e fazer parte do nosso time de elite.',
    emptyText: 'Nenhuma vaga aberta no momento. Deixe seu currículo no banco de talentos.',
  },
  {
    blockType: 'ctaContact' as const,
    title: 'Não encontrou a vaga ideal?',
    subtitle: 'Deixe seu currículo no nosso banco de talentos.',
    showContactCard: true,
  },
]

console.log('→ /carreiras')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'carreiras' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Trabalhe Conosco', slug: 'carreiras', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

/* Mesma armadilha de /sobre: o inglês precisa do layout com os ids gravados,
 * ou os campos localizados dos blocos ficam órfãos. */
function casarIds<T>(novo: T, gravado: unknown): T {
  if (Array.isArray(novo)) {
    const a = Array.isArray(gravado) ? gravado : []
    return novo.map((x, i) => casarIds(x, a[i])) as T
  }
  if (novo && typeof novo === 'object') {
    const a = (gravado ?? {}) as Record<string, unknown>
    const out: Record<string, unknown> = { ...(novo as Record<string, unknown>) }
    if (a.id !== undefined) out.id = a.id
    for (const [k, v] of Object.entries(out)) if (k !== 'id' && v && typeof v === 'object') out[k] = casarIds(v, a[k])
    return out as T
  }
  return novo
}
const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Careers', slug: 'careers', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log(`  carreiras (${layout.length} blocos)`)
process.exit(0)

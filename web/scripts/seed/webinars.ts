/* Seed dos 3 webinars (MIG-042).
 *
 * De `legacy/src/pages/Webinars.tsx:9`. Idempotente por slug.
 *
 * ⚠️ `dateLabel` sai igual ao legado, inclusive "Amanhã, 15:00" — que é texto
 * relativo e vai envelhecer. É o que está no ar; corrigir é decisão de conteúdo
 * (D-22), e agora dá para fazer pelo admin.
 *
 * ⚠️ `videoUrl` fica vazio: nenhum dos três tem vídeo no protótipo. A página de
 * detalhe (MIG-046) precisa lidar com isso.
 *
 * ⚠️ Capa é o marcador gerado — no legado são hotlinks do Unsplash.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Webinar = {
  title: string
  description: string
  dateLabel: string
  tags: string[]
  order: number
}

const WEBINARS: Webinar[] = [
  {
    title: 'Tendências Tecnológicas do Novo Mundo com Marcelo Madureira',
    description:
      'Uma conversa fascinante sobre como a computação quântica e a IA estão redefinindo limites.',
    dateLabel: 'Amanhã, 15:00',
    tags: ['Futurismo', 'Tech', 'Marcelo Madureira'],
    order: 0,
  },
  {
    title: 'Os impactos da Inteligência Artificial na Sociedade com Thiago Rolemberg',
    description:
      'Ética, trabalho e o novo contrato social na era da IA.',
    dateLabel: '10 de maio de 2026',
    tags: ['Ética', 'Sociedade', 'IA'],
    order: 1,
  },
  {
    title: 'Data Show: Como escalar seu Data Lakehouse',
    description:
      'Dicas práticas de arquitetura para grandes volumes de dados.',
    dateLabel: '20 de maio de 2026',
    tags: ['Data', 'Engineering', 'Scale'],
    order: 2,
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
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: 'capa-pendente' } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]
  return payload.create({
    collection: 'media',
    data: { alt: 'CAPA PENDENTE — imagem real entra com o conteúdo' },
    file: { data: readFileSync(CAPA), mimetype: 'image/png', name: 'capa-pendente.png', size: 0 },
    locale: 'pt',
  })
}

console.log('→ webinars')
const capa = await capaMarcadora()

for (const w of WEBINARS) {
  const slug = paraSlug(w.title)
  const { docs } = await payload.find({
    collection: 'webinars',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const data = {
    title: w.title,
    slug,
    description: w.description,
    dateLabel: w.dateLabel,
    coverImage: capa.id,
    tags: w.tags.map((name) => ({ name })),
    order: w.order,
    _status: 'published' as const,
  }

  const doc = docs[0]
    ? await payload.update({ collection: 'webinars', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'webinars', data, locale: 'pt' })

  await payload.update({
    collection: 'webinars',
    id: doc.id,
    data: { title: w.title, slug, description: w.description, dateLabel: w.dateLabel },
    locale: 'en',
  })
  console.log(`  ${slug}`)
}
process.exit(0)

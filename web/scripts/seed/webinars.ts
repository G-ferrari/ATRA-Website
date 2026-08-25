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
 * ⚠️ Capa é o marcador gerado — no legado são hotlinks do Unsplash. Com
 * `SEED_FIXTURES=1` a do protótipo entra no lugar, para a revisão interna —
 * ver `imagens-do-prototipo.ts`.
 */

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { slugify as paraSlug } from '../../src/fields/slug'
import { capaPendente } from './midia'
import { type ChaveDoPrototipo, imagemDoPrototipo } from './imagens-do-prototipo'

type Webinar = {
  title: string
  description: string
  dateLabel: string
  tags: string[]
  order: number
  /** A capa que o protótipo desenha, usada só com `SEED_FIXTURES=1`. */
  prototipo: ChaveDoPrototipo
}

const WEBINARS: Webinar[] = [
  {
    title: 'Tendências Tecnológicas do Novo Mundo com Marcelo Madureira',
    prototipo: 'webinar.tendencias-madureira',
    description:
      'Uma conversa fascinante sobre como a computação quântica e a IA estão redefinindo limites.',
    dateLabel: 'Amanhã, 15:00',
    tags: ['Futurismo', 'Tech', 'Marcelo Madureira'],
    order: 0,
  },
  {
    title: 'Os impactos da Inteligência Artificial na Sociedade com Thiago Rolemberg',
    prototipo: 'webinar.ia-sociedade',
    description:
      'Ética, trabalho e o novo contrato social na era da IA.',
    dateLabel: '10 de maio de 2026',
    tags: ['Ética', 'Sociedade', 'IA'],
    order: 1,
  },
  {
    title: 'Data Show: Como escalar seu Data Lakehouse',
    prototipo: 'webinar.data-show-lakehouse',
    description:
      'Dicas práticas de arquitetura para grandes volumes de dados.',
    dateLabel: '20 de maio de 2026',
    tags: ['Data', 'Engineering', 'Scale'],
    order: 2,
  },
]



const payload = await getPayload({ config })


console.log('→ webinars')
const capa = await capaPendente(payload)

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
    coverImage: (await imagemDoPrototipo(payload, w.prototipo, w.title)) ?? capa,
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

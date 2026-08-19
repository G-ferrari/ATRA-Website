/* Seed de /contato (MIG-053, D-10).
 *
 * Rota **nova**: no legado /contato é link quebrado (aponta para `#fale-conosco`
 * na home). A página é o bloco de contato, sozinho — o mesmo que fecha várias
 * outras páginas. O formulário está desabilitado até MIG-100 (P-14, P-18).
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Fale com a ATRA',
    title: 'Vamos construir o próximo nível do seu negócio?',
    highlight: ['próximo nível'],
    description: 'Conte o seu desafio de dados. Nossos especialistas respondem com um caminho concreto para o que você já tem hoje.',
    mediaMode: 'none' as const,
  },
  {
    blockType: 'ctaContact' as const,
    theme: 'surface-2' as const,
    title: 'Comece seu projeto de dados',
    subtitle: 'Preencha e a gente retorna. Ou fale direto pelos canais ao lado.',
    showContactCard: true,
  },
]

console.log('→ /contato')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'contato' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Contato', slug: 'contato', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

function casarIds<T>(novo: T, gravado: unknown): T {
  if (Array.isArray(novo)) { const a = Array.isArray(gravado) ? gravado : []; return novo.map((x, i) => casarIds(x, a[i])) as T }
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
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Contact', slug: 'contact', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log('  contato (2 blocos)')
process.exit(0)

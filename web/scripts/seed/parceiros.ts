/* Seed da página do parceiro Google Cloud (MIG-054).
 *
 * O legado tem uma página de parceiro (`PartnerGoogleCloud.tsx`), montada por um
 * `PartnerPageBase` fixo. Aqui ela vira blocos guardados no próprio parceiro, e
 * a mesma estrutura serve qualquer parceiro com `hasPage`.
 *
 * O parceiro `google-cloud` já existe (semeado em cases.ts); este seed só liga
 * `hasPage` e grava o layout. Conteúdo de `legacy/src/locales/pt.json`.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

const beneficios = [
  'Certificação oficial pela Google Cloud, garantindo qualidade e segurança.',
  'Soluções personalizadas que atendem às necessidades exclusivas do seu negócio.',
  'Acesso a soluções avançadas e inovação contínua.',
  'Alinhamento com as melhores práticas globais em cloud computing.',
  'Acompanhamento completo durante toda a jornada na nuvem.',
]

const especializacoes = [
  'Infrastructure', 'Workplace Transformation', 'Consulting Partner',
  'Data Analytics', 'Application Development', 'Cloud Migration', 'Managed Service Provider',
]

const paragrafos = (...ts: string[]) => ({
  root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
    children: ts.map((t) => ({ type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0,
      children: [{ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] })) } })

const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Google Cloud Partner',
    title: 'ATRA / Google Cloud Partner',
    highlight: ['ATRA'],
    description: 'Quer agilidade, inovação e resultados? Conheça o Google Cloud com a expertise ATRA.',
    ctas: [{ label: 'Fale com um especialista', href: '/contato' }],
    mediaMode: 'none' as const,
  },
  {
    blockType: 'richTextSection' as const,
    eyebrow: 'Sobre a parceria',
    title: 'Parceria estratégica para sua transformação digital!',
    body: paragrafos(
      'O Google Cloud é a plataforma de nuvem do Google que oferece serviços de dados, inteligência artificial e colaboração para empresas de todos os portes.',
      'Como parceiro certificado, a ATRA compreende suas necessidades e transforma desafios em resultados concretos na nuvem.',
    ),
    imagePosition: 'none' as const,
    ctas: [],
  },
  {
    blockType: 'iconCardGrid' as const,
    theme: 'surface-2' as const,
    borda: 'ambas' as const,
    eyebrow: 'Benefícios',
    title: 'Por que escolher um Google Cloud Partner?',
    columns: '3' as const,
    variant: 'card' as const,
    headerWidth: 'narrow' as const,
    items: beneficios.map((b) => ({ icon: 'shield' as const, title: b })),
  },
  {
    blockType: 'iconCardGrid' as const,
    eyebrow: 'Especializações',
    title: 'Nossas especializações',
    columns: '4' as const,
    variant: 'compact' as const,
    headerWidth: 'narrow' as const,
    items: especializacoes.map((e) => ({ icon: 'cloud' as const, title: e })),
  },
  {
    blockType: 'ctaBanner' as const,
    borda: 'topo' as const,
    title: 'Pronto para migrar, modernizar e inovar?',
    description: 'A ATRA está preparada para ajudar sua empresa a fazer isso com o Google Cloud.',
    cta: { label: 'Fale com a gente', href: '/contato' },
    variant: 'subtle' as const,
  },
]

console.log('→ /parceiros/google-cloud')
const { docs } = await payload.find({ collection: 'partners', where: { slug: { equals: 'google-cloud' } }, limit: 1, locale: 'pt', depth: 0 })
if (!docs[0]) {
  console.error('  ✖ parceiro google-cloud não existe — rode cases.ts antes.')
  process.exit(1)
}
const doc = await payload.update({ collection: 'partners', id: docs[0].id, data: { hasPage: true, layout }, locale: 'pt' })

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
const gravado = await payload.findByID({ collection: 'partners', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'partners',
  id: doc.id,
  data: {
    // description é localized e obrigatório; o parceiro nasceu só em PT (cases.ts).
    description: 'Technology partner of ATRA.',
    layout: casarIds(layout, gravado.layout),
  },
  locale: 'en',
})
console.log(`  google-cloud (${layout.length} blocos)`)
process.exit(0)

/* Fixture de teste dos segmentos e da página legal — **não é conteúdo**.
 *
 * As 8 verticais e `/politicas-e-termos` existem só no WordPress (D-17), e o
 * conteúdo de verdade entra por `scripts/wp-import/import-segments.ts` e
 * `import-politicas.ts`. O que este arquivo cria é o mínimo para a suíte de e2e
 * exercitar `/segmentos`, `/segmentos/[slug]` e a página legal sem depender de
 * rede — o CI monta o banco só com `pnpm seed`.
 *
 * ⚠️ **Só roda com `SEED_FIXTURES=1`**, que o CI liga e mais ninguém. Num banco
 * de verdade, uma política de privacidade de mentira no ar é pior do que rota
 * nenhuma: é documento jurídico que o visitante lê como se valesse.
 *
 * Rodar o importador por cima é seguro e é o caminho normal: ele casa pelo mesmo
 * slug e substitui o texto pelo do WordPress.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

if (!process.env.SEED_FIXTURES) {
  console.log('→ segmentos (pulados: fixture de teste, exige SEED_FIXTURES=1 — os reais vêm de scripts/wp-import)')
  process.exit(0)
}

const VERTICAIS = [
  { slug: 'bancos-seguradoras-servicos-financeiros', nome: 'Bancos, Seguradoras e Serviços Financeiros', icone: 'building' },
  { slug: 'educacao', nome: 'Educação', icone: 'graduation-cap' },
  { slug: 'industria', nome: 'Indústria', icone: 'settings' },
  { slug: 'logistica', nome: 'Logística', icone: 'workflow' },
  { slug: 'saude', nome: 'Saúde', icone: 'heart' },
  { slug: 'telecom', nome: 'Telecom', icone: 'server' },
  { slug: 'utilidades', nome: 'Utilidades', icone: 'zap' },
  { slug: 'varejo', nome: 'Varejo', icone: 'trending-up' },
] as const

/* ⚠️ Uma vertical em **rascunho**, de propósito, e é a única razão de ela
 * existir: provar que rascunho não vaza para o site.
 *
 * A Local API do Payload roda com `overrideAccess: true`, então o `access.read`
 * que esconde rascunho do público **não se aplica** a consulta de página. O
 * defeito ficou meses invisível porque nada estava em rascunho, e só apareceu
 * quando MIG-093 pôs 12 soluções nesse estado — o índice passou a listar 18. */
const RASCUNHO = { slug: 'rascunho-que-nao-pode-vazar', nome: 'Rascunho que não pode vazar', icone: 'shield' } as const

const payload = await getPayload({ config })

console.log('→ segmentos (fixtures de teste)')
for (const [ordem, v] of VERTICAIS.entries()) {
  const chamada = `Texto de exemplo. O conteúdo real de ${v.nome} vem do WordPress (MIG-092).`
  const layout = [
    {
      blockType: 'pageHero' as const,
      badge: 'Segmento',
      title: v.nome,
      description: chamada,
      align: 'left' as const,
      mediaMode: 'none' as const,
    },
  ]
  const dados = {
    name: v.nome,
    slug: v.slug,
    icon: v.icone,
    shortDescription: chamada,
    layout: layout as never,
    order: ordem,
    _status: 'published' as const,
  }

  const { docs } = await payload.find({ collection: 'segments', where: { slug: { equals: v.slug } }, limit: 1, locale: 'pt', depth: 0 })
  const doc = docs[0]
    ? await payload.update({ collection: 'segments', id: docs[0].id, data: dados, locale: 'pt' })
    : await payload.create({ collection: 'segments', data: dados, locale: 'pt' })

  /* O inglês reenvia o layout com os ids casados: atualizar documento publicado
   * revalida os obrigatórios do idioma gravado, e bloco vazio em `en` é
   * recusado. Ver a nota em `wp-import/import-segments.ts`. */
  const gravado = await payload.findByID({ collection: 'segments', id: doc.id, locale: 'pt', depth: 0 })
  await payload.update({
    collection: 'segments',
    id: doc.id,
    locale: 'en',
    data: { name: v.nome, slug: v.slug, shortDescription: chamada, layout: casarIds(layout, gravado.layout) as never },
  })
}
const { docs: jaExiste } = await payload.find({ collection: 'segments', where: { slug: { equals: RASCUNHO.slug } }, limit: 1, locale: 'pt', depth: 0 })
const dadosRascunho = {
  name: RASCUNHO.nome,
  slug: RASCUNHO.slug,
  icon: RASCUNHO.icone,
  shortDescription: 'Se isto aparecer no site, o filtro de `_status` sumiu de alguma consulta.',
  order: 99,
  _status: 'draft' as const,
}
if (jaExiste[0]) {
  await payload.update({ collection: 'segments', id: jaExiste[0].id, data: dadosRascunho, locale: 'pt', draft: true })
} else {
  await payload.create({ collection: 'segments', data: dadosRascunho, locale: 'pt', draft: true })
}

console.log(`  ${VERTICAIS.length} segmentos + 1 rascunho de controle`)

console.log('→ /politicas-e-termos (fixture de teste)')
const AVISO = 'Texto de exemplo. O documento real vem do WordPress (MIG-094) e é pré-requisito de LGPD.'
const layoutLegal = [
  {
    blockType: 'pageHero' as const,
    badge: 'Legal',
    title: 'Políticas e Termos',
    description: AVISO,
    align: 'left' as const,
    mediaMode: 'none' as const,
  },
]
const { docs: legais } = await payload.find({ collection: 'pages', where: { slug: { equals: 'politicas-e-termos' } }, limit: 1, locale: 'pt', depth: 0 })
const dadosLegais = { title: 'Políticas e Termos', slug: 'politicas-e-termos', layout: layoutLegal as never, _status: 'published' as const }
const legal = legais[0]
  ? await payload.update({ collection: 'pages', id: legais[0].id, data: dadosLegais, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dadosLegais, locale: 'pt' })

const gravadoLegal = await payload.findByID({ collection: 'pages', id: legal.id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'pages',
  id: legal.id,
  locale: 'en',
  data: { title: 'Privacy and Terms', slug: 'privacy-and-terms', layout: casarIds(layoutLegal, gravadoLegal.layout) as never },
})
console.log('  1 página')

process.exit(0)

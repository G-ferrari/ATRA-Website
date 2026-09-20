/* Fixture de teste das 12 soluções vindas do WordPress — **não é conteúdo**.
 *
 * O conteúdo de verdade entra por `scripts/wp-import/import-solutions.ts`, que
 * lê o WordPress. O que este arquivo cria é o mínimo para a suíte de e2e
 * exercitar `/solucoes` com as 18 ofertas que MIG-093 pôs no ar, sem depender
 * de rede — o CI monta o banco só com `pnpm seed`.
 *
 * ⚠️ **Por que a fixture existe, e não bastava rodar o importador no CI.** O
 * cache do WordPress são 158 MB e está no `.gitignore`; sem ele o importador
 * vai à rede, e o CI passaria a depender de um site que sai do ar na MIG-136.
 * O smoke ficou vermelho exatamente nesse buraco: o teste afirma 18 soluções
 * (correto — P-16 foi respondida em 21/08 com "publicar"), e o banco do CI só
 * tinha as 6 que `solucoes.ts` cria.
 *
 * ⚠️ **Só roda com `SEED_FIXTURES=1`**, que o CI liga e mais ninguém. Rodar
 * isto num banco de verdade escreveria texto de exemplo por cima das 12 páginas
 * reais — a casagem é por slug, e os slugs são os mesmos.
 *
 * Rodar o importador por cima é seguro e é o caminho normal: ele casa pelo
 * mesmo slug e substitui o texto pelo do WordPress.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

if (!process.env.SEED_FIXTURES) {
  console.log('→ soluções do WP (puladas: fixture de teste, exige SEED_FIXTURES=1 — as reais vêm de scripts/wp-import)')
  process.exit(0)
}

/* Slug, categoria e ícone são cópia de `wp-import/import-solutions.ts`, de
 * propósito: são a parte **estrutural** do mapeamento (a espinha do mega-menu),
 * não a editorial. Se as duas listas divergirem, o CI passa a testar um índice
 * que não existe. */
const SOLUCOES = [
  { slug: 'cloud', titulo: 'Cloud', categoria: 'data-bi', icone: 'cloud' },
  { slug: 'data-integration', titulo: 'Data Integration', categoria: 'data-bi', icone: 'workflow' },
  { slug: 'data-analytics', titulo: 'Data Analytics', categoria: 'data-bi', icone: 'chart' },
  { slug: 'master-data-management', titulo: 'Master Data Management', categoria: 'data-bi', icone: 'database' },
  { slug: 'data-discovery', titulo: 'Data Discovery', categoria: 'data-bi', icone: 'search' },
  { slug: 'customer-360', titulo: 'Customer 360', categoria: 'data-bi', icone: 'users' },
  { slug: 'governanca-de-dados', titulo: 'Governança de Dados', categoria: 'governance-culture', icone: 'shield' },
  { slug: 'treinamento', titulo: 'Treinamento', categoria: 'governance-culture', icone: 'graduation-cap' },
  { slug: 'alocacao-de-consultores', titulo: 'Alocação de Consultores', categoria: 'governance-culture', icone: 'user-check' },
  { slug: 'fabrica-de-transformacao-de-dados', titulo: 'Fábrica de Transformação de Dados', categoria: 'innovation-ai', icone: 'settings' },
  { slug: 'sustentacao-remota', titulo: 'Sustentação Remota', categoria: 'innovation-ai', icone: 'headset' },
  { slug: 'assessoria-em-produtos', titulo: 'Assessoria em Produtos', categoria: 'innovation-ai', icone: 'award' },
] as const

const payload = await getPayload({ config })

console.log('→ soluções do WP (fixtures de teste)')
for (const [i, s] of SOLUCOES.entries()) {
  const chamada = `Texto de exemplo. O conteúdo real de ${s.titulo} vem do WordPress (MIG-093).`

  /* ⚠️ `hasPage: true` nas 12, e é o que o smoke conta: 13 links no índice —
   * estas mais `inteligencia-artificial`, a única das 6 do protótipo com página
   * própria. Sem o `layout`, `/solucoes/<slug>` responderia 200 vazia. */
  const layout = [
    {
      blockType: 'pageHero' as const,
      badge: 'Solução',
      title: s.titulo,
      description: chamada,
      align: 'left' as const,
      mediaMode: 'none' as const,
    },
  ]

  /* `order` começa em 10 para as 12 caírem depois das 6 do protótipo dentro de
   * cada categoria, que usam 0 e 1. */
  const comuns = {
    category: s.categoria,
    icon: s.icone,
    order: 10 + i,
    hasPage: true,
    _status: 'published' as const,
  }

  const { docs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: s.slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const dados = { ...comuns, title: s.titulo, slug: s.slug, shortDescription: chamada, layout: layout as never }
  const doc = docs[0]
    ? await payload.update({ collection: 'solutions', id: docs[0].id, data: dados, locale: 'pt' })
    : await payload.create({ collection: 'solutions', data: dados, locale: 'pt' })

  /* O inglês reenvia o layout com os ids casados: atualizar documento publicado
   * revalida os obrigatórios do idioma gravado, e bloco vazio em `en` é
   * recusado. Mesma nota de `segmentos.ts`.
   *
   * ⚠️ O slug vai nos dois idiomas. Com `fallback: true` a leitura resolve, mas
   * a **consulta** de `/en/<coleção>/<slug>` bate na coluna do locale — se ela
   * ficar nula, a rota dá 404. */
  const gravado = await payload.findByID({ collection: 'solutions', id: doc.id, locale: 'pt', depth: 0 })
  await payload.update({
    collection: 'solutions',
    id: doc.id,
    locale: 'en',
    data: {
      ...comuns,
      title: s.titulo,
      slug: s.slug,
      shortDescription: chamada,
      layout: casarIds(layout, gravado.layout) as never,
    },
  })
}
console.log(`  ${SOLUCOES.length} soluções (total no índice: 18)`)

process.exit(0)

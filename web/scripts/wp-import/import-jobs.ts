/* MIG-085 — importação das vagas do WordPress.
 *
 * As vagas são páginas comuns do WP, montadas no Elementor (P-02). O que este
 * script faz de diferente do de posts é recortar o miolo da página: o
 * `content.rendered` traz cabeçalho do template, banner e o formulário de
 * candidatura junto com a vaga. Ver `vagas.ts`.
 *
 * ⚠️ **As vagas entram sem área** (P-28): o WordPress não tem o dado e o RH
 * decidiu manter assim. Ver a nota em `vagas.ts`.
 *
 * ⚠️ **São 7 vagas, não 6.** O plano e `seo-e-redirects.md` falam em 6, que era
 * o número quando o sitemap foi levantado (17/08/2026); `cientista-de-dados-pl-sr`
 * foi publicada em 20/08. O script lê o que o WordPress tem hoje, e imprime a
 * lista para a divergência não passar batido.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-jobs.ts
 *   --remover-fixtures  apaga as vagas do protótipo que não vieram do WP
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { slugify } from '../../src/fields/slug'
import { createWpClient } from './client'
import { criarConversor } from './convert'
import { decodificar, encurtar, textoPuro } from './texto'
import type { WpPage } from './types'
import { corpoDaVaga, modeloDeTrabalho } from './vagas'

const REMOVER_FIXTURES = process.argv.includes('--remover-fixtures')

/**
 * Uma página do WP é vaga quando tem o cabeçalho do template de vaga.
 *
 * ⚠️ Identificar por lista de slugs escrita à mão envelheceria na primeira vaga
 * nova — foi assim que o plano ficou falando em 6 quando já eram 7. O marcador
 * `#vemserATRA` está nas 7 e em nenhuma das outras 46 páginas.
 */
const MARCADOR_DE_VAGA = /#vemserATRA/i

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ baixando as páginas do WordPress')
const paginas = await cliente.pages({ _fields: 'id,slug,date,title,content,link,status' })
const vagas = paginas.filter((p) => MARCADOR_DE_VAGA.test(p.content.rendered))
console.log(`  ${paginas.length} páginas · ${vagas.length} são vagas`)

const converter = await criarConversor()
const tocados = new Set<number>()
const falhas: string[] = []
let criadas = 0
let atualizadas = 0

async function importar(pagina: WpPage): Promise<void> {
  const titulo = decodificar(pagina.title.rendered).trim()
  const html = corpoDaVaga(pagina.content.rendered, titulo)
  if (!html.trim()) throw new Error('corpo vazio depois de recortar o template')

  const { raiz } = converter(html)
  const texto = textoPuro(html)

  /* Normalizado aqui pelo mesmo motivo dos posts: `%` no slug do WP é curinga
   * na checagem de unicidade. Ver a nota em `import-posts.ts`. */
  const slug = slugify(pagina.slug)

  const dados = {
    title: titulo,
    slug,
    /* ⚠️ `area` vai **vazia**, de propósito (P-28): o WordPress não tem o dado e
     * o RH decidiu manter assim por ora. `null` e não `undefined` — precisa
     * apagar o que a importação anterior deduziu, e `undefined` seria ignorado
     * pelo Payload em vez de limpar o campo. */
    area: null,
    locationType: modeloDeTrabalho(texto),
    /* `location` fica vazio de propósito: a cidade aparece no meio da frase
     * ("Híbrido – São Paulo/SP (3 dias presenciais)"), e extrair topônimo de
     * texto corrido erra calado. O campo é opcional; quem souber preenche. */
    summary: encurtar(texto),
    body: { root: raiz } as never,
    publishedAt: pagina.date,
    _status: 'published' as const,
  }

  const { docs } = await payload.find({
    collection: 'jobs',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const doc = docs[0]
    ? await payload.update({ collection: 'jobs', id: docs[0].id, data: dados, locale: 'pt' })
    : await payload.create({ collection: 'jobs', data: dados, locale: 'pt' })

  /* Mesmo motivo dos posts: sem slug em `en`, `/en/careers/<slug>` dá 404. O
   * `fallback` resolve a leitura, não a consulta por slug. */
  await payload.update({
    collection: 'jobs',
    id: doc.id,
    data: { title: dados.title, slug: dados.slug, area: dados.area, summary: dados.summary },
    locale: 'en',
  })

  tocados.add(doc.id)
  if (docs[0]) atualizadas++
  else criadas++
  console.log(`  ${titulo.padEnd(46)} ${dados.locationType}`)
}

console.log('\n→ importando')
for (const v of vagas) {
  try {
    await importar(v)
  } catch (erro) {
    falhas.push(`${v.slug}: ${erro instanceof Error ? erro.message : String(erro)}`)
  }
}

console.log(`\n  ${criadas} criadas · ${atualizadas} atualizadas · ${falhas.length} falhas`)
for (const f of falhas) console.log(`  ✗ ${f}`)

const { docs: todas } = await payload.find({ collection: 'jobs', limit: 200, locale: 'pt', depth: 0 })
const fixtures = todas.filter((d) => !tocados.has(d.id))

if (fixtures.length && !REMOVER_FIXTURES) {
  console.log(`\n  ⚠ ${fixtures.length} vagas fora do WordPress (fixtures do protótipo):`)
  for (const f of fixtures) console.log(`      ${f.slug}`)
  console.log('      rode com --remover-fixtures para apagá-las')
} else if (fixtures.length) {
  /* ⚠️ Vaga fechada normalmente é **despublicada**, não apagada, para o link não
   * quebrar (é o que a descrição da collection manda). Aqui é outro caso: as 6
   * do protótipo nunca estiveram no ar, são fixture do aceite visual, e o link
   * delas não existe em lugar nenhum para quebrar. */
  for (const f of fixtures) await payload.delete({ collection: 'jobs', id: f.id })
  console.log(`\n  ${fixtures.length} vagas do protótipo removidas`)
}

console.log(falhas.length ? '\n✗ importação com falhas' : '\n✓ importação completa')
process.exit(falhas.length ? 1 : 0)

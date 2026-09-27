/* MIG-093 — importação das páginas de solução do WordPress.
 *
 * ⚠️ **A task diz "expandir de 6 para 13", e as 13 não são uma expansão das 6.**
 *
 * Medido: as 6 no ar vêm do protótipo e são consolidadas e assinadas pela ATRA
 * — "Engenharia de Dados & Cloud", "Business Intelligence & Advanced
 * Analytics", "Cultura de Dados". As 13 do WordPress são o catálogo anterior,
 * mais fino e com vocabulário de fornecedor — "Master Data Management",
 * "Data Discovery", "Customer 360", páginas que citam a Informatica no corpo.
 * Uma não é subconjunto da outra: são dois jeitos de nomear a mesma oferta.
 *
 * Escolher entre eles era **P-16**, e é decisão de posicionamento (D-22).
 *
 * ✅ **P-16 respondida em 21/08/2026: publicar.** As 12 entram publicadas, ao
 * lado das 6 do protótipo — o menu passa a listar 18 ofertas. Elas ficaram em
 * rascunho enquanto a pergunta estava aberta, e foi por isso que a decisão
 * custou um `_status`, não uma reimportação.
 *
 * ⚠️ `inteligencia-artificial` fica **de fora**: o slug já é o da solução
 * portada do protótipo, que é a única com página e a única sob gate visual
 * (`/solucoes/inteligencia-artificial`). Importar por cima trocaria conteúdo
 * aprovado por uma página de 2024 do WordPress.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-solutions.ts
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { up as montarAlocacao } from '../../src/migrations/20260926_171500_alocacao_de_consultores'
import { up as montarSolucoesDoWordpress } from '../../src/migrations/20260927_220000_solucoes_do_wordpress'
import { slugify } from '../../src/fields/slug'
import { casarIds } from '../seed/ids'
import { createWpClient } from './client'
import { criarConversor } from './convert'
import { conteudoDeSolucao } from './paginas-wp'
import { decodificar, encurtar } from './texto'

/* As 12, com a categoria do mega-menu e o ícone. Categoria e ícone são o que o
 * WordPress não tem — e são escolha estrutural, não editorial: as 3 categorias
 * são a espinha do menu e já existem. Onde a leitura for discutível, é P-16 que
 * decide, e a solução está em rascunho justamente por isso. */
const SOLUCOES = [
  { slug: 'cloud', categoria: 'data-bi', icone: 'cloud' },
  { slug: 'data-integration', categoria: 'data-bi', icone: 'workflow' },
  { slug: 'data-analytics', categoria: 'data-bi', icone: 'chart' },
  { slug: 'master-data-management', categoria: 'data-bi', icone: 'database' },
  { slug: 'data-discovery', categoria: 'data-bi', icone: 'search' },
  { slug: 'customer-360', categoria: 'data-bi', icone: 'users' },
  { slug: 'governanca-de-dados', categoria: 'governance-culture', icone: 'shield' },
  { slug: 'treinamento', categoria: 'governance-culture', icone: 'graduation-cap' },
  { slug: 'alocacao-de-consultores', categoria: 'governance-culture', icone: 'user-check' },
  { slug: 'fabrica-de-transformacao-de-dados', categoria: 'innovation-ai', icone: 'settings' },
  { slug: 'sustentacao-remota', categoria: 'innovation-ai', icone: 'headset' },
  { slug: 'assessoria-em-produtos', categoria: 'innovation-ai', icone: 'award' },
] as const

/** Máximo do campo `shortDescription`, que alimenta o card e o mega-menu. */
const MAX_CHAMADA = 220

/**
 * As 6 soluções portadas do protótipo. **A importação nunca escreve nelas.**
 *
 * ⚠️ A guarda é uma lista explícita, e não "recuse se já está publicada": desde
 * que P-16 foi respondida as 12 do WordPress também ficam publicadas, e a
 * segunda regra passaria a impedir a própria reimportação. O que precisa de
 * proteção é conteúdo **aprovado no aceite visual** — `inteligencia-artificial`
 * é a única com página e a única sob gate, e trocá-la por uma página de 2024 do
 * WordPress passaria despercebido até o gate reprovar.
 */
const PORTADAS_DO_PROTOTIPO = new Set([
  'inteligencia-artificial',
  'apps-e-solucoes-digitais',
  'engenharia-de-dados-e-cloud',
  'business-intelligence-e-advanced-analytics',
  'governanca-de-dados-e-finops',
  'cultura-de-dados',
])

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ baixando as páginas do WordPress')
const paginas = await cliente.pages({ _fields: 'id,slug,date,title,content,link' })
const converter = await criarConversor()

let criadas = 0
let atualizadas = 0
let mantidas = 0
const falhas: string[] = []

for (const [ordem, solucao] of SOLUCOES.entries()) {
  const pagina = paginas.find((p) => p.slug === solucao.slug)
  if (!pagina) {
    falhas.push(`${solucao.slug}: não existe no WordPress`)
    continue
  }

  try {
    const titulo = decodificar(pagina.title.rendered).trim()
    const { chamada, corpo } = conteudoDeSolucao(pagina.content.rendered)
    if (!chamada) throw new Error('sem frase de abertura')
    if (!corpo.trim()) throw new Error('sem corpo depois de cortar o template')

    const { raiz } = converter(corpo)

    const layout = [
      {
        blockType: 'pageHero' as const,
        badge: 'Solução',
        title: titulo,
        description: chamada,
        align: 'left' as const,
        mediaMode: 'none' as const,
      },
      { blockType: 'richTextSection' as const, body: { root: raiz } as never },
      {
        blockType: 'ctaBanner' as const,
        title: 'Entre em contato com nossa equipe de especialistas',
        cta: { label: 'Fale com a gente', href: '/contato' },
        variant: 'primary' as const,
      },
    ]

    const dados = {
      title: titulo,
      slug: slugify(pagina.slug),
      category: solucao.categoria,
      icon: solucao.icone,
      shortDescription: encurtar(chamada, MAX_CHAMADA),
      hasPage: true,
      layout: layout as never,
      /* Ordem alta para não disputar posição com as 6 publicadas caso alguém
       * publique uma destas antes de P-16 ser respondida. */
      order: 100 + ordem,
      _status: 'published' as const,
    }

    if (PORTADAS_DO_PROTOTIPO.has(dados.slug)) {
      throw new Error('é uma das 6 portadas do protótipo — a importação não escreve nelas')
    }

    const { docs } = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: dados.slug } },
      limit: 1,
      locale: 'pt',
      depth: 0,
    })

    /* ⚠️ Só reescreve página que ainda seja a desta importação. Desde 26/09 as
     * páginas vindas daqui são remontadas por migração (Alocação no PR #50, as
     * outras 11 em `20260927_220000_solucoes_do_wordpress`) e depois editadas
     * no admin; rodar isto de novo apagaria as duas coisas sem aviso. Foi o que
     * aconteceu num banco local em 27/09, com a Alocação. */
    const formato = (docs[0]?.layout ?? []).map((b) => b.blockType).join(',')
    if (docs[0] && formato !== 'pageHero,richTextSection,ctaBanner') {
      mantidas++
      console.log(`  ${titulo.padEnd(38)} mantida (já remontada ou editada: ${formato || 'vazio'})`)
      continue
    }

    const doc = docs[0]
      ? await payload.update({ collection: 'solutions', id: docs[0].id, data: dados, locale: 'pt' })
      : await payload.create({ collection: 'solutions', data: dados, locale: 'pt' })

    /* O inglês reenvia o layout com `casarIds`, como em MIG-092: sem isso o
     * português fica órfão, e sem slug em `en` a rota não existe naquele
     * idioma. O texto repete o português (P-08). */
    const gravado = await payload.findByID({ collection: 'solutions', id: doc.id, locale: 'pt', depth: 0 })

    await payload.update({
      collection: 'solutions',
      id: doc.id,
      locale: 'en',
      data: {
        title: titulo,
        slug: dados.slug,
        shortDescription: dados.shortDescription,
        layout: casarIds(layout, gravado.layout) as never,
      },
    })

    if (docs[0]) atualizadas++
    else criadas++
    console.log(`  ${titulo.padEnd(38)} ${solucao.categoria}`)
  } catch (erro) {
    falhas.push(`${solucao.slug}: ${erro instanceof Error ? erro.message : String(erro)}`)
  }
}

console.log(`\n  ${criadas} criadas · ${atualizadas} atualizadas · ${mantidas} mantidas · ${falhas.length} falhas`)
for (const f of falhas) console.log(`  ✗ ${f}`)

/* ⚠️ Banco novo (dev local, restore limpo): as migrações de dados da Alocação
 * e das outras 11 rodam no `migrate`, antes de existir solução, e pulam — a
 * trava delas só age em página no formato desta importação, e aí a migração já
 * está marcada como feita. Chamá-las aqui fecha o ciclo: a página sai daqui já
 * remontada. Onde já foram montadas ou editadas, a trava as deixa como estão. */
console.log('\n→ remontando no padrão das páginas de solução')
await montarAlocacao({ payload } as never)
await montarSolucoesDoWordpress({ payload } as never)

const { totalDocs: publicadas } = await payload.find({
  collection: 'solutions',
  where: { _status: { equals: 'published' } },
  limit: 0,
  locale: 'pt',
  depth: 0,
})
console.log(`\n  ${publicadas} soluções publicadas no total`)
console.log(falhas.length ? '\n✗ importação com falhas' : '\n✓ importação completa')
process.exit(falhas.length ? 1 : 0)

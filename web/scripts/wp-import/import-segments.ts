/* MIG-092 — importação das 8 verticais do WordPress para `segments`.
 *
 * ⚠️ Estas páginas **não existem no protótipo** (D-17): o site novo cobria 20
 * rotas contra ~259 URLs indexadas, e as verticais estavam entre as que
 * sumiram. Não há gabarito visual para comparar — a página é montada com os
 * mesmos blocos de `/solucoes/[slug]`, sem componente novo.
 *
 * ⚠️ **P-16 em aberto.** A pergunta é se o sumiço dos segmentos foi decisão de
 * posicionamento do marketing ou simplificação de protótipo. Com a opção A de
 * D-17 escolhida (paridade antes do cutover), o padrão é restaurar — e
 * restaurar aqui **acrescenta**, não substitui: nenhuma rota do protótipo muda
 * de conteúdo por causa disto. É o oposto do que acontece em `solutions`, onde
 * as 13 do WP são outro vocabulário para as 6 que estão no ar.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-segments.ts
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { up as montarSegmentosDoWordpress } from '../../src/migrations/20260927_235930_segmentos_do_wordpress'
import { slugify } from '../../src/fields/slug'
import { casarIds } from '../seed/ids'
import { createWpClient } from './client'
import { conteudoDeSegmento, iconeDeItem } from './paginas-wp'
import { decodificar } from './texto'

/* As 8 verticais, na ordem em que o índice do WordPress as lista
 * (`/segmentos-atra/`), e o ícone de cada uma. O ícone é a única coisa aqui que
 * o WordPress não tem: as páginas dele não usam nenhum. */
const VERTICAIS = [
  { slug: 'bancos-seguradoras-servicos-financeiros', icone: 'building' },
  { slug: 'educacao', icone: 'graduation-cap' },
  { slug: 'industria', icone: 'settings' },
  { slug: 'logistica', icone: 'workflow' },
  { slug: 'saude', icone: 'heart' },
  { slug: 'telecom', icone: 'server' },
  { slug: 'utilidades', icone: 'zap' },
  { slug: 'varejo', icone: 'trending-up' },
] as const

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ baixando as páginas do WordPress')
const paginas = await cliente.pages({ _fields: 'id,slug,date,title,content,link' })

let criados = 0
let atualizados = 0
let mantidos = 0
const falhas: string[] = []

for (const [ordem, vertical] of VERTICAIS.entries()) {
  const pagina = paginas.find((p) => p.slug === vertical.slug)
  if (!pagina) {
    falhas.push(`${vertical.slug}: não existe no WordPress`)
    continue
  }

  try {
    const nome = decodificar(pagina.title.rendered).trim()
    const { chamada, grade, itens } = conteudoDeSegmento(pagina.content.rendered)

    if (!chamada) throw new Error('sem frase de abertura')
    if (itens.length === 0) throw new Error('nenhum card')

    const layout = [
      {
        blockType: 'pageHero' as const,
        badge: 'Segmento',
        title: nome,
        /* A frase de abertura entra como `description` e não como `subtitle`:
         * `subtitle` é a linha média do herói de /carreiras, maior que a
         * descrição — e o que o WordPress tem aqui é um parágrafo. */
        description: chamada,
        align: 'left' as const,
        mediaMode: 'none' as const,
      },
      {
        blockType: 'iconCardGrid' as const,
        eyebrow: grade?.titulo ?? null,
        title: grade?.intro ?? null,
        columns: (itens.length % 3 === 0 ? '3' : '2') as '2' | '3',
        variant: 'card' as const,
        items: itens.map((i) => ({
          icon: iconeDeItem(i.titulo, vertical.icone),
          title: i.titulo,
          description: i.texto,
        })),
      },
      {
        /* O rodapé do template do WordPress, que `conteudoDeSegmento` corta,
         * vira o fechamento da página — mas como bloco de verdade, ligado a
         * `/contato`, e não como um `<h2>` solto sem link. */
        blockType: 'ctaBanner' as const,
        title: 'Entre em contato com nossa equipe de especialistas',
        cta: { label: 'Fale com a gente', href: '/contato' },
        variant: 'primary' as const,
      },
    ]

    const dados = {
      name: nome,
      slug: slugify(pagina.slug),
      icon: vertical.icone,
      shortDescription: chamada,
      layout: layout as never,
      order: ordem,
      _status: 'published' as const,
    }

    const { docs } = await payload.find({
      collection: 'segments',
      where: { slug: { equals: dados.slug } },
      limit: 1,
      locale: 'pt',
      depth: 0,
    })

    /* ⚠️ Só reescreve segmento que ainda seja o desta importação. Desde 27/09
     * os 8 são remontados por `20260927_235930_segmentos_do_wordpress` e depois
     * editados no admin; rodar isto de novo apagaria as duas coisas sem aviso
     * — foi o que o importador de soluções fez com a Alocação num banco local. */
    const formato = (docs[0]?.layout ?? []).map((b) => b.blockType).join(',')
    /* O seed de teste deixa só o herói, com "Texto de exemplo": esse também
     * pode ser substituído — é para isso que a importação existe num banco local. */
    if (docs[0] && formato !== 'pageHero,iconCardGrid,ctaBanner' && formato !== 'pageHero') {
      mantidos++
      console.log(`  ${nome.padEnd(46)} mantido (já remontado ou editado)`)
      continue
    }

    const doc = docs[0]
      ? await payload.update({ collection: 'segments', id: docs[0].id, data: dados, locale: 'pt' })
      : await payload.create({ collection: 'segments', data: dados, locale: 'pt' })

    /* ⚠️ O inglês reenvia o **layout inteiro**, e não só nome e slug.
     *
     * Duas razões, e as duas custaram tempo. A primeira: `fallback: true`
     * resolve a leitura mas não a consulta por slug, e sem slug em `en` a rota
     * `/en/segments/<slug>` dá 404 (mesma armadilha de MIG-083). A segunda:
     * atualizar um documento **publicado** revalida os obrigatórios do idioma
     * que está sendo gravado — mandar só o nome faz o Payload recusar por
     * "Título inválido" em todos os blocos, que estão vazios em `en`. O erro
     * aponta para o bloco e não para o idioma, o que despista.
     *
     * `casarIds` preserva os ids de todos os níveis. Sem eles o Payload trata
     * cada bloco como novo, recria as linhas e o português fica órfão — já
     * escondeu 800px em /sobre e 742px numa página de solução.
     *
     * O texto repete o português por ora: o legado traduz navegação, não
     * conteúdo (P-08). */
    const gravado = await payload.findByID({ collection: 'segments', id: doc.id, locale: 'pt', depth: 0 })

    await payload.update({
      collection: 'segments',
      id: doc.id,
      data: {
        name: nome,
        slug: dados.slug,
        shortDescription: chamada,
        layout: casarIds(layout, gravado.layout) as never,
      },
      locale: 'en',
    })

    if (docs[0]) atualizados++
    else criados++
    console.log(`  ${nome.padEnd(38)} ${itens.length} cards`)
  } catch (erro) {
    falhas.push(`${vertical.slug}: ${erro instanceof Error ? erro.message : String(erro)}`)
  }
}

console.log(`\n  ${criados} criados · ${atualizados} atualizados · ${mantidos} mantidos · ${falhas.length} falhas`)

/* ⚠️ Banco novo: a migração de dados roda no `migrate`, antes de existir
 * segmento, e pula — a trava só age em página no formato desta importação, e
 * aí a migração já está marcada como feita. Chamá-la aqui fecha o ciclo. Onde
 * o segmento já foi remontado ou editado, a trava o deixa como está. */
console.log('\n→ remontando no padrão das páginas de solução')
await montarSegmentosDoWordpress({ payload } as never)
for (const f of falhas) console.log(`  ✗ ${f}`)
console.log(falhas.length ? '\n✗ importação com falhas' : '\n✓ importação completa')
process.exit(falhas.length ? 1 : 0)

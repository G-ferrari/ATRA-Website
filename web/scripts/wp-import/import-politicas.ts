/* MIG-094 — importação de `/politicas-e-termos` do WordPress.
 *
 * ⚠️ **Uma página, três links.** O rodapé do protótipo tem "Privacidade",
 * "Termos de Uso" e "Cookies" apontando para `#` (`App.tsx:2520`), mas o
 * WordPress não tem três documentos: tem um só, com as sete seções numeradas, e
 * cobre os três assuntos. Os 3 links passam a apontar para a mesma página, que
 * é o que o site no ar já faz.
 *
 * ⚠️ Isto **destrava a Fase 5**: MIG-100 liga o formulário de contato, e P-14
 * impede coletar dado pessoal sem política publicada. Não é conteúdo
 * institucional opcional — é pré-requisito de LGPD.
 *
 * Rodar com: pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-politicas.ts
 */
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from '../seed/ids'
import { createWpClient } from './client'
import { criarConversor } from './convert'
import { decodificar } from './texto'

const SLUG_NO_WP = 'politicas-e-termos'

/* O documento abre com o cabeçalho do template — `<h2> POLÍTICAS E TERMOS` e
 * `<h3> Políticas de Privacidade e Termos de Uso` — e o corpo começa em
 * "1. Introdução". O cabeçalho vira o herói da página; o resto vira o texto. */
const INICIO_DO_CORPO = /^\s*1\.\s/

const payload = await getPayload({ config })
const cliente = createWpClient()

console.log('→ baixando a página do WordPress')
const paginas = await cliente.pages({ _fields: 'id,slug,date,title,content,link' })
const pagina = paginas.find((p) => p.slug === SLUG_NO_WP)
if (!pagina) {
  console.error(`✗ ${SLUG_NO_WP} não existe no WordPress`)
  process.exit(1)
}

const doc = new JSDOM(pagina.content.rendered).window.document
for (const lixo of doc.querySelectorAll('form, select, script, style, img, input, textarea, button')) lixo.remove()

const blocos = [...doc.querySelectorAll('h1,h2,h3,h4,p,ul,ol')].filter((el) => (el.textContent ?? '').trim())
const inicio = blocos.findIndex((el) => INICIO_DO_CORPO.test(el.textContent ?? ''))
if (inicio < 0) {
  console.error('✗ não achei onde o corpo começa ("1. …") — o template do WordPress mudou')
  process.exit(1)
}

/* Só os blocos do corpo, achatados: o invólucro do Elementor aninha cinco
 * níveis e o conversor descartaria os `div` de qualquer jeito. Bloco dentro de
 * outro já selecionado é pulado, senão o `<p>` de dentro de um `<li>` entra
 * duas vezes. */
const selecionados: Element[] = []
for (const bloco of blocos.slice(inicio)) {
  if (selecionados.some((s) => s.contains(bloco))) continue
  selecionados.push(bloco)
}

const converter = await criarConversor()
const { raiz } = converter(selecionados.map((b) => b.outerHTML).join('\n'))

const titulo = decodificar(pagina.title.rendered).trim()

const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Legal',
    title: titulo,
    description: 'Políticas de Privacidade e Termos de Uso',
    align: 'left' as const,
    mediaMode: 'none' as const,
  },
  {
    blockType: 'richTextSection' as const,
    body: { root: raiz } as never,
  },
]

const { docs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'politicas-e-termos' } },
  limit: 1,
  locale: 'pt',
  depth: 0,
})

const dados = {
  title: titulo,
  slug: 'politicas-e-termos',
  layout: layout as never,
  _status: 'published' as const,
}

const salvo = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

/* ⚠️ O inglês reenvia o layout inteiro com `casarIds`, e não só título e slug:
 * atualizar documento publicado revalida os obrigatórios **do idioma gravado**,
 * e o Payload recusaria por "Título inválido" nos blocos vazios em `en`. O
 * texto repete o português por ora — traduzir documento jurídico é trabalho de
 * quem responde por ele, não da migração (P-08). */
const gravado = await payload.findByID({ collection: 'pages', id: salvo.id, locale: 'pt', depth: 0 })

await payload.update({
  collection: 'pages',
  id: salvo.id,
  data: {
    title: titulo,
    slug: 'privacy-and-terms',
    layout: casarIds(layout, gravado.layout) as never,
  },
  locale: 'en',
})

console.log(`  ${titulo} · ${selecionados.length} blocos de texto`)
console.log('\n✓ importação completa')
process.exit(0)

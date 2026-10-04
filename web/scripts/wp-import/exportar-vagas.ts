/* Exporta as vagas abertas no WordPress para dentro do repositório, para
 * chegarem a um ambiente **que já existe** por migração de dados (03/10).
 *
 * É o caminho dos artigos novos (`exportar-posts.ts`): o importador
 * (`import-jobs.ts`) grava direto no banco em que roda, e só quem tem acesso ao
 * servidor consegue rodá-lo lá. Aqui o texto sai já convertido, com o mesmo
 * recorte (`corpoDaVaga`) e o mesmo conversor do importador, em
 * `src/migrations/arquivos/vagas-wp/vagas.json`, e a migração
 * `20261003_120000_vagas_do_wordpress` cria o que falta no deploy.
 *
 * Não toca em banco nenhum. A lista que sai é a de **hoje** no WordPress: vaga
 * que fechou não aparece, e é a migração que despublica as que saíram.
 *
 * Rodar com: pnpm exec tsx scripts/wp-import/exportar-vagas.ts */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { slugify } from '../../src/fields/slug'
import type { VagaExportada } from '../../src/migrations/arquivos/vagas-wp/tipos'
import { createWpClient } from './client'
import { criarConversor, imagensPendentes } from './convert'
import { decodificar, encurtar, textoPuro } from './texto'
import { corpoDaVaga, modeloDeTrabalho } from './vagas'

/** O mesmo marcador do importador: está em toda página de vaga e em nenhuma outra. */
const MARCADOR_DE_VAGA = /#vemserATRA/i

const ARQUIVO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src/migrations/arquivos/vagas-wp/vagas.json')

/* `refresh`: o cache em disco não expira, e devolveria a lista da carga de
 * agosto — justamente a que este script existe para corrigir. */
const cliente = createWpClient({ cacheMode: 'refresh' })

console.log('→ baixando as páginas do WordPress')
const paginas = await cliente.pages({ _fields: 'id,slug,date,title,content,link,status' })
const vagas = paginas.filter((p) => MARCADOR_DE_VAGA.test(p.content.rendered)).sort((a, b) => a.date.localeCompare(b.date))
console.log(`  ${paginas.length} páginas · ${vagas.length} são vagas`)

const converter = await criarConversor()
const exportadas: VagaExportada[] = []

for (const pagina of vagas) {
  const titulo = decodificar(pagina.title.rendered).trim()
  const html = corpoDaVaga(pagina.content.rendered, titulo)
  if (!html.trim()) throw new Error(`[${pagina.slug}] corpo vazio depois de recortar o template`)
  const { raiz } = converter(html)
  /* Vaga não tem imagem no corpo; se um dia tiver, a migração não sabe subir. */
  const imagens = imagensPendentes(raiz)
  if (imagens.length) throw new Error(`[${pagina.slug}] o corpo tem imagem, e a migração de vagas não sobe mídia: ${imagens.join(', ')}`)

  const texto = textoPuro(html)
  exportadas.push({
    slug: slugify(pagina.slug),
    titulo,
    resumo: encurtar(texto),
    modelo: modeloDeTrabalho(texto),
    publicadaEm: pagina.date,
    // O caminho da página, com barra final, como o `redirects.csv` escreve.
    origem: pagina.link ? new URL(pagina.link).pathname : `/${pagina.slug}/`,
    corpo: raiz,
  })
  console.log(`  ${titulo.padEnd(56)} ${modeloDeTrabalho(texto)}`)
}

writeFileSync(ARQUIVO, `${JSON.stringify(exportadas, null, 2)}\n`)
console.log(`\n✓ ${exportadas.length} vagas em ${path.relative(process.cwd(), ARQUIVO)}`)

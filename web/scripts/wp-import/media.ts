/* MIG-082 — importador de mídia do WordPress.
 *
 * Baixa a imagem destacada e as do corpo, cria o documento em `media` e devolve
 * o id, para o conversor trocar o nó pendente pela relação real.
 *
 * Nada daqui pode ser importado por `src/`: é ferramenta de importação. */
import type { Payload } from 'payload'

import type { WpClient } from './client'
import type { WpMedia } from './types'

export type FonteDoAlt = 'biblioteca' | 'tituloDaMidia' | 'tituloDoPost'

export type ResumoDeMidia = {
  baixadas: number
  reaproveitadas: number
  alt: Record<FonteDoAlt, number>
}

export type ImportadorDeMidia = {
  /** Id do WP para uma URL de imagem, inclusive variante de tamanho. */
  idDaUrl(url: string): number | undefined
  /** Id no Payload, baixando se ainda não existir. `reserva` alimenta o alt. */
  garantir(wpId: number, reserva: string): Promise<number>
  resumo(): ResumoDeMidia
}

/**
 * Nome do arquivo no acervo. **A chave é o id do WP**, não o nome do arquivo.
 *
 * ⚠️ Não reaproveitar o truque das seeds (procurar por `filename contains
 * <nome sem extensão>`). Entre as 287 imagens usadas pelos posts há **17
 * colisões de nome-base** — quatro arquivos distintos chamados
 * `banner-site-blog-1`, dois `banner-site-blog-5` — e nomes como `1`, `4` e
 * `ai`, que casariam com metade do acervo. Procurar por nome importaria uma
 * imagem no lugar de outra, calado.
 */
export function nomeDeArquivo(m: WpMedia): string {
  const original = decodeURIComponent(m.source_url.split('/').pop() ?? `${m.id}`)
  const ponto = original.lastIndexOf('.')
  const base = (ponto > 0 ? original.slice(0, ponto) : original).slice(0, 80)
  const ext = ponto > 0 ? original.slice(ponto) : ''
  return `wp-${m.id}-${base}${ext}`
}

/**
 * Título do WP que na verdade é nome de arquivo.
 *
 * O WordPress deriva o título do nome do arquivo quando ninguém preenche, então
 * `4`, `tendencia` e `1-innovation-from-informatica-world-3` chegam como
 * "título". Servem de alt tanto quanto o nome do arquivo serviria — ou seja,
 * nada — enquanto `ATRA no Rio Preto Tech Summit 2026` serve.
 */
export function pareceNomeDeArquivo(titulo: string): boolean {
  const t = titulo.trim()
  if (!t) return true
  if (!/\s/.test(t)) return true
  if (/^[\d\W_]+$/.test(t)) return true
  return /^(img|dsc|whatsapp|image|foto|screenshot)[-_\s]/i.test(t)
}

/**
 * De onde sai o texto alternativo, em ordem de qualidade.
 *
 * Medido nas 287 imagens que os 207 posts usam: **47** têm `alt_text` de
 * verdade, **193** têm título que é uma frase, e **47** não têm nada
 * aproveitável — essas ficam com o título do artigo, que descreve uma capa
 * razoavelmente e é melhor do que `4.png`.
 *
 * ⚠️ O atributo `alt` do `<img>` no corpo do post **não** entra: medido, ele só
 * existe nas mesmas 47 que já têm `alt_text`, e não acrescenta nenhuma. O nível
 * foi retirado depois de medir, não antes.
 */
export function resolverAlt(m: WpMedia, reserva: string): { alt: string; fonte: FonteDoAlt } {
  const daBiblioteca = (m.alt_text ?? '').trim()
  if (daBiblioteca) return { alt: daBiblioteca, fonte: 'biblioteca' }

  const titulo = (m.title?.rendered ?? '').trim()
  if (titulo && !pareceNomeDeArquivo(titulo)) return { alt: titulo, fonte: 'tituloDaMidia' }

  return { alt: reserva, fonte: 'tituloDoPost' }
}

const limparHtml = (s: string) =>
  s.replace(/<[^>]*>/g, ' ').replace(/&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()

export async function criarImportadorDeMidia(args: {
  payload: Payload
  cliente: WpClient
  midias: WpMedia[]
  log?: (linha: string) => void
}): Promise<ImportadorDeMidia> {
  const { payload, cliente, midias, log = () => {} } = args

  const porId = new Map(midias.map((m) => [m.id, m]))

  /* Índice URL → id do WP, com as variantes de tamanho.
   *
   * ⚠️ O `<img>` do corpo aponta para o recorte (`…-1024x683.jpg`), não para o
   * original. Sem as variantes, 284 das 287 imagens não casariam com item nenhum
   * da biblioteca e o importador as trataria como externas. */
  const porUrl = new Map<string, number>()
  for (const m of midias) {
    porUrl.set(m.source_url, m.id)
    for (const s of Object.values(m.media_details?.sizes ?? {})) {
      if (s.source_url) porUrl.set(s.source_url, m.id)
    }
  }

  const cache = new Map<number, number>()
  const resumo: ResumoDeMidia = { baixadas: 0, reaproveitadas: 0, alt: { biblioteca: 0, tituloDaMidia: 0, tituloDoPost: 0 } }

  return {
    idDaUrl: (url) => porUrl.get(url),
    resumo: () => resumo,

    async garantir(wpId, reserva) {
      const emMemoria = cache.get(wpId)
      if (emMemoria) return emMemoria

      const m = porId.get(wpId)
      if (!m) throw new Error(`[media] id ${wpId} não está na biblioteca do WP.`)

      const nome = nomeDeArquivo(m)
      const chave = `wp-${wpId}-`
      const { alt, fonte } = resolverAlt(m, reserva)

      /* ⚠️ O Payload reencoda para WebP no upload, então o documento criado a
       * partir de `wp-8441-banner.png` fica gravado como `wp-8441-banner.webp`.
       * A busca é pelo prefixo do id, que sobrevive à troca de extensão. */
      const { docs } = await payload.find({
        collection: 'media',
        where: { filename: { contains: chave } },
        limit: 1,
        depth: 0,
      })

      if (docs[0]) {
        cache.set(wpId, docs[0].id)
        resumo.reaproveitadas++
        return docs[0].id
      }

      /* Baixa o **original**, não a variante: os recortes de 400/768/1600 são
       * gerados pelo próprio Payload no upload (`Media.imageSizes`). */
      const bin = await cliente.fetchBinary(m.source_url)
      const legenda = limparHtml(m.caption?.rendered ?? '')

      const doc = await payload.create({
        collection: 'media',
        locale: 'pt',
        data: { alt, ...(legenda ? { caption: legenda } : {}) },
        file: {
          data: bin.bytes,
          mimetype: bin.contentType ?? m.mime_type ?? 'image/jpeg',
          name: nome,
          size: bin.bytes.length,
        },
      })

      cache.set(wpId, doc.id)
      resumo.baixadas++
      resumo.alt[fonte]++
      log(`  ↓ wp:${wpId} → media:${doc.id}  ${nome}`)
      return doc.id
    },
  }
}

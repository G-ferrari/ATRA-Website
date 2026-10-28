import { revalidatePath } from 'next/cache'

import { marcarIndiceDesatualizado } from '../lib/busca-da-ia/agenda'
import { invalidarCatalogoDaIa } from '../lib/cache-do-catalogo-da-ia'
import { pedirRevalidacaoAoProprioServidor } from '../lib/revalidacao-de-fora'

/* MIG-143 — publicar no CMS passa a atualizar o site.
 *
 * As páginas são pré-renderizadas no build, e até aqui **nada** as invalidava:
 * o que o editor publicasse só aparecia no deploy seguinte. Era a lacuna que o
 * `REVALIDATE_SECRET` denunciava — um segredo provisionado em todos os
 * ambientes para um endpoint que nunca foi construído. O endpoint continua não
 * existindo, de propósito: o Payload roda **dentro** do processo do Next, então
 * o hook chama `revalidatePath` direto, sem HTTP e sem segredo para vazar.
 *
 * ⚠️ `'/'` com `'layout'` invalida o site inteiro, e é escolha (KISS), não
 * preguiça: mapear cada collection para suas rotas — post → /blog, /blog/[slug],
 * home (que lista posts), /insights (idem), sitemap… — é uma tabela que mente
 * na primeira rota nova. O custo do jeito largo é re-renderizar sob demanda
 * páginas que não mudaram, para um site em que publicar é evento de marketing,
 * não de tráfego. Se um dia doer, o refinamento é por aqui.
 *
 * O try/catch não é enfeite: o seed e os importadores usam a Local API em
 * processo **fora** do Next (o contêiner `migrate`), onde `revalidatePath`
 * lança por não haver requisição. Lá a invalidação é dispensável — o build
 * roda depois — e derrubar a importação por causa dela seria o rabo abanando
 * o cachorro.
 */
export function revalidarSite(): void {
  /* D-60 — a ATRA AI lê o catálogo do site de um cache em memória. Publicar,
     editar ou apagar qualquer coisa zera esse cache, e a conversa seguinte já
     enxerga a mudança. Fora do `try`: é só um mapa, vale em qualquer processo. */
  invalidarCatalogoDaIa()
  /* D-73 — e o índice da busca dela se refaz alguns segundos depois. */
  marcarIndiceDesatualizado()

  try {
    revalidatePath('/', 'layout')
  } catch {
    /* Fora de requisição: a fila do Payload, no processo do Next, pede ao
       próprio servidor; seed e wp-import, fora dele, não têm o que invalidar. */
    pedirRevalidacaoAoProprioServidor()
  }
}

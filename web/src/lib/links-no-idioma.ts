import { lerCaminhoPortugues, type SecaoComItem } from './routes'

/* Os destinos de link de um objeto de apresentação — blocos, menu, rodapé
 * (D-71).
 *
 * Os mappers entregam o destino como o admin escreveu; quem o põe no idioma da
 * página é `comLinksNoIdioma` (`lib/traduzir-links.ts`), depois, no servidor —
 * o mesmo passo de `comVagas` e `comContato`: bloco não busca dado. Aqui fica a
 * parte que não consulta o banco: achar os destinos e saber que itens eles
 * citam, para a consulta sair em lote.
 *
 * Pelo nome do campo, e não bloco a bloco: um bloco novo com `href` entra sem
 * ninguém lembrar. ⚠️ Um campo de destino com outro nome precisa entrar em
 * `CAMPOS_DE_DESTINO`. */

const CAMPOS_DE_DESTINO = new Set(['href', 'ctaHref', 'secondaryHref'])

/* `body` é texto rico (Lexical): os links dele passam pelo conversor de
   `components/content/rich-text.tsx`, sem consulta ao banco. */
const FORA = new Set(['body'])

/** Aplica `fn` a cada destino de link do objeto, no lugar. */
export function visitarLinks(alvo: unknown, fn: (href: string) => string): void {
  const vistos = new WeakSet<object>()
  const visitar = (valor: unknown) => {
    if (!valor || typeof valor !== 'object' || vistos.has(valor)) return
    vistos.add(valor)
    if (Array.isArray(valor)) {
      for (const v of valor) visitar(v)
      return
    }
    const objeto = valor as Record<string, unknown>
    for (const [chave, v] of Object.entries(objeto)) {
      if (FORA.has(chave)) continue
      if (CAMPOS_DE_DESTINO.has(chave) && typeof v === 'string') objeto[chave] = fn(v)
      else visitar(v)
    }
  }
  visitar(alvo)
}

/** Os destinos de link do objeto, na ordem em que aparecem. */
export function linksDe(alvo: unknown): string[] {
  const links: string[] = []
  visitarLinks(alvo, (href) => {
    links.push(href)
    return href
  })
  return links
}

/** Os itens que links portugueses citam, por seção: `/cases-de-sucesso/x` →
 *  `cases: {x}`. É a lista que vira uma consulta por collection. */
export function itensCitados(hrefs: Iterable<string>): Map<SecaoComItem, Set<string>> {
  const itens = new Map<SecaoComItem, Set<string>>()
  for (const href of hrefs) {
    const alvo = lerCaminhoPortugues(href)
    if (alvo?.tipo !== 'item') continue
    const slugs = itens.get(alvo.secao) ?? new Set<string>()
    slugs.add(alvo.slug)
    itens.set(alvo.secao, slugs)
  }
  return itens
}

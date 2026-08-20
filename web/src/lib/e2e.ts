/* Congelamento para regressão visual.
 *
 * Espelha `legacy/src/lib/e2e.ts`: com `?e2e=1` na URL, carrossel e rotação
 * param no primeiro item. Sem a flag, o comportamento é o de produção.
 *
 * Precisa existir dos dois lados — o gabarito é capturado no legado com a flag
 * e comparado contra o app novo com a mesma flag. Ver
 * docs/03-plano/estrategia-de-testes.md. */

export const congelado = (): boolean => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('e2e') === '1'
}

/* mulberry32 — o **mesmo** gerador de `legacy/src/lib/e2e.ts`, com a **mesma**
 * semente. As partículas do herói da home saem de `aleatorio()`, e o aceite
 * visual compara os dois canvas pixel a pixel: semente diferente, ou ordem de
 * chamada diferente, e a nuvem de pontos não coincide.
 *
 * ⚠️ O gerador é de módulo, não por campo. Cada partícula consome 4 números na
 * ordem (x, y, raio, cor — a velocidade só é sorteada fora do congelamento), e
 * um `resize` recria a nuvem inteira consumindo mais. Os dois apps só casam
 * porque fazem a mesma sequência de chamadas; mexer na contagem de partículas
 * de um lado quebra o gabarito sem tocar em nenhum pixel de layout. */
const criarGerador = (semente: number) => {
  let estado = semente >>> 0
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0
    let t = estado
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const geradorFixo = criarGerador(20260818)

/** `Math.random()` normalmente; sequência determinística sob `?e2e=1`. */
export const aleatorio = (): number => (congelado() ? geradorFixo() : Math.random())

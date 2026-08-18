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

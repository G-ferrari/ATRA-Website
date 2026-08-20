/* Congelamento para regressão visual.
 *
 * Com `?e2e=1` na URL, tudo que muda sozinho para no primeiro estado: rotação
 * de palavra do hero, os três carrosséis, e as partículas do canvas passam a
 * usar uma sequência pseudoaleatória determinística.
 *
 * Sem a flag, o comportamento é exatamente o de sempre — nada muda para o
 * visitante. É alteração de teste, não de produto.
 *
 * Existe porque o gabarito da comparação precisa ser reprodutível: sem isto,
 * duas capturas da mesma home saem diferentes. Ver
 * docs/03-plano/estrategia-de-testes.md. */

export const congelado = (): boolean => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('e2e') === '1';
};

/* mulberry32: gerador determinístico, curto e suficiente para posicionar
 * partículas. Mesma semente ⇒ mesmo layout, captura após captura. */
const criarGerador = (semente: number) => {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const SEMENTE = 20260818;
let geradorFixo = criarGerador(SEMENTE);

/** `Math.random()` normalmente; sequência determinística sob `?e2e=1`. */
export const aleatorio = (): number => (congelado() ? geradorFixo() : Math.random());

/* Recomeça a sequência do zero.
 *
 * ⚠️ Sem isto o congelamento não congela nada. A captura de página inteira
 * redimensiona a janela, o `resize` recria a nuvem de partículas, e como o
 * gerador é contínuo cada recriação sorteia posições novas — o Playwright
 * desistia de capturar a home com "failed to take two consecutive stable
 * screenshots". Chamado antes de repovoar a nuvem, o campo vira função pura da
 * largura e da altura, aqui e no app novo. */
export const reiniciarAleatorio = (): void => {
  if (congelado()) geradorFixo = criarGerador(SEMENTE);
};

/** Rotas portadas com gabarito no legado. Cresce a cada rota da Fase 3. */
export const ROTAS_COM_GABARITO = [
  { nome: 'cases-listagem', caminho: '/cases-de-sucesso' },
  { nome: 'cases-detalhe', caminho: '/cases-de-sucesso/eficiencia-processos-risco' },
  { nome: 'glossario', caminho: '/glossario' },
  { nome: 'relatorios', caminho: '/relatorios' },
  { nome: 'ebooks', caminho: '/ebooks' },
  { nome: 'webinars', caminho: '/webinars' },
  { nome: 'blog', caminho: '/blog' },
  { nome: 'sobre', caminho: '/sobre' },
  /* Entrou tarde: MIG-052 fechou /consultores sem gabarito, e 57% da página
     estava faltando sem ninguém ver. Ver a nota no topo de `consultores/page.tsx`. */
  { nome: 'consultores', caminho: '/consultores' },
  /* Pelo mesmo motivo: MIG-050 fechou /carreiras com quatro das sete seções, e
     sem gabarito ninguém viu os 4.428px que faltavam. Ver `seed/carreiras.ts`. */
  { nome: 'carreiras', caminho: '/carreiras' },
  /* `/solucoes` (o índice) fica **fora**: D-09 mudou o comportamento da rota e
     não há gabarito — o legado serve ali a página de IA. É esta que compara. */
  { nome: 'solucao-detalhe', caminho: '/solucoes/inteligencia-artificial' },
] as const

/* Imagens entram mascaradas na comparação.
 *
 * O legado serve o JPEG original; o app novo serve variante responsiva
 * reencodada pelo next/image (WebP, qualidade 75, largura por viewport). Os
 * bytes divergem por projeto, não por regressão — era ~1% dos pixels, todo ele
 * dentro das imagens. Mascarar mantém no teste o que importa: posição, caixa e
 * dimensão da imagem, além de toda a tipografia e layout ao redor.
 *
 * O que o mascaramento deixa de cobrir — imagem certa no lugar certo — é
 * coberto por `smoke.spec.ts`, que confere src e alt. */
export const MASCARA = 'img'
export const COR_DA_MASCARA = '#ff00ff'
